from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import shutil
from datetime import datetime

from services.classify import predict_category
from services.priority import assign_priority
from services.geo import is_within_radius

app = FastAPI()

# -------------------- CORS --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- STORAGE --------------------
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Temporary in-memory DB
complaints_db = []

# -------------------- API --------------------
@app.post("/complaint")
async def register_complaint(
    text: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    photo: UploadFile = File(None)
):
    # AI categorization
    category = predict_category(text)

    # Geo-based similarity
    similar_count = 0
    for c in complaints_db:
        if c["category"] == category:
            if is_within_radius(
                latitude, longitude,
                c["latitude"], c["longitude"]
            ):
                similar_count += 1

    priority = assign_priority(similar_count + 1)

    # Photo handling
    photo_url = None
    if photo:
        filename = f"{datetime.now().timestamp()}_{photo.filename}"
        filepath = os.path.join(UPLOAD_DIR, filename)

        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(photo.file, buffer)

        photo_url = f"/uploads/{filename}"

    complaint = {
        "text": text,
        "category": category,
        "priority": priority,
        "latitude": latitude,
        "longitude": longitude,
        "photo_url": photo_url
    }

    complaints_db.append(complaint)

    return complaint
