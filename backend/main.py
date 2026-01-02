from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from datetime import datetime
import os
import shutil

from services.classify import predict_category
from services.priority import assign_priority
from services.geo import is_within_radius

from firebase_admin import credentials, firestore, initialize_app
import firebase_admin

# -------------------- APP --------------------
app = FastAPI()

# -------------------- CORS --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- FIRESTORE INIT (NO STORAGE) --------------------
if not firebase_admin._apps:
    cred = credentials.Certificate("firebase_key.json")
    initialize_app(cred)

db = firestore.client()

# -------------------- LOCAL UPLOADS --------------------
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# -------------------- API --------------------
@app.post("/complaint")
async def register_complaint(
    text: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    photo: UploadFile = File(None)
):
    # 1️⃣ AI category
    category = predict_category(text)

    # 2️⃣ Count similar complaints from Firestore
    similar_count = 0
    docs = db.collection("complaints").stream()
    for doc in docs:
        c = doc.to_dict()
        if c["category"] == category:
            if is_within_radius(
                latitude, longitude,
                c["latitude"], c["longitude"]
            ):
                similar_count += 1

    priority = assign_priority(similar_count + 1)

    # 3️⃣ Save photo locally
    photo_url = None
    if photo:
        filename = f"{datetime.now().timestamp()}_{photo.filename}"
        filepath = os.path.join(UPLOAD_DIR, filename)

        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(photo.file, buffer)

        photo_url = f"/uploads/{filename}"

    # 4️⃣ Store complaint in Firestore
    complaint_data = {
        "text": text,
        "category": category,
        "priority": priority,
        "latitude": latitude,
        "longitude": longitude,
        "photo_url": photo_url,
        "created_at": datetime.utcnow()
    }

    db.collection("complaints").add(complaint_data)

    return complaint_data


@app.get("/complaints")
def get_complaints(priority: str = None):
    docs = db.collection("complaints").stream()
    results = []

    for doc in docs:
        data = doc.to_dict()
        if priority:
            if data["priority"].lower() == priority.lower():
                results.append(data)
        else:
            results.append(data)

    return results
