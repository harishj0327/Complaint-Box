from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import pickle

# Load AI model and vectorizer
model = pickle.load(open("../ai_model/model.pkl", "rb"))
vectorizer = pickle.load(open("../ai_model/vectorizer.pkl", "rb"))

app = FastAPI()

# Mount static files
app.mount("/static", StaticFiles(directory="../frontend"), name="static")

# Request body format
class Complaint(BaseModel):
    text: str

@app.get("/")
def home():
    return FileResponse("../frontend/index.html")

@app.post("/predict")
def predict_category(complaint: Complaint):
    text = [complaint.text]
    text_vectorized = vectorizer.transform(text)
    prediction = model.predict(text_vectorized)[0]

    return {
        "complaint": complaint.text,
        "predicted_category": prediction
    }