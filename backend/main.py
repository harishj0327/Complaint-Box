from fastapi import FastAPI, File, UploadFile, Form, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from services.classify import predict_category
from services.priority import assign_priority
from services.geo import is_within_radius

from firebase_admin import credentials, firestore, initialize_app, auth as firebase_auth
import firebase_admin

import cloudinary
import cloudinary.uploader

app = FastAPI()

# -------------------- CORS --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- FIREBASE --------------------
if not firebase_admin._apps:
    cred = credentials.Certificate("firebase_key.json")
    initialize_app(cred)

db = firestore.client()

# -------------------- CLOUDINARY (HARDCODED) --------------------
cloudinary.config(
    cloud_name="dc2hsf2en",
    api_key="586174424997459",
    api_secret="hNaGl9e0Abi-7nzTzpn5OlM8w6k",
    secure=True
)

# -------------------- TOKEN VERIFY --------------------
def verify_token(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing token")

    try:
        token = authorization.split(" ")[1]
        return firebase_auth.verify_id_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

# -------------------- POST COMPLAINT --------------------
@app.post("/complaint")
async def register_complaint(
    text: str = Form(...),
    location: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    photo: UploadFile = File(None),
    user=Depends(verify_token)
):
    user_email = user["email"]
    user_id = user["uid"]

    category = predict_category(text)

    similar_count = 0
    for doc in db.collection("complaints").stream():
        c = doc.to_dict()
        if c["category"] == category:
            if is_within_radius(latitude, longitude, c["latitude"], c["longitude"]):
                similar_count += 1

    priority = assign_priority(similar_count + 1)

    # -------- PHOTO → CLOUDINARY --------
    photo_url = None
    if photo:
        result = cloudinary.uploader.upload(
            photo.file,
            folder="complaints"
        )
        photo_url = result["secure_url"]

    complaint_data = {
        "text": text,
        "location": location,
        "category": category,
        "priority": priority,
        "latitude": latitude,
        "longitude": longitude,
        "user_email": user_email,
        "user_id": user_id,
        "photo_url": photo_url,
        "created_at": datetime.utcnow()
    }

    db.collection("complaints").add(complaint_data)
    return complaint_data

# -------------------- GET MY COMPLAINTS --------------------
@app.get("/my-complaints")
def get_my_complaints(user_email: str):
    docs = (
        db.collection("complaints")
        .where("user_email", "==", user_email)
        .stream()
    )
    return [doc.to_dict() for doc in docs]

# -------------------- GET ALL COMPLAINTS --------------------
@app.get("/all-complaints")
def get_all_complaints():
    return [doc.to_dict() for doc in db.collection("complaints").stream()]
