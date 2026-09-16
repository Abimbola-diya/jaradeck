"""
seed_data.py
Populate Supabase backend with realistic sample data for testing:
  - 2 Worker users:
      1. worker@jaradeck.com / Password123!
      2. abimbolaogundiya2@gmail.com / Password123!
  - 2 Customer users (jake@acme.com, sarah@techcorp.io)
  - 2 Active projects assigned to each worker
  - 3 Completed projects assigned to each worker
  - Worker wallets with earnings & balance
  - Project reviews & ratings
"""

import sys
from datetime import datetime, timedelta, timezone

from core.security import get_password_hash, create_access_token
from db.database import supabase


def now_iso(offset_days: int = 0) -> str:
    dt = datetime.now(timezone.utc) + timedelta(days=offset_days)
    return dt.isoformat()


def seed_worker(worker_email: str, first_name: str, last_name: str, avatar_url: str, c1_id: str, c2_id: str, password_hash: str):
    print(f"\n🌱 Seeding worker: {worker_email}...")

    # Upsert worker user
    worker_res = supabase.table("users").select("*").eq("email", worker_email).execute()
    if worker_res.data:
        worker_id = worker_res.data[0]["id"]
        # Ensure role = worker, is_verified = True, password_hash set if missing
        supabase.table("users").update({
            "role": "worker",
            "is_verified": True,
            "password_hash": password_hash if not worker_res.data[0].get("password_hash") else worker_res.data[0]["password_hash"],
            "first_name": worker_res.data[0].get("first_name") or first_name,
            "last_name": worker_res.data[0].get("last_name") or last_name,
            "full_name": worker_res.data[0].get("full_name") or f"{first_name} {last_name}".strip(),
            "avatar_url": worker_res.data[0].get("avatar_url") or avatar_url,
        }).eq("id", worker_id).execute()
        print(f"  Updated existing worker user: {worker_id}")
    else:
        ins = supabase.table("users").insert({
            "email": worker_email,
            "password_hash": password_hash,
            "first_name": first_name,
            "last_name": last_name,
            "full_name": f"{first_name} {last_name}".strip(),
            "role": "worker",
            "country": "Nigeria",
            "auth_provider": "local",
            "is_verified": True,
            "avatar_url": avatar_url,
        }).execute()
        worker_id = ins.data[0]["id"]
        print(f"  Created worker user: {worker_id}")

    # Clear existing projects for this worker to ensure clean seed state
    supabase.table("projects").delete().eq("worker_id", worker_id).execute()

    # Create Projects
    projects_data = [
        # Active Projects
        {
            "title": "Social Media Management",
            "description": "Full stack social media campaign strategy, content design, and weekly scheduling for Q4 product launch.",
            "category": "Digital Marketing",
            "status": "active",
            "customer_id": c1_id,
            "worker_id": worker_id,
            "budget": 1500.00,
            "amount_paid": 750.00,
            "started_at": now_iso(-5),
            "deadline_at": now_iso(10),
        },
        {
            "title": "UI/UX Redesign for Mobile App",
            "description": "Complete visual refresh and design system for iOS and Android user onboarding flows.",
            "category": "Design & Creative",
            "status": "active",
            "customer_id": c2_id,
            "worker_id": worker_id,
            "budget": 2400.00,
            "amount_paid": 1200.00,
            "started_at": now_iso(-3),
            "deadline_at": now_iso(14),
        },
        # Completed Projects
        {
            "title": "Social Media Manager",
            "description": "Monthly content calendar execution and community engagement management for summer campaign.",
            "category": "Digital Marketing",
            "status": "completed",
            "customer_id": c1_id,
            "worker_id": worker_id,
            "budget": 1200.00,
            "amount_paid": 1200.00,
            "started_at": now_iso(-35),
            "deadline_at": now_iso(-5),
            "completed_at": now_iso(-5),
        },
        {
            "title": "Social Media Manager",
            "description": "Brand awareness and strategy refresh across Twitter, Instagram, and LinkedIn.",
            "category": "Digital Marketing",
            "status": "completed",
            "customer_id": c1_id,
            "worker_id": worker_id,
            "budget": 1100.00,
            "amount_paid": 1100.00,
            "started_at": now_iso(-60),
            "deadline_at": now_iso(-20),
            "completed_at": now_iso(-20),
        },
        {
            "title": "Brand Identity & Logo Package",
            "description": "Complete brand style guide, color palette, typography hierarchy, and vector logo assets.",
            "category": "Design & Creative",
            "status": "completed",
            "customer_id": c2_id,
            "worker_id": worker_id,
            "budget": 1800.00,
            "amount_paid": 1800.00,
            "started_at": now_iso(-90),
            "deadline_at": now_iso(-45),
            "completed_at": now_iso(-45),
        },
    ]

    created_projects = []
    for p_data in projects_data:
        res = supabase.table("projects").insert(p_data).execute()
        created_projects.append(res.data[0])

    print(f"  Created {len(created_projects)} projects for worker {worker_email}.")

    # Upsert Worker Wallet
    completed_projects = [p for p in created_projects if p["status"] == "completed"]
    total_earned = sum(float(p["budget"]) for p in completed_projects)

    wallet_res = supabase.table("worker_wallets").select("*").eq("worker_id", worker_id).execute()
    if wallet_res.data:
        wallet_id = wallet_res.data[0]["id"]
        supabase.table("worker_wallets").update({
            "balance": total_earned,
            "total_earned": total_earned,
            "updated_at": now_iso(),
        }).eq("id", wallet_id).execute()
    else:
        w_ins = supabase.table("worker_wallets").insert({
            "worker_id": worker_id,
            "balance": total_earned,
            "total_earned": total_earned,
        }).execute()
        wallet_id = w_ins.data[0]["id"]

    print(f"  Worker Wallet updated (ID: {wallet_id}, Balance: ${total_earned:.2f})")

    # Clear existing transactions for this wallet
    supabase.table("wallet_transactions").delete().eq("wallet_id", wallet_id).execute()

    # Insert Wallet Transactions
    for p in completed_projects:
        supabase.table("wallet_transactions").insert({
            "wallet_id": wallet_id,
            "project_id": p["id"],
            "type": "credit",
            "amount": float(p["budget"]),
            "description": f"Payment payout for: {p['title']}",
            "created_at": p["completed_at"],
        }).execute()

    print("  Wallet transactions added.")

    # Insert Reviews
    supabase.table("project_reviews").delete().eq("worker_id", worker_id).execute()
    for p in completed_projects:
        supabase.table("project_reviews").insert({
            "project_id": p["id"],
            "reviewer_id": p["customer_id"],
            "worker_id": worker_id,
            "rating": 5,
            "comment": "Outstanding delivery! Excellent communication and top quality work.",
            "created_at": p["completed_at"],
        }).execute()

    print("  Project reviews added.")

    token = create_access_token(data={"sub": str(worker_id)})
    print(f"  Worker JWT Token: {token}")
    return worker_id


