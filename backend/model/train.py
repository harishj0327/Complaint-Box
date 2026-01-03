import pandas as pd
import pickle
import re

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score


# -------------------- LOAD DATA --------------------
data = pd.read_csv("../data/complaints_dataset.csv")

print("Total samples:", len(data))
print("Category distribution:\n", data["category"].value_counts())


# -------------------- TEXT CLEANING --------------------
def clean_text(text):
    text = text.lower()
    text = re.sub(r"[^a-zA-Z\s]", "", text)  # remove symbols & numbers
    text = re.sub(r"\s+", " ", text).strip()
    return text

data["text"] = data["text"].apply(clean_text)


# -------------------- FEATURES & LABELS --------------------
X = data["text"]
y = data["category"]


# -------------------- VECTORIZATION --------------------
vectorizer = TfidfVectorizer(
    stop_words="english",
    ngram_range=(1, 2),     # unigrams + bigrams
    min_df=2,               # ignore very rare words
    max_df=0.9
)

X_vec = vectorizer.fit_transform(X)


# -------------------- TRAIN / TEST SPLIT --------------------
X_train, X_test, y_train, y_test = train_test_split(
    X_vec,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# -------------------- MODEL --------------------
model = MultinomialNB()
model.fit(X_train, y_train)


# -------------------- EVALUATION --------------------
y_pred = model.predict(X_test)

print("\n📊 MODEL EVALUATION\n")
print("Accuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n")
print(classification_report(y_test, y_pred))


# -------------------- SAVE MODEL --------------------
with open("classifier.pkl", "wb") as f:
    pickle.dump(model, f)

with open("vectorizer.pkl", "wb") as f:
    pickle.dump(vectorizer, f)

print("\n✅ Model trained and saved successfully.")
