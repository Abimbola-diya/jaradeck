from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from db.database import supabase
from core.security import verify_password, get_password_hash, create_access_token, verify_google_token
from core.config import settings
from db.models import UserRegister, UserLogin, GoogleLogin, Token, UserResponse
from datetime import timedelta

router = APIRouter(prefix="/api/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

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

@router.post("/register", response_model=Token)
async def register(user: UserRegister):
    # Check if user already exists
    response = supabase.table("users").select("id").eq("email", user.email).execute()
    if response.data:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(user.password)
    
    new_user_data = {
        "email": user.email,
        "password_hash": hashed_password,
        "full_name": user.full_name,
        "role": user.role,
        "country": user.country,
        "phone": user.phone,
        "auth_provider": "local"
    }
    
    try:
        result = supabase.table("users").insert(new_user_data).execute()
        new_user = result.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    access_token = create_access_token(data={"sub": str(new_user["id"])})
    return {"access_token": access_token, "token_type": "bearer", "user": new_user}

@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin):
    response = supabase.table("users").select("*").eq("email", user_credentials.email).execute()
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
    email = google_login.email
    full_name = google_login.full_name or "Google User"

    if google_login.credential:
        idinfo = verify_google_token(google_login.credential)
        if not idinfo:
            raise HTTPException(status_code=400, detail="Invalid Google token")
        email = idinfo.get("email")
        full_name = idinfo.get("name", full_name)
    elif google_login.access_token:
        # Fetch profile from Google userinfo API
        import requests
        resp = requests.get("https://www.googleapis.com/oauth2/v3/userinfo", headers={
            "Authorization": f"Bearer {google_login.access_token}"
        })
        if resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Invalid Google access token")
        userinfo = resp.json()
        email = userinfo.get("email")
        full_name = userinfo.get("name", full_name)
        
    if not email:
        raise HTTPException(status_code=400, detail="Email not provided by Google")
        
    response = supabase.table("users").select("*").eq("email", email).execute()
    
    if response.data:
        # User exists, login
        user = response.data[0]
        access_token = create_access_token(data={"sub": str(user["id"])})
        return {"access_token": access_token, "token_type": "bearer", "user": user}
    else:
        # User does not exist, create
        role = google_login.role or "customer"
            
        new_user_data = {
            "email": email,
            "full_name": full_name,
            "role": role,
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
