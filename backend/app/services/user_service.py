from app.core.database import supabase


def get_or_create_user(auth_user):
    """
    Get the application user from public.users.
    Create one if it doesn't exist yet.
    """

    user_id = str(auth_user.id)

    response = (
        supabase
        .table("users")
        .select("*")
        .eq("id", user_id)
        .maybe_single()
        .execute()
    )

    if response.data:
        return response.data

    user_data = {
        "id": user_id,
        "email": auth_user.email,
        "full_name": auth_user.user_metadata.get("full_name"),
        "avatar_url": auth_user.user_metadata.get("avatar_url"),
    }

    response = (
        supabase
        .table("users")
        .insert(user_data)
        .execute()
    )

    return response.data[0]