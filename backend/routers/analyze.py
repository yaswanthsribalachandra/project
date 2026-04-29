from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse
import traceback
from services.ai_pipeline import analyze_audio

router = APIRouter(prefix="/api", tags=["Emotion AI"])

@router.post("/analyze")
async def analyze(
    file: UploadFile = File(...),
    theme: str = Form(...),
    mode: str = Form(...),
    safe_mode: str = Form("false"),
):
    try:
        safe_mode = safe_mode.lower() == "true"

        result = await analyze_audio(file, theme, mode, safe_mode)
        return result

    except Exception as e:
        print(traceback.format_exc())
        return JSONResponse({"error": str(e)}, status_code=500)