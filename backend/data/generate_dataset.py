import csv
import random

english = {
    "Road": [
        "potholes on road",
        "road damaged after rain",
        "broken road surface",
        "uneven road condition",
        "road full of holes",
        "bad road condition",
        "cracks on main road",
        "road not motorable",
        "street road damaged",
        "road causing traffic"
    ],
    "Water": [
        "no water supply",
        "water leakage from pipe",
        "tap water not coming",
        "drinking water problem",
        "water overflow from pipeline",
        "pipe burst issue",
        "water shortage",
        "irregular water supply",
        "low water pressure",
        "water problem in area"
    ],
    "Garbage": [
        "garbage not collected",
        "waste bin overflowing",
        "garbage piled on road",
        "trash problem",
        "waste dumped near house",
        "garbage smell issue",
        "municipal waste problem",
        "waste collection delay",
        "garbage issue in street",
        "trash overflow"
    ],
    "Electricity": [
        "power cut frequently",
        "no electricity supply",
        "street lights not working",
        "voltage fluctuation issue",
        "power failure",
        "electricity problem",
        "current not available",
        "power shutdown",
        "electricity outage",
        "frequent power issue"
    ],
    "Drainage": [
        "drainage overflow",
        "sewage water leakage",
        "drainage blocked",
        "bad smell from drainage",
        "sewage problem",
        "drainage water on road",
        "clogged drainage",
        "drainage issue in street",
        "sewage overflow",
        "drainage pipe broken"
    ]
}

tanglish = {
    "Road": [
        "road la romba potholes iruku",
        "road damage aagi iruku",
        "street road correct illa",
        "main road romba mosama iruku",
        "road full ah holes iruku"
    ],
    "Water": [
        "water supply varala",
        "tap la water varala",
        "pipe leak aagudhu",
        "drinking water problem iruku",
        "water shortage romba naal ah"
    ],
    "Garbage": [
        "garbage collect panala",
        "waste bin overflow aagudhu",
        "garbage smell romba iruku",
        "trash road la iruku",
        "garbage issue iruku"
    ],
    "Electricity": [
        "current frequent ah pogudhu",
        "street light work aagala",
        "power cut daily nadakudhu",
        "voltage romba fluctuation",
        "electricity supply illa"
    ],
    "Drainage": [
        "drainage overflow aagudhu",
        "sewage water road la odudhu",
        "drainage block aagi iruku",
        "drainage smell romba mosam",
        "sewage problem iruku"
    ]
}

prefixes_eng = [
    "There is",
    "Facing",
    "Complaint regarding",
    "Issue of",
    "Severe",
    "Frequent"
]

suffixes_eng = [
    "in my area",
    "near my house",
    "in our street",
    "near bus stand",
    "for many days",
    "in this locality"
]

prefixes_ta = [
    "Enga area la",
    "Inga",
    "Namma street la",
    "Indha area la",
    "Recent ah"
]

suffixes_ta = [
    "romba problem iruku",
    "seekram solve pannunga",
    "many days ah",
    "daily nadakudhu",
    "romba kashtam"
]

rows = []

# Generate English (500)
for category, texts in english.items():
    for _ in range(100):
        base = random.choice(texts)
        text = f"{random.choice(prefixes_eng)} {base} {random.choice(suffixes_eng)}"
        rows.append([text, category])

# Generate Tamil-English (300)
for category, texts in tanglish.items():
    for _ in range(60):
        base = random.choice(texts)
        text = f"{random.choice(prefixes_ta)} {base} {random.choice(suffixes_ta)}"
        rows.append([text, category])

random.shuffle(rows)

with open("complaints_dataset.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["text", "category"])
    writer.writerows(rows)

print("✅ Dataset generated")
print("Total samples:", len(rows))