import uuid
import random
import resend
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError

from db.database import supabase
from core.security import verify_password, get_password_hash, create_access_token, verify_google_token
from core.config import settings
from db.models import (
    UserRegister,
    UserLogin,
    GoogleLogin,
    Token,
    UserResponse,
    OnboardingCompletion,
    SendOTPRequest,
    VerifyOTPRequest,
    AuthTokenResponse,
)
from db.models import RoleUpdate

router = APIRouter(prefix="/api/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

OTP_EXPIRATION_MINUTES = 10


def generate_otp() -> str:
    return f"{random.randint(0, 999999):06d}"

async def send_otp_email(email: str, code: str):
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Verification Code</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
        <tr>
          <td align="center" style="padding: 40px 10px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 480px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); text-align: center;">
              
              <!-- Header Brand Banner & Floating Security Icons -->
              <tr>
                <td style="padding: 36px 32px 16px 32px; text-align: center;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center">
                        <table border="0" cellpadding="0" cellspacing="0">
                          <tr>
                            <!-- Floating Security Shield Icon (Left) -->
                             <td valign="middle" style="padding-right: 12px;">
                               <div style="background-color: #EFF6FF; border: 1px solid #DBEAFE; border-radius: 50%; width: 36px; height: 36px; display: inline-block; text-align: center; line-height: 36px;">
                                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0048B3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;">
                                   <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                   <path d="M12 8v4"/>
                                   <path d="M12 16h.01"/>
                                 </svg>
                               </div>
                             </td>

                            <!-- Jaradeck Logo & Title Block (Center) -->
                            <td valign="middle" style="text-align: center;">
                              <div style="display: inline-block; vertical-align: middle; margin-bottom: 4px;">
                                <svg width="34" height="25" viewBox="0 0 34 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M3.23453 17.8236H34.0002V24.4431H3.23453V21.1334V17.8236Z" fill="#0048B3"/>
                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M34.0002 17.8236H3.23453L0 16.1194H30.674L34.0002 17.8236Z" fill="#487DCD"/>
                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M3.23453 17.8236V21.1334V24.4431L0 22.4737V16.1194L3.23453 17.8236Z" fill="#2F6BC4"/>
                                  <path d="M3.23453 9.87086H34.0002V16.4904H3.23453V9.87086Z" fill="#0048B3"/>
                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M34.0002 9.87086H3.23453L0 8.16666H30.674L34.0002 9.87086Z" fill="#487DCD"/>
                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M3.23453 9.87086V16.4904L0 14.5209V8.16666L3.23453 9.87086Z" fill="#2F6BC4"/>
                                  <path d="M3.23453 1.7042H34.0002V8.3237H3.23453V1.7042Z" fill="#0048B3"/>
                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M34.0002 1.7042H3.23453L0 0H30.674L34.0002 1.7042Z" fill="#487DCD"/>
                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M3.23453 1.7042V8.3237L0 6.35427V0L3.23453 1.7042Z" fill="#2F6BC4"/>
                                </svg>
                              </div>
                              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #0048B3; letter-spacing: -0.5px; line-height: 1;">
                                Jaradeck
                              </h1>
                            </td>

                            <!-- Floating Lock/OTP Key Icon (Right) -->
                             <td valign="middle" style="padding-left: 12px;">
                               <div style="background-color: #EFF6FF; border: 1px solid #DBEAFE; border-radius: 50%; width: 36px; height: 36px; display: inline-block; text-align: center; line-height: 36px;">
                                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0048B3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;">
                                   <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                   <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                 </svg>
                               </div>
                             </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Body Content -->
              <tr>
                <td style="padding: 0 32px 24px 32px; text-align: center;">
                  <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 600; color: #111827;">
                    Your verification code
                  </h2>
                  <p style="margin: 0; font-size: 14px; color: #6B7280; line-height: 1.5;">
                    Use the 6-digit code below to log in to your account. This code is valid for 10 minutes.
                  </p>
                </td>
              </tr>

              <!-- OTP Code Box -->
              <tr>
                <td align="center" style="padding: 0 32px 24px 32px;">
                  <div style="background-color: #F0F5FF; border: 1px dashed #0048B3; border-radius: 8px; padding: 20px; text-align: center;">
                    <span style="font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #0048B3; display: inline-block;">
                      {code}
                    </span>
                  </div>
                </td>
              </tr>

              <!-- Direct Paste / Action Helper -->
              <tr>
                <td align="center" style="padding: 0 32px 32px 32px;">
                  <p style="margin: 0 0 12px 0; font-size: 12px; color: #9CA3AF;">
                    Tap or double-click the code block above to select and copy.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #F9FAFB; padding: 20px 32px; border-top: 1px solid #E5E7EB; text-align: center;">
                  <p style="margin: 0; font-size: 12px; color: #9CA3AF; line-height: 1.4;">
                    If you didn't request this code, you can safely ignore this email.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    """
    try:
        resend.Emails.send({
            "from": "Jaradeck <onboarding@resend.dev>",
            "to": email,
            "subject": f"{code} is your Jaradeck verification code",
            "html": html_content
        })
    except Exception as e:
        print(f"Error sending email via Resend: {str(e)}")


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


# ==========================
# OTP ENDPOINTS (Shared Flow)
# ==========================

@router.post("/send-otp", status_code=status.HTTP_200_OK)
async def send_otp(payload: SendOTPRequest):
    email = payload.email.lower().strip()
    code = generate_otp()
    expires_at = (datetime.now(timezone.utc) + timedelta(minutes=OTP_EXPIRATION_MINUTES)).isoformat()

    try:
        supabase.table("otp_codes").delete().eq("email", email).execute()
    except Exception:
        pass

    try:
        supabase.table("otp_codes").insert({
            "email": email,
            "code": code,
            "expires_at": expires_at,
            "is_used": False
        }).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    # Send email ONCE here
    await send_otp_email(email, code)

    user_res = supabase.table("users").select("id").eq("email", email).execute()
    return {
        "message": "OTP code sent successfully.",
        "is_registered": bool(user_res.data)
    }

@router.post("/resend-otp", status_code=status.HTTP_200_OK)
async def resend_otp(payload: SendOTPRequest):
    """Alias for /send-otp to handle manual re-requests."""
    return await send_otp(payload)


@router.post("/verify-otp", response_model=AuthTokenResponse)
async def verify_otp(payload: VerifyOTPRequest):
    """
    Unified verification endpoint. Validates code, marks email verified,
    and returns session token + user onboarding state.
    """
    email = payload.email.lower().strip()
    code = payload.code.strip()

    # Fetch matching valid code
    res = supabase.table("otp_codes").select("*").eq("email", email).eq("code", code).eq("is_used", False).execute()
    if not res.data:
        raise HTTPException(status_code=400, detail="Invalid verification code.")

    otp_record = res.data[0]
    expires_at = datetime.fromisoformat(otp_record["expires_at"].replace("Z", "+00:00"))

    if datetime.now(timezone.utc) > expires_at:
        raise HTTPException(status_code=400, detail="Verification code has expired. Please request a new one.")

    # Invalidate used code
    supabase.table("otp_codes").update({"is_used": True}).eq("id", otp_record["id"]).execute()

    # Retrieve user
    user_res = supabase.table("users").select("*").eq("email", email).execute()
    if not user_res.data:
        raise HTTPException(status_code=404, detail="User account not found. Please sign up first.")

    user = user_res.data[0]
    
    # Update verification status
    # supabase.table("users").update({"is_verified": True}).eq("id", user["id"]).execute()
    # user["is_verified"] = True

    expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": str(user["id"])}, expires_delta=expires)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user,
    }


