"""
routers/projects.py

Endpoints:
  Worker (authenticated, role=worker):
    GET  /api/worker/dashboard            → active projects + stats + recent completed
    GET  /api/worker/projects             → all of this worker's projects (filterable)
    GET  /api/worker/projects/{id}        → single project detail
    GET  /api/worker/projects/{id}/messages     → chat thread for a project
    POST /api/worker/projects/{id}/messages     → send a message

  Customer (authenticated, role=customer):
    POST /api/projects                    → create a new project
    GET  /api/projects                    → customer's own projects
    GET  /api/projects/{id}               → project detail (must own it)
    POST /api/projects/{id}/review        → submit a review after completion

  Admin (role=admin):
    GET  /api/admin/projects              → all projects on the platform
    PATCH /api/admin/projects/{id}/assign → assign a worker to a pending project
    PATCH /api/admin/projects/{id}/status → move project status forward
    PATCH /api/admin/projects/{id}/complete → mark complete + credit worker wallet
"""

from datetime import datetime, timezone
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from db.database import supabase
from db.models import (
    MessageCreate, MessageResponse,
    ProjectAssign, ProjectCreate, ProjectResponse, ProjectStatusUpdate,
    ReviewCreate, ReviewResponse,
    SlimUser,
    WorkerActivityStats, WorkerDashboardResponse,
    strip_sensitive_fields,
)
from routers.auth import get_current_user

router = APIRouter(tags=["projects"])


# ──────────────────────────────────────────────────────────────────────────────
# Internal helpers
# ──────────────────────────────────────────────────────────────────────────────

def _require_role(user: dict, *roles: str):
    """Raise 403 if the current user's role is not in the allowed set."""
    if user.get("role") not in roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access restricted. Required role: {' or '.join(roles)}.",
        )


def _now_utc() -> str:
    return datetime.now(timezone.utc).isoformat()


def _slim_user(user_row: Optional[dict]) -> Optional[SlimUser]:
    if not user_row:
        return None
    return SlimUser(
        id=str(user_row["id"]),
        full_name=user_row.get("full_name"),
        first_name=user_row.get("first_name"),
        last_name=user_row.get("last_name"),
        avatar_url=user_row.get("avatar_url"),
    )


def _fetch_user(user_id: Optional[str]) -> Optional[dict]:
    if not user_id:
        return None
    res = supabase.table("users").select(
        "id, full_name, first_name, last_name, avatar_url"
    ).eq("id", user_id).execute()
    return res.data[0] if res.data else None


def _enrich_project(row: dict) -> ProjectResponse:
    """Add embedded customer/worker slim profiles to a raw project row."""
    customer = _slim_user(_fetch_user(row.get("customer_id")))
    worker = _slim_user(_fetch_user(row.get("worker_id")))

    # Count unread messages where the current worker is NOT the sender
    # (lightweight: just count rows)
    unread = 0
    if row.get("id"):
        unread_res = supabase.table("project_messages").select(
            "id", count="exact"
        ).eq("project_id", row["id"]).eq("is_read", False).execute()
        unread = unread_res.count or 0

    return ProjectResponse(
        id=str(row["id"]),
        title=row["title"],
        description=row.get("description"),
        category=row.get("category"),
        status=row["status"],
        budget=Decimal(str(row["budget"])) if row.get("budget") is not None else None,
        amount_paid=Decimal(str(row.get("amount_paid", 0))),
        started_at=row.get("started_at"),
        deadline_at=row.get("deadline_at"),
        completed_at=row.get("completed_at"),
        created_at=row.get("created_at"),
        updated_at=row.get("updated_at"),
        customer=customer,
        worker=worker,
        unread_messages=unread,
    )


