from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import pickle
import os

# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(script_dir)

# Load AI model and vectorizer
model_path = os.path.join(project_root, "ai_model", "model.pkl")
vectorizer_path = os.path.join(project_root, "ai_model", "vectorizer.pkl")
model = pickle.load(open(model_path, "rb"))
vectorizer = pickle.load(open(vectorizer_path, "rb"))

app = FastAPI()

# Mount static files
app.mount("/static", StaticFiles(directory=os.path.join(project_root, "frontend")), name="static")

# Request body format
class Complaint(BaseModel):
    text: str

@app.get("/")
def home():
    return FileResponse(os.path.join(project_root, "frontend", "complaint.html"))

@app.post("/predict")
def predict_category(complaint: Complaint):
    text = [complaint.text]
    text_vectorized = vectorizer.transform(text)
    prediction = model.predict(text_vectorized)[0]

    return {
        "complaint": complaint.text,
        "predicted_category": prediction
    }