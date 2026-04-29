from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import numpy as np
import librosa
import tensorflow as tf
import os
import tempfile
import argparse
import json
import sys
from pathlib import Path

app = FastAPI()

SAMPLE_RATE = 22050
MAX_PAD_LEN = 173

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "emotion_lstm_model.h5"
LABELS_PATH = BASE_DIR / "models" / "emotion_labels.npy"

class CompatibleLSTM(tf.keras.layers.LSTM):
    @classmethod
    def from_config(cls, config):
        # Older model exports may include args removed in newer Keras.
        config.pop("time_major", None)
        return super().from_config(config)


model = tf.keras.models.load_model(
    MODEL_PATH,
    custom_objects={"LSTM": CompatibleLSTM},
)
labels = np.load(LABELS_PATH, allow_pickle=True)

def extract_mfcc(file_path):
    audio, sr = librosa.load(file_path, sr=SAMPLE_RATE)

    mfcc = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=40)
    delta = librosa.feature.delta(mfcc)
    delta2 = librosa.feature.delta(mfcc, order=2)

    mfcc = np.vstack([mfcc, delta, delta2])
    mfcc = (mfcc - np.mean(mfcc)) / np.std(mfcc)

    if mfcc.shape[1] < MAX_PAD_LEN:
        mfcc = np.pad(mfcc, ((0, 0), (0, MAX_PAD_LEN - mfcc.shape[1])))
    else:
        mfcc = mfcc[:, :MAX_PAD_LEN]

    return mfcc.T

def predict_from_file(file_path):
    mfcc = extract_mfcc(file_path)
    mfcc = np.expand_dims(mfcc, axis=0)

    probs = model.predict(mfcc, verbose=0)[0]

    scores = {
        str(labels[i]): round(float(probs[i]) * 100, 2)
        for i in range(len(labels))
    }

    emotion = str(labels[int(np.argmax(probs))])
    return {"emotion": emotion, "scores": scores}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        tmp.write(await file.read())
        wav_path = tmp.name

    try:
        return predict_from_file(wav_path)

    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

    finally:
        os.remove(wav_path)


def _run_cli():
    parser = argparse.ArgumentParser(description="Run LSTM emotion prediction on a WAV file.")
    parser.add_argument("--file", required=True, help="Path to WAV file.")
    args = parser.parse_args()

    try:
        result = predict_from_file(args.file)
        print(json.dumps(result))
        return 0
    except Exception as exc:
        print(json.dumps({"error": str(exc)}))
        return 1


if __name__ == "__main__":
    sys.exit(_run_cli())


