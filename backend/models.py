from beanie import Document
from pydantic import EmailStr
from typing import Optional
from datetime import datetime

class Admin(Document):
    first_name: str
    last_name: str
    profession: str
    email: EmailStr
    password: str

    otp: Optional[str] = None
    otp_expires: Optional[datetime] = None

    class Settings:
        name = "admin"   # collection name