def seed():
    print("🌱 Starting Jaradeck database seeding...")

    password_hash = get_password_hash("Password123!")

    # 1. Upsert Customer Users
    c1_email = "jake@acme.com"
    c1_res = supabase.table("users").select("*").eq("email", c1_email).execute()
    if c1_res.data:
        c1_id = c1_res.data[0]["id"]
    else:
        ins = supabase.table("users").insert({
            "email": c1_email,
            "password_hash": password_hash,
            "first_name": "Jake",
            "last_name": "Taiwo",
            "full_name": "Jake Taiwo",
            "role": "customer",
            "country": "United States",
            "auth_provider": "local",
            "is_verified": True,
            "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        }).execute()
        c1_id = ins.data[0]["id"]
    print(f"  Customer 1 (Jake): {c1_id}")

    c2_email = "sarah@techcorp.io"
    c2_res = supabase.table("users").select("*").eq("email", c2_email).execute()
    if c2_res.data:
        c2_id = c2_res.data[0]["id"]
    else:
        ins = supabase.table("users").insert({
            "email": c2_email,
            "password_hash": password_hash,
            "first_name": "Sarah",
            "last_name": "Chen",
            "full_name": "Sarah Chen",
            "role": "customer",
            "country": "Canada",
            "auth_provider": "local",
            "is_verified": True,
            "avatar_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        }).execute()
        c2_id = ins.data[0]["id"]
    print(f"  Customer 2 (Sarah): {c2_id}")

    # Seed for worker@jaradeck.com
    seed_worker("worker@jaradeck.com", "Emmanuel", "Taiwo", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", c1_id, c2_id, password_hash)

    # Seed for abimbolaogundiya2@gmail.com
    seed_worker("abimbolaogundiya2@gmail.com", "Abimbola", "Ogundiya", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", c1_id, c2_id, password_hash)

    print("\n✅ ALL WORKERS SEEDED SUCCESSFULLY!")


if __name__ == "__main__":
    seed()
