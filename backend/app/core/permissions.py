from fastapi import Depends, HTTPException, status

from app.core.auth import get_current_user
from app.services.user_service import get_or_create_user


def require_role(*allowed_roles):
    def role_checker(current_user=Depends(get_current_user)):
        user = get_or_create_user(current_user)

        if user["role"] not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this resource",
            )

        return user

    return role_checker