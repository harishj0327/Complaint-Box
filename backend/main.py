from fastapi import FastAPI
from pydantic import BaseModel
import pickle

# Load AI model and vectorizer
model = pickle.load(open("model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

app = FastAPI()

# Request body format
class Complaint(BaseModel):
    text: str

@app.get("/")
def home():
    return {"message": "AI Civic Issue Resolver Backend Running"}

@app.post("/predict")
def predict_category(complaint: Complaint):
    text = [complaint.text]
    text_vectorized = vectorizer.transform(text)
    prediction = model.predict(text_vectorized)[0]

    return {
        "complaint": complaint.text,
        "predicted_category": prediction
    }