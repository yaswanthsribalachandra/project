# services/ai_pipeline.py

import os
import json
import time
import subprocess
import tempfile
import uuid
from pathlib import Path
from datetime import datetime

import librosa
import numpy as np
import torch
import whisper
from huggingface_hub import InferenceClient
from scipy import signal
from transformers import Wav2Vec2ForSequenceClassification, Wav2Vec2Processor

BASE_DIR = Path(__file__).resolve().parent.parent
os.makedirs(BASE_DIR / "generated_images", exist_ok=True)
os.makedirs(BASE_DIR / "safe", exist_ok=True)

from dotenv import load_dotenv

load_dotenv()
HF_API_KEY = os.getenv("HF_API_KEY") or os.getenv("HF_TOKEN")


# Initialize Hugging Face Inference Client
hf_client = InferenceClient(provider="hf-inference", api_key=HF_API_KEY)

# -------- THEMES --------
THEMES = {
    "animated": "animated style, cartoon",
    "ghibli": "studio ghibli style, watercolor",
    "cyberpunk": "cyberpunk, neon lights",
    "pixel": "pixel art, 8-bit",
}

# -------- LOAD MODELS ONCE --------
emotion_model = Wav2Vec2ForSequenceClassification.from_pretrained(
    "Dpngtm/wav2vec2-emotion-recognition"
)
processor = Wav2Vec2Processor.from_pretrained(
    "Dpngtm/wav2vec2-emotion-recognition"
)
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
emotion_model.to(DEVICE)
emotion_model.eval()

EMOTIONS = list(emotion_model.config.id2label.values())
whisper_model = whisper.load_model("base")


# ---------------- UTILS ----------------

def preprocess(audio, sr):
    audio = np.asarray(audio).flatten().astype(np.float32)
    max_abs = float(np.max(np.abs(audio))) if audio.size else 0.0
    if max_abs > 0:
        audio = audio / max_abs

    if sr != 16000:
        audio = signal.resample(audio, int(len(audio) * 16000 / sr))

    return audio


def convert_audio_to_wav(src_path: str) -> str:
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_wav:
        dst_path = tmp_wav.name

    cmd = [
    "/opt/homebrew/bin/ffmpeg",
    "-y",
    "-i",
    src_path,
    "-ac",
    "1",
    "-ar",
    "16000",
    "-vn",
    dst_path,
    ]

    proc = subprocess.run(
        cmd,
        capture_output=True,
        text=True,
        check=False,
        timeout=120,
    )

    if proc.returncode != 0:
        if os.path.exists(dst_path):
            os.remove(dst_path)
        raise RuntimeError(
            "Audio conversion failed. Ensure ffmpeg is installed and the audio format is supported."
        )

    return dst_path

def resolve_lstm_python():
    env_python = os.getenv("LSTM_PYTHON")
    if env_python:
        return env_python

    candidates = [
        BASE_DIR / "LSTM" / "venv" / "Scripts" / "python.exe",
        BASE_DIR / "LSTM" / "venv" / "bin" / "python",
        BASE_DIR / "LSTM" / "venv2" / "Scripts" / "python.exe",
        BASE_DIR / "LSTM" / "venv2" / "bin" / "python",
    ]
    for candidate in candidates:
        if candidate.exists():
            return str(candidate)

    raise FileNotFoundError("LSTM python interpreter not found.")


def run_lstm_subprocess(wav_path):
    lstm_python = resolve_lstm_python()
    lstm_main = BASE_DIR / "LSTM" / "main.py"

    cmd = [lstm_python, str(lstm_main), "--file", wav_path]

    proc = subprocess.run(
        cmd,
        cwd=str(BASE_DIR / "LSTM"),
        capture_output=True,
        text=True,
        check=False,
        timeout=120,
    )

    if proc.returncode != 0:
        raise RuntimeError(proc.stderr or proc.stdout)

    data = json.loads(proc.stdout)

    if "error" in data:
        raise RuntimeError(data["error"])

    return data["emotion"], data["scores"]


def normalize_emotion_name(name: str) -> str:
    return "".join(ch.lower() for ch in name if ch.isalnum())


def get_safe_image_url_for_emotion(emotion: str):
    safe_dir = BASE_DIR / "safe"
    if not safe_dir.exists():
        return None

    target = normalize_emotion_name(emotion)
    # Deterministic "first" file when multiple extensions share the same stem.
    for path in sorted(safe_dir.iterdir(), key=lambda p: p.name.lower()):
        if not path.is_file():
            continue
        if normalize_emotion_name(path.stem) == target:
            return f"/safe/{path.name}"
    return None


