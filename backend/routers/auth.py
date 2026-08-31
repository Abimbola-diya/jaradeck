import secrets
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from db.database import supabase
from core.security import verify_password, get_password_hash, create_access_token, verify_google_token
from core.config import settings
from core.email import generate_otp, send_otp_email
from db.models import (
    UserRegister, UserLogin, GoogleLogin, Token,
    UserResponse, OTPVerify, ResendOTP, RegisterResponse,
    strip_sensitive_fields,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


# ──────────────────────────────────────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────────────────────────────────────

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    response = supabase.table("users").select("*").eq("id", user_id).execute()
    if not response.data:
        raise credentials_exception
    return response.data[0]


def _now_utc() -> datetime:
    return datetime.now(timezone.utc)


def _store_otp(user_id: str, email: str, code: str) -> None:
    """Store a new OTP record in the otp_codes table, invalidating previous ones."""
    # Mark all previous unused OTPs for this email as used
    supabase.table("otp_codes").update({"used": True}).eq("email", email).eq("used", False).execute()

    expires_at = (_now_utc() + timedelta(minutes=settings.OTP_EXPIRY_MINUTES)).isoformat()
    supabase.table("otp_codes").insert({
        "user_id": user_id,
        "email": email,
        "code": code,
        "expires_at": expires_at,
        "used": False,
    }).execute()


def _count_recent_otps(email: str) -> int:
    """Count OTPs sent in the last hour for this email (rate limiting)."""
    one_hour_ago = (_now_utc() - timedelta(hours=1)).isoformat()
    result = supabase.table("otp_codes").select("id").eq("email", email).gte("created_at", one_hour_ago).execute()
    return len(result.data)


# ──────────────────────────────────────────────────────────────────────────────
# POST /api/auth/register
# ──────────────────────────────────────────────────────────────────────────────

@router.post("/register", response_model=RegisterResponse, status_code=202)
async def register(user: UserRegister):
    """
    Step 1 of 2: Create an unverified user account and send a 6-digit OTP to
    the provided email address via Brevo. Returns 202 — no JWT is issued yet.
    """
    email_lower = user.email.lower().strip()
    first_name = (user.first_name or "").strip()
    last_name = (user.last_name or "").strip()

    if not first_name and user.full_name:
        parts = user.full_name.strip().split(" ", 1)
        first_name = parts[0]
        last_name = parts[1] if len(parts) > 1 else ""

    computed_full_name = user.full_name or f"{first_name} {last_name}".strip()

    # Check for an existing *verified* user — reject immediately
    existing = supabase.table("users").select("id, is_verified, auth_provider").eq("email", email_lower).execute()
    if existing.data:
        record = existing.data[0]
        if record.get("is_verified"):
            raise HTTPException(status_code=400, detail="An account with this email already exists.")
        if record.get("auth_provider") == "google":
            raise HTTPException(status_code=400, detail="This email is linked to a Google account. Please sign in with Google.")

        # Unverified user already exists — re-send OTP instead of creating duplicate
        user_id = record["id"]
    else:
        # Create a brand-new unverified user (no role yet — set after OTP + role selection)
        hashed_password = get_password_hash(user.password) if user.password else None
        new_user_data = {
            "email": email_lower,
            "password_hash": hashed_password,
            "first_name": first_name,
            "last_name": last_name,
            "full_name": computed_full_name,
            "country": user.country,
            "phone": user.phone,
            "auth_provider": "local",
            "is_verified": False,
            "failed_otp_attempts": 0,
        }
        try:
            result = supabase.table("users").insert(new_user_data).execute()
            user_id = result.data[0]["id"]
        except Exception as e:
            err_str = str(e)
            print(f"[AUTH ERROR] Registration failed for {email_lower}: {err_str}")
            if "duplicate key" in err_str.lower() or "already exists" in err_str.lower() or "23505" in err_str:
                raise HTTPException(status_code=400, detail="An account with this email already exists.")
            raise HTTPException(
                status_code=500,
                detail="Unable to complete registration right now. Please try again in a moment."
            )

    # Rate-limit check: max 3 OTP sends per email per hour
    recent_count = _count_recent_otps(email_lower)
    if recent_count >= settings.OTP_MAX_RESENDS_PER_HOUR:
        raise HTTPException(
            status_code=429,
            detail="Too many verification attempts. Please wait an hour before trying again."
        )

    # Generate and store the OTP
    otp_code = generate_otp(6)
    _store_otp(user_id, email_lower, otp_code)

    # Send via Brevo
    sent = await send_otp_email(to_email=email_lower, to_name=first_name or computed_full_name, otp_code=otp_code)
    if not sent:
        # We do NOT fail the request — the user can use resend. Log the failure.
        print(f"[AUTH] Failed to send OTP email to {email_lower}")

    return {"message": "Verification code sent to your email address.", "email": email_lower}


# ──────────────────────────────────────────────────────────────────────────────
# POST /api/auth/verify-otp
# ──────────────────────────────────────────────────────────────────────────────

@router.post("/verify-otp", response_model=Token)
async def verify_otp(payload: OTPVerify):
    """
    Step 2 of 2: Validate the OTP the user entered. On success, mark the user
    as verified and return a JWT access token + user object.
    """
    email_lower = payload.email.lower().strip()

    # Load the user
    user_result = supabase.table("users").select("*").eq("email", email_lower).execute()
    if not user_result.data:
        raise HTTPException(status_code=404, detail="No account found for this email.")
    user = user_result.data[0]

    # Brute-force lockout check
    if user.get("otp_locked_until"):
        locked_until_str = user["otp_locked_until"]
        # Parse the timestamp, support both with and without timezone info
        try:
            locked_until = datetime.fromisoformat(locked_until_str.replace("Z", "+00:00"))
        except Exception:
            locked_until = None

        if locked_until and _now_utc() < locked_until:
            raise HTTPException(
                status_code=429,
                detail="Too many incorrect attempts. Please wait 15 minutes and try again."
            )

    # Fetch the latest valid, unused OTP for this email
    otp_result = (
        supabase.table("otp_codes")
        .select("*")
        .eq("email", email_lower)
        .eq("used", False)
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )

    if not otp_result.data:
        raise HTTPException(status_code=400, detail="No active verification code found. Please request a new one.")

    otp_record = otp_result.data[0]

    # Check expiry
    try:
        expires_at = datetime.fromisoformat(otp_record["expires_at"].replace("Z", "+00:00"))
    except Exception:
        expires_at = _now_utc() - timedelta(seconds=1)  # treat as expired

    if _now_utc() > expires_at:
        raise HTTPException(status_code=400, detail="Your verification code has expired. Please request a new one.")

    # Constant-time comparison to prevent timing attacks
    codes_match = secrets.compare_digest(otp_record["code"].strip(), payload.code.strip())

    if not codes_match:
        # Increment failed attempts
        new_attempts = (user.get("failed_otp_attempts") or 0) + 1
        update_payload = {"failed_otp_attempts": new_attempts}

        if new_attempts >= settings.OTP_MAX_ATTEMPTS:
            # Lock the account for 15 minutes
            locked_until = (_now_utc() + timedelta(minutes=15)).isoformat()
            update_payload["otp_locked_until"] = locked_until

        supabase.table("users").update(update_payload).eq("id", user["id"]).execute()

        remaining = max(0, settings.OTP_MAX_ATTEMPTS - new_attempts)
        if remaining == 0:
            raise HTTPException(
                status_code=429,
                detail="Too many incorrect attempts. Your account is locked for 15 minutes."
            )
        raise HTTPException(
            status_code=400,
            detail=f"Incorrect code. {remaining} attempt{'s' if remaining != 1 else ''} remaining."
        )

    # ── Success: mark OTP used, mark user verified, reset counters ─────────
    supabase.table("otp_codes").update({"used": True}).eq("id", otp_record["id"]).execute()
    supabase.table("users").update({
        "is_verified": True,
        "failed_otp_attempts": 0,
        "otp_locked_until": None,
    }).eq("id", user["id"]).execute()

    # Fetch the freshly updated user to return accurate data
    fresh = supabase.table("users").select("*").eq("id", user["id"]).execute()
    verified_user = fresh.data[0]

    access_token = create_access_token(data={"sub": str(verified_user["id"])})
    return {"access_token": access_token, "token_type": "bearer", "user": strip_sensitive_fields(verified_user)}


# ──────────────────────────────────────────────────────────────────────────────
# POST /api/auth/resend-otp
# ──────────────────────────────────────────────────────────────────────────────

@router.post("/resend-otp", status_code=202)
async def resend_otp(payload: ResendOTP):
    """
    Resend an OTP to an email address. Rate-limited to 3 sends per hour.
    """
    email_lower = payload.email.lower().strip()

    user_result = supabase.table("users").select("id, full_name, is_verified").eq("email", email_lower).execute()
    if not user_result.data:
        raise HTTPException(status_code=404, detail="No account found for this email.")

    user = user_result.data[0]
    if user.get("is_verified"):
        raise HTTPException(status_code=400, detail="This account is already verified.")

    # Rate limit
    recent_count = _count_recent_otps(email_lower)
    if recent_count >= settings.OTP_MAX_RESENDS_PER_HOUR:
        raise HTTPException(
            status_code=429,
            detail="Too many resend requests. Please wait an hour before trying again."
        )

    otp_code = generate_otp(6)
    _store_otp(user["id"], email_lower, otp_code)

    sent = await send_otp_email(
        to_email=email_lower,
        to_name=user.get("full_name", ""),
        otp_code=otp_code
    )
    if not sent:
        raise HTTPException(status_code=503, detail="Failed to send email. Please try again in a moment.")

    return {"message": "A new verification code has been sent to your email."}


# ──────────────────────────────────────────────────────────────────────────────
# POST /api/auth/login
# ──────────────────────────────────────────────────────────────────────────────

@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin):
    response = supabase.table("users").select("*").eq("email", user_credentials.email.lower()).execute()
    if not response.data:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user = response.data[0]
    if user["auth_provider"] != "local":
        raise HTTPException(status_code=401, detail="Please login with Google")

    if not verify_password(user_credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not user.get("is_verified"):
        raise HTTPException(
            status_code=403,
            detail="Email not verified. Please check your inbox for a verification code."
        )

    access_token = create_access_token(data={"sub": str(user["id"])})
    return {"access_token": access_token, "token_type": "bearer", "user": strip_sensitive_fields(user)}


# ──────────────────────────────────────────────────────────────────────────────
# POST /api/auth/google
# ──────────────────────────────────────────────────────────────────────────────

@router.post("/google", response_model=Token)
async def google_login(google_login: GoogleLogin):
    # SECURITY: Require a verifiable token — never trust client-supplied email alone
    if not google_login.credential and not google_login.access_token:
        raise HTTPException(status_code=400, detail="A Google credential or access token is required.")

    email = None
    first_name = google_login.first_name or ""
    last_name = google_login.last_name or ""
    full_name = google_login.full_name or "Google User"
    picture = google_login.picture or google_login.avatar_url

    if google_login.credential:
        idinfo = verify_google_token(google_login.credential)
        if not idinfo:
            raise HTTPException(status_code=400, detail="Invalid Google token")
        email = idinfo.get("email")
        first_name = idinfo.get("given_name", first_name)
        last_name = idinfo.get("family_name", last_name)
        full_name = idinfo.get("name", full_name)
        picture = idinfo.get("picture", picture)
    elif google_login.access_token:
        import httpx
        async with httpx.AsyncClient() as client:
            resp = await client.get("https://www.googleapis.com/oauth2/v3/userinfo", headers={
                "Authorization": f"Bearer {google_login.access_token}"
            })
            if resp.status_code != 200:
                raise HTTPException(status_code=400, detail="Invalid Google access token")
            userinfo = resp.json()
            email = userinfo.get("email")
            first_name = userinfo.get("given_name", first_name)
            last_name = userinfo.get("family_name", last_name)
            full_name = userinfo.get("name", full_name)
            picture = userinfo.get("picture", picture)

    if not email:
        raise HTTPException(status_code=400, detail="Email not provided by Google")

    email = email.lower()
    if not first_name and full_name:
        parts = full_name.strip().split(" ", 1)
        first_name = parts[0]
        last_name = parts[1] if len(parts) > 1 else ""

    computed_full_name = full_name or f"{first_name} {last_name}".strip()

    response = supabase.table("users").select("*").eq("email", email).execute()

    if response.data:
        user = response.data[0]
        updates = {}
        if not user.get("is_verified"):
            updates["is_verified"] = True
            user["is_verified"] = True
        if first_name and not user.get("first_name"):
            updates["first_name"] = first_name
            user["first_name"] = first_name
        if last_name and not user.get("last_name"):
            updates["last_name"] = last_name
            user["last_name"] = last_name
        if picture and user.get("avatar_url") != picture:
            updates["avatar_url"] = picture
            user["avatar_url"] = picture
        if updates:
            try:
                supabase.table("users").update(updates).eq("id", user["id"]).execute()
            except Exception as e:
                print(f"[AUTH WARNING] Could not update user Google profile fields: {e}")
        user["picture"] = picture or user.get("avatar_url")
        user["avatar_url"] = picture or user.get("avatar_url")
        access_token = create_access_token(data={"sub": str(user["id"])})
        return {"access_token": access_token, "token_type": "bearer", "user": strip_sensitive_fields(user)}
    else:
        role = google_login.role or "customer"
        new_user_data = {
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "full_name": computed_full_name,
            "role": role,
            "auth_provider": "google",
            "is_verified": True,  # Google auth = email already verified
            "avatar_url": picture,
        }
        try:
            result = supabase.table("users").insert(new_user_data).execute()
            user = result.data[0]
        except Exception as e:
            err_str = str(e)
            print(f"[AUTH ERROR] Google login user creation failed for {email}: {err_str}")
            if "duplicate key" in err_str.lower() or "already exists" in err_str.lower() or "23505" in err_str:
                response_existing = supabase.table("users").select("*").eq("email", email).execute()
                if response_existing.data:
                    user = response_existing.data[0]
                else:
                    raise HTTPException(status_code=400, detail="An account with this email already exists.")
            else:
                new_user_data.pop("avatar_url", None)
                try:
                    result = supabase.table("users").insert(new_user_data).execute()
                    user = result.data[0]
                except Exception as ex:
                    raise HTTPException(
                        status_code=500,
                        detail="Unable to complete Google Sign-In right now. Please try again."
                    )

        user["picture"] = picture or user.get("avatar_url")
        user["avatar_url"] = picture or user.get("avatar_url")
        access_token = create_access_token(data={"sub": str(user["id"])})
        return {"access_token": access_token, "token_type": "bearer", "user": strip_sensitive_fields(user)}


# ──────────────────────────────────────────────────────────────────────────────
# GET /api/auth/me
# ──────────────────────────────────────────────────────────────────────────────

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user


# ──────────────────────────────────────────────────────────────────────────────
# POST /api/auth/set-role
# ──────────────────────────────────────────────────────────────────────────────

from pydantic import BaseModel as PydanticBaseModel

class SetRolePayload(PydanticBaseModel):
    role: str

@router.post("/set-role")
async def set_role(payload: SetRolePayload, current_user: dict = Depends(get_current_user)):
    """Update the authenticated user's role (customer | worker)."""
    if payload.role not in ("customer", "worker"):
        raise HTTPException(status_code=400, detail="Role must be 'customer' or 'worker'.")

    supabase.table("users").update({"role": payload.role}).eq("id", current_user["id"]).execute()
    return {"message": "Role updated successfully.", "role": payload.role}
