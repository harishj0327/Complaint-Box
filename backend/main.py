from fastapi import FastAPI
from services.classify import predict_category
from services.priority import assign_priority
from services.geo import is_within_radius

app = FastAPI()

complaints_db = []

@app.post("/complaint")
def register_complaint(
    text: str,
    latitude: float,
    longitude: float
):
    category = predict_category(text)

    # count similar complaints
    similar_count = 0
    for c in complaints_db:
        if c["category"] == category:
            if is_within_radius(
                latitude, longitude,
                c["latitude"], c["longitude"]
            ):
                similar_count += 1

    priority = assign_priority(similar_count + 1)

    complaint = {
        "text": text,
        "category": category,
        "priority": priority,
        "latitude": latitude,
        "longitude": longitude
    }

    complaints_db.append(complaint)

    return complaint
