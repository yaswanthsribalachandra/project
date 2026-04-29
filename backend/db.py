from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from models import Admin   # ✅ import your actual model
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")

client = AsyncIOMotorClient(MONGO_URL)

async def init_db():
    db = client["admins"]   # ✅ database name (matches your usage)
    
    await init_beanie(
        database=db,
        document_models=[Admin]   # ✅ register Admin model
    )