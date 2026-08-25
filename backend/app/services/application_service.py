from uuid import UUID

from app.core.database import supabase


def create_application(customer_id: UUID, data: dict):
    application_data = {
        "customer_id": str(customer_id),
        **data,
    }

    response = (
        supabase
        .table("applications")
        .insert(application_data)
        .execute()
    )

    return response.data[0]


def get_customer_applications(customer_id: UUID):
    response = (
        supabase
        .table("applications")
        .select("*")
        .eq("customer_id", str(customer_id))
        .order("created_at", desc=True)
        .execute()
    )

    return response.data


def get_application(application_id: UUID):
    response = (
        supabase
        .table("applications")
        .select("*")
        .eq("id", str(application_id))
        .maybe_single()
        .execute()
    )

    return response.data