# ==========================
# AUTHENTICATION ENDPOINTS
# ==========================

@router.post("/login/send-otp", status_code=status.HTTP_200_OK)
async def login_send_otp(payload: SendOTPRequest):
    email = payload.email.lower().strip()
    user_res = supabase.table("users").select("id").eq("email", email).execute()
    if not user_res.data:
        raise HTTPException(status_code=404, detail="No account found with this email. Please register.")

    # Call send_otp logic directly or reuse handler
    return await send_otp(payload)


@router.post("/register", response_model=Token)
async def register(user: UserRegister):
    response = supabase.table("users").select("id").eq("email", user.email).execute()
    if response.data:
        raise HTTPException(status_code=400, detail="Email already registered")

    password_hash = get_password_hash(user.password) if user.password else None

    new_user_data = {
        "id": str(uuid.uuid4()),
        "email": user.email.lower().strip(),
        "password_hash": password_hash,
        "full_name": user.full_name,
        "role": user.role if user.role in ["customer", "worker"] else "customer",
        "is_onboarded": False,
        "is_verified": False,
        "country": user.country,
        "phone": user.phone,
        "auth_provider": "local"
    }

    try:
        result = supabase.table("users").insert(new_user_data).execute()
        new_user = result.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    # Automatically dispatch registration OTP
    # await send_otp(SendOTPRequest(email=new_user["email"]))

    expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": str(new_user["id"])}, expires_delta=expires)
    
    return {"access_token": access_token, "token_type": "bearer", "user": new_user}


