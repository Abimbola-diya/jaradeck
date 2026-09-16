"""
routers/wallet.py

Worker wallet endpoints:
  GET  /api/worker/wallet   → fetch current wallet balance + recent 20 transactions
"""

from fastapi import APIRouter, Depends, HTTPException, status

from db.database import supabase
from db.models import WalletResponse, TransactionResponse, strip_sensitive_fields
from routers.auth import get_current_user

router = APIRouter(tags=["wallet"])


def _require_worker(user: dict):
    """Raise 403 if the user is not a worker."""
    if user.get("role") != "worker":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only workers can access wallet endpoints.",
        )


# ──────────────────────────────────────────────────────────────────────────────
# GET /api/worker/wallet
# ──────────────────────────────────────────────────────────────────────────────

@router.get("/api/worker/wallet", response_model=WalletResponse)
def get_worker_wallet(current_user: dict = Depends(get_current_user)):
    """
    Return the authenticated worker's wallet balance and their 20 most recent
    transactions. If the wallet has not been created yet (worker has no
    completed projects), return a zero-balance placeholder so the frontend
    always gets a valid response.
    """
    _require_worker(current_user)
    worker_id = current_user["id"]

    # ── Fetch wallet row ───────────────────────────────────────────────────────
    wallet_res = (
        supabase.table("worker_wallets")
        .select("*")
        .eq("worker_id", worker_id)
        .limit(1)
        .execute()
    )

    if not wallet_res.data:
        # Wallet not yet initialised — return an empty placeholder
        return WalletResponse(
            id="none",
            worker_id=worker_id,
            balance=0,
            total_earned=0,
            recent_transactions=[],
        )

    wallet = wallet_res.data[0]

    # ── Fetch 20 most recent transactions ─────────────────────────────────────
    txn_res = (
        supabase.table("wallet_transactions")
        .select("*")
        .eq("wallet_id", wallet["id"])
        .order("created_at", desc=True)
        .limit(20)
        .execute()
    )

    transactions = [
        TransactionResponse(
            id=t["id"],
            type=t["type"],
            amount=t["amount"],
            description=t.get("description"),
            project_id=t.get("project_id"),
            created_at=t.get("created_at"),
        )
        for t in (txn_res.data or [])
    ]

    return WalletResponse(
        id=wallet["id"],
        worker_id=wallet["worker_id"],
        balance=wallet["balance"],
        total_earned=wallet["total_earned"],
        recent_transactions=transactions,
    )
