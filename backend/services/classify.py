import pickle

with open("model/classifier.pkl", "rb") as f:
    model = pickle.load(f)

with open("model/vectorizer.pkl", "rb") as f:
    vectorizer = pickle.load(f)

def predict_category(text: str):
    vec = vectorizer.transform([text])
    return model.predict(vec)[0]