@router.post("/complete-onboarding", response_model=UserResponse)
async def complete_onboarding(
    payload: OnboardingCompletion, 
    current_user: dict = Depends(get_current_user)
):
    update_data = {
        "role": payload.role,
        "is_onboarded": True,
    }
    if payload.country:
        update_data["country"] = payload.country
    if payload.phone:
        update_data["phone"] = payload.phone

    try:
        result = (
            supabase.table("users")
            .update(update_data)
            .eq("id", current_user["id"])
            .execute()
        )
        return result.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update onboarding info: {str(e)}")


@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin):
    """Password-based login fallback."""
    response = supabase.table("users").select("*").eq("email", user_credentials.email.lower().strip()).execute()
    if not response.data:
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    user = response.data[0]
    if user["auth_provider"] != "local":
        raise HTTPException(status_code=401, detail="Please login with Google")
        
    if not verify_password(user_credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(data={"sub": str(user["id"])})
    return {"access_token": access_token, "token_type": "bearer", "user": user}


@router.post("/google", response_model=Token)
async def google_login(google_login: GoogleLogin):
    idinfo = verify_google_token(google_login.credential)
    if not idinfo:
        raise HTTPException(status_code=400, detail="Invalid Google token")
        
    email = idinfo.get("email", "").lower().strip()
    full_name = idinfo.get("name", "Google User")
    
    if not email:
        raise HTTPException(status_code=400, detail="Email not provided by Google")
        
    response = supabase.table("users").select("*").eq("email", email).execute()
    
    if response.data:
        user = response.data[0]
        access_token = create_access_token(data={"sub": str(user["id"])})
        return {"access_token": access_token, "token_type": "bearer", "user": user}
    else:
        if not google_login.role:
            raise HTTPException(
                status_code=428, 
                detail="Role is required for new Google signups"
            )
            
        new_user_data = {
            "email": email,
            "full_name": full_name,
            "role": google_login.role,
            "is_verified": True,
            "is_onboarded": False,
            "auth_provider": "google"
        }
        
        try:
            result = supabase.table("users").insert(new_user_data).execute()
            user = result.data[0]
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
            
        access_token = create_access_token(data={"sub": str(user["id"])})
        return {"access_token": access_token, "token_type": "bearer", "user": user}


@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user


@router.post("/set-role")
async def set_user_role(
    payload: RoleUpdate,
    current_user: dict = Depends(get_current_user)
):
    try:
        res = (
            supabase.table("users")
            .update({"role": payload.role})
            .eq("id", current_user["id"])
            .execute()
        )
        if not res.data:
            raise HTTPException(status_code=404, detail="User record not found")
            
        return {"message": "Role set successfully", "user": res.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    

# Add to auth.py

@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(current_user: dict = Depends(get_current_user)):
    """
    Logs out the current user session.
    Stateless JWT tokens are invalidated on the client side.
    """
    return {"message": "Successfully logged out"}