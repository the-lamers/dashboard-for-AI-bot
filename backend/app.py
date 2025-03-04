from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import re
import ast
from typing import List, Dict, Any

LOG_FILE = "val_set.json"
STATS_FILE = "stats.json"

app = Flask(__name__)
CORS(app)

def load_logs():
    if not os.path.exists(LOG_FILE):
        return []
    with open(LOG_FILE, "r", encoding="utf-8") as file:
        return json.load(file)

def load_stats():
    if not os.path.exists(STATS_FILE):
        return {"total_logs": 0, "categories": {}, "avg_response_time": 0, "user_filters": {}, "question_filters": {}}
    with open(STATS_FILE, "r", encoding="utf-8") as file:
        return json.load(file)

def update_stats(new_logs):
    stats = load_stats()
    total_old_logs = stats["total_logs"]

    for log in new_logs[total_old_logs:]:
        stats["total_logs"] += 1

        # Count category occurrences
        category = log.get("Категория вопроса", "Unknown")
        stats["categories"][category] = stats["categories"].get(category, 0) + 1

        # Compute average response time
        response_time = log.get("Время ответа модели (сек)", 0)
        stats["avg_response_time"] = ((stats["avg_response_time"] * total_old_logs) + response_time) / stats["total_logs"]

        # Count user filters
        for filter_item in log.get("user_filters", []):
            stats["user_filters"][filter_item] = stats["user_filters"].get(filter_item, 0) + 1

        # Count question filters
        for filter_item in log.get("question_filters", []):
            stats["question_filters"][filter_item] = stats["question_filters"].get(filter_item, 0) + 1

    # Save updated stats
    with open(STATS_FILE, "w", encoding="utf-8") as file:
        json.dump(stats, file, indent=4, ensure_ascii=False)

    return stats

@app.route("/update_stats", methods=["GET"])
def update_statistics():
    """Endpoint to update statistics based on the latest logs."""
    logs = load_logs()
    stats = update_stats(logs)
    return jsonify(stats)

@app.route("/get_stats", methods=["GET"])
def get_statistics():
    """Endpoint to retrieve current statistics."""
    stats = load_stats()
    return jsonify(stats)

@app.route("/reset_stats", methods=["GET"])
def reset_statistics():
    """Reset the statistics file."""
    stats = {"total_logs": 0, "categories": {}, "avg_response_time": 0, "user_filters": {}, "question_filters": {}}
    with open(STATS_FILE, "w", encoding="utf-8") as file:
        json.dump(stats, file, indent=4, ensure_ascii=False)
    return jsonify({"message": "Statistics reset successfully."})

if __name__ == "__main__":
    app.run(debug=True)













































