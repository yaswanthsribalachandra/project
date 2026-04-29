from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from routers.analyze import router
from pathlib import Path
from routers.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
from db import init_db   

app = FastAPI()

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Initialize MongoDB (Beanie)
@app.on_event("startup")
async def start_db():
    await init_db()

BASE_DIR = Path(__file__).resolve().parent

# ✅ Routers
app.include_router(router)
app.include_router(auth_router)

# ✅ Static files
app.mount(
    "/generated_images",
    StaticFiles(directory=str(BASE_DIR / "generated_images")),
    name="generated_images",
)
