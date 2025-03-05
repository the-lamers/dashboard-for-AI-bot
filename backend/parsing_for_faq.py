import json
import re
import pandas as pd
from collections import Counter

import nltk
nltk.download("wordnet", quiet=True)
nltk.download("punkt", quiet=True)
nltk.download("stopwords", quiet=True)

from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

PARSED_FILE = "./val_set.json"

# Load JSON log file
def load_json_log(PARSED_FILE):
    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)

# Preprocess text
def preprocess_text(text):
    text = text.lower()  # Lowercasing
    text = re.sub(r"[^\w\s]", "", text)  # Remove punctuation
    tokens = word_tokenize(text)  # Tokenization
    stop_words = set(stopwords.words("english"))
    tokens = [word for word in tokens if word not in stop_words]  # Remove stopwords
    return " ".join(tokens)

# Extract and preprocess questions
def extract_questions(log_data):
    questions = [entry["message"] for entry in log_data]
    cleaned_questions = [preprocess_text(q) for q in questions]
    return cleaned_questions

# Remove exact duplicates
def remove_duplicates(questions):
    return list(set(questions))

# Load and process log file
file_path = "chatbot_logs.json"  # Update this with your file path
log_data = load_json_log(file_path)
cleaned_questions = extract_questions(log_data)
unique_questions = remove_duplicates(cleaned_questions)

# Display sample questions
print(f"Total questions: {len(cleaned_questions)}")
print(f"Unique questions: {len(unique_questions)}")
print("\nSample Questions:")
print(unique_questions[:5])