# ---------------- MAIN PIPELINE ----------------

async def analyze_audio(file, theme: str, mode: str, safe_mode: bool = False):
    mode_norm = (mode or "").strip().lower()
    emotion_warning = None

    ext = Path((file.filename or "")).suffix.lower()
    if not ext:
        content_type = (getattr(file, "content_type", "") or "").lower()
        content_type_to_ext = {
            "audio/webm": ".webm",
            "audio/mp4": ".m4a",
            "audio/mpeg": ".mp3",
            "audio/wav": ".wav",
            "audio/x-wav": ".wav",
            "audio/ogg": ".ogg",
        }
        ext = content_type_to_ext.get(content_type, ".wav")

    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
        tmp.write(await file.read())
        input_path = tmp.name

    wav_path = None

    try:
        wav_path = convert_audio_to_wav(input_path)
        audio, sr = librosa.load(wav_path, sr=None, mono=True)

        # -------- EMOTION --------
        if mode_norm == "upload":
            try:
                emotion, scores = run_lstm_subprocess(wav_path)
            except Exception as e:
                # Keep upload mode available even if the legacy LSTM model environment is incompatible.
                emotion_warning = f"LSTM fallback used: {e}"
                audio_16k = preprocess(audio, sr)
                inputs = processor(
                    audio_16k,
                    sampling_rate=16000,
                    return_tensors="pt",
                    padding=True,
                )
                inputs = {k: v.to(DEVICE) for k, v in inputs.items()}

                with torch.inference_mode():
                    logits = emotion_model(**inputs).logits
                    probs = torch.softmax(logits, dim=1)[0].detach().cpu()

                emotion = EMOTIONS[int(torch.argmax(probs))]
                scores = {
                    EMOTIONS[i]: round(float(probs[i]) * 100, 2)
                    for i in range(len(EMOTIONS))
                }
        else:
            audio_16k = preprocess(audio, sr)
            inputs = processor(
                audio_16k,
                sampling_rate=16000,
                return_tensors="pt",
                padding=True,
            )
            inputs = {k: v.to(DEVICE) for k, v in inputs.items()}

            with torch.inference_mode():
                logits = emotion_model(**inputs).logits
                probs = torch.softmax(logits, dim=1)[0].detach().cpu()

            emotion = EMOTIONS[int(torch.argmax(probs))]
            scores = {
                EMOTIONS[i]: round(float(probs[i]) * 100, 2)
                for i in range(len(EMOTIONS))
            }

        # -------- TRANSCRIPTION --------
        text = whisper_model.transcribe(
            wav_path,
            language="en",
            fp16=torch.cuda.is_available(),
        )["text"].strip()
        if not text:
            text = "A peaceful scene"

        # -------- IMAGE --------
        image_url = None
        image_error = None
        if safe_mode:
            image_url = get_safe_image_url_for_emotion(emotion)
            if not image_url:
                image_error = f"No safe image found for emotion: {emotion}"
        else:
            theme_prompt = THEMES.get(theme, THEMES["animated"])
            prompt = f"{text}, {emotion} mood, {theme_prompt}, high quality, masterpiece"
            try:
                if not HF_API_KEY:
                    raise RuntimeError("HF_API_KEY is not configured on the backend.")

                seed = int(time.time_ns() % (2**31 - 1))
                try:
                    image = hf_client.text_to_image(
                        prompt,
                        # model="stabilityai/stable-diffusion-xl-base-1.0",
                        model="black-forest-labs/FLUX.1-schnell",
                        # model="black-forest-labs/FLUX.2-klein",
                        # model="m-a-p/Z-Image-Turbo",
                        seed=seed,
                    )
                except TypeError:
                    image = hf_client.text_to_image(
                        prompt,
                        # model="stabilityai/stable-diffusion-xl-base-1.0",
                        model="black-forest-labs/FLUX.1-schnell",
                        # model="black-forest-labs/FLUX.2-klein",
                        # model="m-a-p/Z-Image-Turbo",
                    )

                filename = (
                    f"result_{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}_"
                    f"{uuid.uuid4().hex[:8]}.png"
                )
                filepath = BASE_DIR / "generated_images" / filename
                image.save(filepath)
                image_url = f"/generated_images/{filename}"
            except Exception as e:
                image_error = str(e)

        return {
            "emotion": emotion,
            "scores": scores,
            "emotion_warning": emotion_warning,
            "transcription": text,
            "image_url": image_url,
            "image_error": image_error,
        }

    finally:
        if os.path.exists(input_path):
            os.remove(input_path)
        if wav_path and os.path.exists(wav_path):
            os.remove(wav_path)
