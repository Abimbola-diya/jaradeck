from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.auth import get_current_user
from app.core.permissions import require_role
from app.models import ApplicationCreate
from app.services.user_service import get_or_create_user
from app.services import (
    create_application,
    get_application,
    get_customer_applications,
)

router = APIRouter(
    prefix="/api/applications",
    tags=["Applications"],
)


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_new_application(
    data: ApplicationCreate,
    current_user=Depends(require_role("customer")),
):
    customer_id = UUID(str(current_user["id"]))

    return create_application(
        customer_id=customer_id,
        data=data.model_dump(mode="json"),
    )


@router.get("/")
def list_my_applications(
    current_user=Depends(require_role("customer")),
):
    customer_id = UUID(str(current_user["id"]))

    return get_customer_applications(customer_id)


@router.get("/{application_id}")
def get_single_application(
    application_id: UUID,
    current_user=Depends(get_current_user),
):
    application = get_application(application_id)

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )

    # Customer can only view their own application.
    user = get_or_create_user(current_user)

    if (
        user["role"] == "customer"
        and application["customer_id"] != user["id"]
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this application",
        )

    return application