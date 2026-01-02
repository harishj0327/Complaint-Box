import pickle
import re
import numpy as np

with open("model/classifier.pkl", "rb") as f:
    model = pickle.load(f)

with open("model/vectorizer.pkl", "rb") as f:
    vectorizer = pickle.load(f)


def clean_text(text: str):
    text = text.lower()
    text = re.sub(r"[^a-zA-Z\s]", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def predict_category(text: str):
    # Clean input same as training
    clean = clean_text(text)

    vec = vectorizer.transform([clean])

    # Prediction
    pred = model.predict(vec)[0]

    # Confidence score
    probs = model.predict_proba(vec)[0]
    confidence = np.max(probs)

    # Optional fallback for low confidence
    if confidence < 0.45:
        return pred  # you can later change this to "Other"

    return pred
