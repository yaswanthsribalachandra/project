from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
from pydantic import BaseModel, EmailStr, Field, root_validator
from models import Admin,AdminLogin,ForgotPassword,VerifyOTP, ResetPassword
import random, smtplib
from email.message import EmailMessage
import os
from dotenv import load_dotenv
from passlib.context import CryptContext

load_dotenv()

router = APIRouter(prefix="/auth", tags=["Admin Auth"])

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
EXPIRE_MIN = 60
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")

security = HTTPBearer()



#----------------- Functions ----------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    '''Hash a password for storing.'''
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    '''Verify a stored password against one provided by user.'''
    return pwd_context.verify(plain_password, hashed_password)


# ---------------- SCHEMAS ----------------

class AdminRegister(BaseModel):
    first_name: str
    last_name: str
    profession: str
    email: EmailStr
    password: str
    confirm_password: str

    @root_validator
    def match(cls, values):
        if values.get("password") != values.get("confirm_password"):
            raise ValueError("Passwords do not match")
        return values


# ---------------- AUTH ----------------

def create_token(data: dict):
    data["exp"] = datetime.utcnow() + timedelta(minutes=EXPIRE_MIN)
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_admin(
    cred: HTTPAuthorizationCredentials = Depends(security),
):
    try:
        payload = jwt.decode(cred.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        admin = await Admin.find_one(Admin.id == payload.get("admin_id"))

        if not admin:
            raise HTTPException(status_code=401)

        return admin

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ---------------- EMAIL ----------------

def send_email(to_email: str, subject: str, body: str):
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = f"{EMAIL_USER}"
    msg["To"] = to_email
    msg.set_content(body)

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(EMAIL_USER, EMAIL_PASS)
            server.send_message(msg)
    except Exception:
        raise HTTPException(status_code=500, detail="Email delivery failed")


# ---------------- ROUTES ----------------

@router.post("/admin/register")
async def register(data: AdminRegister):

    existing = await Admin.find_one(Admin.email == data.email)
    if existing:
        raise HTTPException(status_code=400, detail="Admin exists")

    admin = Admin(
        first_name=data.first_name,
        last_name=data.last_name,
        profession=data.profession,
        email=data.email,
        password=hash_password(data.password)
    )

    await admin.insert()

    return {"message": "Admin registered"}


@router.post("/admin/login")
async def login(data: AdminLogin):

    admin = await Admin.find_one(Admin.email == data.email)

    if not admin or not verify_password(data.password, admin.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token({"admin_id": str(admin.id), "role": "admin"})

    return {"token": token}


@router.get("/admin/protected")
async def protected(admin: Admin = Depends(get_current_admin)):
    return {"message": f"Hello {admin.first_name}"}


@router.post("/admin/forgot-password")
async def admin_forgot_password(data: ForgotPassword):

    admin = await Admin.find_one(Admin.email == data.email)

    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")

    otp = str(random.randint(100000, 999999))

    admin.otp = otp
    admin.otp_expires = datetime.now(timezone.utc) + timedelta(minutes=10)


    await admin.save()

    send_email(
        data.email,
        "Admin Password Reset OTP",
        f"Your OTP is {otp}. It expires in 10 minutes."
    )

    return {"message": "OTP sent"}


@router.post("/admin/verify-otp")
async def admin_verify_otp(data: VerifyOTP):

    admin = await Admin.find_one(
        Admin.email == data.email,
        Admin.otp == data.otp
    )

    if not admin:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    if admin.otp_expires < datetime.utcnow():
        raise HTTPException(status_code=400, detail="OTP expired")

    admin.otp = None
    admin.otp_expires = None

    await admin.save()

    return {"message": "OTP verified"}


@router.post("/admin/reset-password")
async def admin_reset_password(data: ResetPassword):

    admin = await Admin.find_one(Admin.email == data.email)

    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")

    # ❌ Prevent same password reuse
    if verify_password(data.new_password, admin.password):
        raise HTTPException(
            status_code=400,
            detail="New password must be different from old password"
        )

    # ✅ Hash and overwrite password
    admin.password = hash_password(data.new_password)

    # clear OTP (optional if not needed here)
    admin.otp = None
    admin.otp_expiry = None

    await admin.save()

    return {"message": "Password updated successfully"}


@router.get("/admin/details")
async def get_admin_details(email: EmailStr):

    admin = await Admin.find_one(Admin.email == email)

    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")

    return admin