def _compute_stats(worker_id: str) -> WorkerActivityStats:
    """Aggregate project counts and ratings for a worker."""
    all_res = supabase.table("projects").select(
        "id, status"
    ).eq("worker_id", worker_id).execute()

    rows = all_res.data or []
    total = len(rows)
    active = sum(1 for r in rows if r["status"] == "active")
    completed = sum(1 for r in rows if r["status"] == "completed")
    cancelled = sum(1 for r in rows if r["status"] == "cancelled")
    completion_rate = round((completed / total * 100), 1) if total > 0 else 0.0

    # Average rating from reviews
    rev_res = supabase.table("project_reviews").select(
        "rating"
    ).eq("worker_id", worker_id).execute()
    reviews = rev_res.data or []
    avg_rating = None
    if reviews:
        avg_rating = round(sum(r["rating"] for r in reviews) / len(reviews), 2)

    return WorkerActivityStats(
        total_projects=total,
        active_projects=active,
        completed_projects=completed,
        cancelled_projects=cancelled,
        completion_rate=completion_rate,
        average_rating=avg_rating,
        total_reviews=len(reviews),
    )


# ──────────────────────────────────────────────────────────────────────────────
# WORKER endpoints
# ──────────────────────────────────────────────────────────────────────────────

@router.get("/api/worker/dashboard", response_model=WorkerDashboardResponse)
async def worker_dashboard(current_user: dict = Depends(get_current_user)):
    """
    Single-fetch endpoint that powers the worker Home tab:
      - All active projects (ordered by soonest deadline)
      - Overall activity stats
      - Most recent 5 completed projects
    """
    _require_role(current_user, "worker", "admin")
    worker_id = str(current_user["id"])

    # Active projects — ordered by upcoming deadline first
    active_res = supabase.table("projects").select("*").eq(
        "worker_id", worker_id
    ).eq("status", "active").order("deadline_at", desc=False).execute()

    # Recent 5 completed
    completed_res = supabase.table("projects").select("*").eq(
        "worker_id", worker_id
    ).eq("status", "completed").order("completed_at", desc=True).limit(5).execute()

    stats = _compute_stats(worker_id)

    return WorkerDashboardResponse(
        active_projects=[_enrich_project(r) for r in (active_res.data or [])],
        activity=stats,
        recent_completed=[_enrich_project(r) for r in (completed_res.data or [])],
    )


