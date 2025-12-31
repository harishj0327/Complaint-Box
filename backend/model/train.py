import pandas as pd
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB

# Load data
data = pd.read_csv("../data/complaints_dataset.csv")

X = data["text"]
y = data["category"]

# Vectorization
vectorizer = TfidfVectorizer(stop_words="english")
X_vec = vectorizer.fit_transform(X)

# Model
model = MultinomialNB()
model.fit(X_vec, y)

# Save model
with open("classifier.pkl", "wb") as f:
    pickle.dump(model, f)

with open("vectorizer.pkl", "wb") as f:
    pickle.dump(vectorizer, f)

print("Model trained and saved successfully.")