@router.get("/api/worker/projects", response_model=list[ProjectResponse])
async def worker_projects(
    status_filter: Optional[str] = Query(None, alias="status"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: dict = Depends(get_current_user),
):
    """
    Paginated list of this worker's projects.
    Filter by status: pending | active | completed | cancelled
    """
    _require_role(current_user, "worker", "admin")
    worker_id = str(current_user["id"])

    query = supabase.table("projects").select("*").eq("worker_id", worker_id)
    if status_filter:
        query = query.eq("status", status_filter)

    res = query.order("created_at", desc=True).range(offset, offset + limit - 1).execute()
    return [_enrich_project(r) for r in (res.data or [])]


@router.get("/api/worker/projects/{project_id}", response_model=ProjectResponse)
async def worker_project_detail(
    project_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Single project detail — worker must own this project."""
    _require_role(current_user, "worker", "admin")
    worker_id = str(current_user["id"])

    res = supabase.table("projects").select("*").eq("id", project_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Project not found.")

    project = res.data[0]
    if project.get("worker_id") != worker_id and current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Access denied.")

    return _enrich_project(project)


@router.get("/api/worker/projects/{project_id}/messages", response_model=list[MessageResponse])
async def get_project_messages(
    project_id: str,
    limit: int = Query(50, ge=1, le=200),
    before_id: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user),
):
    """Fetch the chat thread for a project. Marks messages as read for this user."""
    _require_role(current_user, "worker", "customer", "admin")
    user_id = str(current_user["id"])

    # Verify user is a participant (customer or worker of this project)
    proj_res = supabase.table("projects").select(
        "id, customer_id, worker_id"
    ).eq("id", project_id).execute()
    if not proj_res.data:
        raise HTTPException(status_code=404, detail="Project not found.")

    proj = proj_res.data[0]
    if user_id not in (str(proj.get("customer_id", "")), str(proj.get("worker_id", ""))) \
            and current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not a participant of this project.")

    query = supabase.table("project_messages").select("*").eq("project_id", project_id)
    if before_id:
        # Cursor-based pagination: fetch messages before this message id
        cursor_res = supabase.table("project_messages").select(
            "created_at"
        ).eq("id", before_id).execute()
        if cursor_res.data:
            query = query.lt("created_at", cursor_res.data[0]["created_at"])

    msg_res = query.order("created_at", desc=True).limit(limit).execute()
    messages = list(reversed(msg_res.data or []))

    # Mark messages sent by the other party as read
    supabase.table("project_messages").update(
        {"is_read": True}
    ).eq("project_id", project_id).neq("sender_id", user_id).eq("is_read", False).execute()

    result = []
    for m in messages:
        sender = _slim_user(_fetch_user(m.get("sender_id")))
        result.append(MessageResponse(
            id=str(m["id"]),
            project_id=str(m["project_id"]),
            sender_id=str(m["sender_id"]),
            content=m["content"],
            is_read=m["is_read"],
            created_at=m.get("created_at"),
            sender=sender,
        ))
    return result


@router.post(
    "/api/worker/projects/{project_id}/messages",
    response_model=MessageResponse,
    status_code=201,
)
async def send_project_message(
    project_id: str,
    body: MessageCreate,
    current_user: dict = Depends(get_current_user),
):
    """Send a message in a project chat thread."""
    _require_role(current_user, "worker", "customer", "admin")
    user_id = str(current_user["id"])

    proj_res = supabase.table("projects").select(
        "id, customer_id, worker_id"
    ).eq("id", project_id).execute()
    if not proj_res.data:
        raise HTTPException(status_code=404, detail="Project not found.")

    proj = proj_res.data[0]
    if user_id not in (str(proj.get("customer_id", "")), str(proj.get("worker_id", ""))) \
            and current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not a participant of this project.")

    insert_res = supabase.table("project_messages").insert({
        "project_id": project_id,
        "sender_id": user_id,
        "content": body.content.strip(),
        "is_read": False,
    }).execute()

    if not insert_res.data:
        raise HTTPException(status_code=500, detail="Failed to send message.")

    row = insert_res.data[0]
    sender = _slim_user(_fetch_user(user_id))
    return MessageResponse(
        id=str(row["id"]),
        project_id=str(row["project_id"]),
        sender_id=str(row["sender_id"]),
        content=row["content"],
        is_read=row["is_read"],
        created_at=row.get("created_at"),
        sender=sender,
    )


# ──────────────────────────────────────────────────────────────────────────────
# CUSTOMER endpoints
# ──────────────────────────────────────────────────────────────────────────────

@router.post("/api/projects", response_model=ProjectResponse, status_code=201)
async def create_project(
    body: ProjectCreate,
    current_user: dict = Depends(get_current_user),
):
    """Customer creates a new project request. Status starts as 'pending'."""
    _require_role(current_user, "customer", "admin")
    customer_id = str(current_user["id"])

    insert_res = supabase.table("projects").insert({
        "title": body.title.strip(),
        "description": body.description.strip() if body.description else None,
        "category": body.category,
        "status": "pending",
        "customer_id": customer_id,
        "budget": float(body.budget) if body.budget is not None else None,
        "deadline_at": body.deadline_at.isoformat() if body.deadline_at else None,
    }).execute()

    if not insert_res.data:
        raise HTTPException(status_code=500, detail="Failed to create project.")

    return _enrich_project(insert_res.data[0])


@router.get("/api/projects", response_model=list[ProjectResponse])
async def customer_projects(
    status_filter: Optional[str] = Query(None, alias="status"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: dict = Depends(get_current_user),
):
    """List all projects created by the current customer."""
    _require_role(current_user, "customer", "admin")
    customer_id = str(current_user["id"])

    query = supabase.table("projects").select("*").eq("customer_id", customer_id)
    if status_filter:
        query = query.eq("status", status_filter)

    res = query.order("created_at", desc=True).range(offset, offset + limit - 1).execute()
    return [_enrich_project(r) for r in (res.data or [])]


@router.get("/api/projects/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Project detail — accessible by the customer who owns it, the assigned worker, or admin."""
    user_id = str(current_user["id"])

    res = supabase.table("projects").select("*").eq("id", project_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Project not found.")

    project = res.data[0]
    is_owner = user_id == str(project.get("customer_id", ""))
    is_worker = user_id == str(project.get("worker_id", ""))
    is_admin = current_user.get("role") == "admin"

    if not (is_owner or is_worker or is_admin):
        raise HTTPException(status_code=403, detail="Access denied.")

    return _enrich_project(project)


@router.post(
    "/api/projects/{project_id}/review",
    response_model=ReviewResponse,
    status_code=201,
)
async def submit_review(
    project_id: str,
    body: ReviewCreate,
    current_user: dict = Depends(get_current_user),
):
    """Customer submits a 1–5 star review after project is completed."""
    _require_role(current_user, "customer", "admin")
    reviewer_id = str(current_user["id"])

    res = supabase.table("projects").select("*").eq("id", project_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Project not found.")

    project = res.data[0]
    if project["status"] != "completed":
        raise HTTPException(
            status_code=400,
            detail="Reviews can only be submitted for completed projects.",
        )
    if str(project.get("customer_id", "")) != reviewer_id and current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Only the project's customer can review it.")

    if not project.get("worker_id"):
        raise HTTPException(status_code=400, detail="No worker assigned to this project.")

    try:
        insert_res = supabase.table("project_reviews").insert({
            "project_id": project_id,
            "reviewer_id": reviewer_id,
            "worker_id": str(project["worker_id"]),
            "rating": body.rating,
            "comment": body.comment,
        }).execute()
    except Exception as e:
        if "unique" in str(e).lower():
            raise HTTPException(
                status_code=409, detail="You have already reviewed this project."
            )
        raise HTTPException(status_code=500, detail=str(e))

    if not insert_res.data:
        raise HTTPException(status_code=500, detail="Failed to submit review.")

    row = insert_res.data[0]
    reviewer = _slim_user(_fetch_user(reviewer_id))
    return ReviewResponse(
        id=str(row["id"]),
        project_id=str(row["project_id"]),
        worker_id=str(row["worker_id"]),
        rating=row["rating"],
        comment=row.get("comment"),
        created_at=row.get("created_at"),
        reviewer=reviewer,
    )


# ──────────────────────────────────────────────────────────────────────────────
# ADMIN endpoints
# ──────────────────────────────────────────────────────────────────────────────

@router.get("/api/admin/projects", response_model=list[ProjectResponse])
async def admin_all_projects(
    status_filter: Optional[str] = Query(None, alias="status"),
    worker_id_filter: Optional[str] = Query(None, alias="worker_id"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    current_user: dict = Depends(get_current_user),
):
    """Admin: list all projects on the platform with optional filters."""
    _require_role(current_user, "admin")

    query = supabase.table("projects").select("*")
    if status_filter:
        query = query.eq("status", status_filter)
    if worker_id_filter:
        query = query.eq("worker_id", worker_id_filter)

    res = query.order("created_at", desc=True).range(offset, offset + limit - 1).execute()
    return [_enrich_project(r) for r in (res.data or [])]


@router.patch("/api/admin/projects/{project_id}/assign", response_model=ProjectResponse)
async def admin_assign_worker(
    project_id: str,
    body: ProjectAssign,
    current_user: dict = Depends(get_current_user),
):
    """Admin: assign a worker to a pending project and move it to 'active'."""
    _require_role(current_user, "admin")

    # Verify worker exists and has role=worker
    worker_res = supabase.table("users").select("id, role").eq("id", body.worker_id).execute()
    if not worker_res.data:
        raise HTTPException(status_code=404, detail="Worker not found.")
    if worker_res.data[0].get("role") not in ("worker", "admin"):
        raise HTTPException(status_code=400, detail="Target user is not a worker.")

    # Verify project exists
    proj_res = supabase.table("projects").select("*").eq("id", project_id).execute()
    if not proj_res.data:
        raise HTTPException(status_code=404, detail="Project not found.")

    update_res = supabase.table("projects").update({
        "worker_id": body.worker_id,
        "status": "active",
        "started_at": _now_utc(),
        "updated_at": _now_utc(),
    }).eq("id", project_id).execute()

    if not update_res.data:
        raise HTTPException(status_code=500, detail="Failed to assign worker.")

    return _enrich_project(update_res.data[0])


@router.patch("/api/admin/projects/{project_id}/status", response_model=ProjectResponse)
async def admin_update_status(
    project_id: str,
    body: ProjectStatusUpdate,
    current_user: dict = Depends(get_current_user),
):
    """Admin: update a project's status (e.g. cancel a project)."""
    _require_role(current_user, "admin")

    proj_res = supabase.table("projects").select("*").eq("id", project_id).execute()
    if not proj_res.data:
        raise HTTPException(status_code=404, detail="Project not found.")

    update_payload: dict = {
        "status": body.status,
        "updated_at": _now_utc(),
    }
    if body.status == "active" and not proj_res.data[0].get("started_at"):
        update_payload["started_at"] = _now_utc()

    update_res = supabase.table("projects").update(update_payload).eq(
        "id", project_id
    ).execute()

    if not update_res.data:
        raise HTTPException(status_code=500, detail="Failed to update status.")

    return _enrich_project(update_res.data[0])


@router.patch("/api/admin/projects/{project_id}/complete", response_model=ProjectResponse)
async def admin_complete_project(
    project_id: str,
    current_user: dict = Depends(get_current_user),
):
    """
    Admin: mark project as completed and credit the worker's wallet.

    Flow:
      1. Set project status → 'completed', completed_at = now
      2. Upsert worker_wallets row (create if first project)
      3. Add wallet_transaction of type 'credit' for budget amount
      4. Update wallet balance and total_earned
    """
    _require_role(current_user, "admin")

    proj_res = supabase.table("projects").select("*").eq("id", project_id).execute()
    if not proj_res.data:
        raise HTTPException(status_code=404, detail="Project not found.")

    project = proj_res.data[0]
    if project["status"] == "completed":
        raise HTTPException(status_code=400, detail="Project is already completed.")
    if not project.get("worker_id"):
        raise HTTPException(status_code=400, detail="No worker assigned — cannot complete.")

    budget = Decimal(str(project.get("budget", 0) or 0))
    worker_id = str(project["worker_id"])

    # 1. Mark project completed
    update_res = supabase.table("projects").update({
        "status": "completed",
        "completed_at": _now_utc(),
        "amount_paid": float(budget),
        "updated_at": _now_utc(),
    }).eq("id", project_id).execute()

    if not update_res.data:
        raise HTTPException(status_code=500, detail="Failed to complete project.")

    # 2. Upsert wallet (create if missing)
    wallet_res = supabase.table("worker_wallets").select("*").eq(
        "worker_id", worker_id
    ).execute()

    if wallet_res.data:
        wallet = wallet_res.data[0]
        wallet_id = str(wallet["id"])
        new_balance = Decimal(str(wallet["balance"])) + budget
        new_total = Decimal(str(wallet["total_earned"])) + budget
        supabase.table("worker_wallets").update({
            "balance": float(new_balance),
            "total_earned": float(new_total),
            "updated_at": _now_utc(),
        }).eq("id", wallet_id).execute()
    else:
        # First ever payout → create wallet
        wallet_insert = supabase.table("worker_wallets").insert({
            "worker_id": worker_id,
            "balance": float(budget),
            "total_earned": float(budget),
        }).execute()
        if not wallet_insert.data:
            raise HTTPException(status_code=500, detail="Failed to create worker wallet.")
        wallet_id = str(wallet_insert.data[0]["id"])

    # 3. Append ledger transaction
    if budget > 0:
        supabase.table("wallet_transactions").insert({
            "wallet_id": wallet_id,
            "project_id": project_id,
            "type": "credit",
            "amount": float(budget),
            "description": f"Payment for: {project['title']}",
        }).execute()

    return _enrich_project(update_res.data[0])
