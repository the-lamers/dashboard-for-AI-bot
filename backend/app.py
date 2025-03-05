from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
from func_to_call import parse_all_data, parse_data_with_time
from collections import defaultdict
from sklearn.cluster import AgglomerativeClustering
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import requests
from func_to_call import parse_all_data, parse_data_with_time
from collections import defaultdict


app = Flask(__name__)
CORS(app)

def filter_data(campus, education_level, category_question, parsed_data):
    """Фильтрует данные по переданным параметрам"""
    return [
        entry for entry in parsed_data
        if (not campus or entry.get("campus") == campus) and
           (not education_level or entry.get("education_level") == education_level) and
           (not category_question or entry.get("question_category") == category_question)
    ]

def query(texts, api_url, headers):
    response = requests.post(api_url, headers=headers, json={"inputs": texts, "options":{"wait_for_model":True}})
    return response.json()

def get_metrics_json():
    parsed_data = parse_data_with_time('train_set.json')

    with open('parsed_dashboard_data.json', 'w', encoding='utf-8') as f:
        json.dump(parsed_data, f, ensure_ascii=False, indent=4)


    campus = request.args.get('campus', default=None, type=str)
    education_level = request.args.get('education_level', default=None, type=str)
    category_question = request.args.get('category_question', default=None, type=str)


    filtered_data = filter_data(campus, education_level, category_question, parsed_data)

    campuses = defaultdict(int)
    education_levels = defaultdict(int)
    question_categories = defaultdict(int)
    total_response_time = 0
    empty_chat_history_count = 0
    non_empty_chat_history_count = 0
    questions = []

    for entry in filtered_data:
        campuses[entry['campus']] += 1
        education_levels[entry['education_level'].lower()] += 1
        question_categories[entry['question_category']] += 1

        questions.append(entry['user_question'])
        total_response_time += entry['response_time']

        if entry.get('comment') is None:
            empty_chat_history_count += 1
        else:
            non_empty_chat_history_count += 1

    average_response_time = total_response_time / len(filtered_data)

    total_chat_histories = empty_chat_history_count + non_empty_chat_history_count
    empty_chat_history_frequency = (empty_chat_history_count / total_chat_histories) * 100
    non_empty_chat_history_frequency = (non_empty_chat_history_count / total_chat_histories) * 100

    if os.path.exists("repeated_questions.json"):
        with open("repeated_questions.json", "r", encoding="utf-8") as file:
            repeatedQuestions_res = json.load(file)
    else:
        repeatedQuestions = []
        clusters = {}

        model_id = "sentence-transformers/all-MiniLM-L6-v2"
        hf_token = "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"

        api_url = f"https://api-inference.huggingface.co/pipeline/feature-extraction/{model_id}"
        headers = {"Authorization": f"Bearer {hf_token}"}

        embeddings = query(questions, api_url, headers)

        clustering = AgglomerativeClustering(n_clusters=None, distance_threshold=0.15, metric='cosine', linkage='average')
        labels = clustering.fit_predict(embeddings)
        for i, label in enumerate(labels):
            clusters.setdefault(label, []).append(questions[i])

        for cluster_id, cluster_questions in clusters.items():
            repeatedQuestions.append({"question": cluster_questions[0], "count": len(cluster_questions)})

        repeatedQuestions = sorted(repeatedQuestions, key=lambda x: x["count"], reverse=True)  
        repeatedQuestions = repeatedQuestions[:10]

        with open("repeated_questions.json", "w", encoding="utf-8") as file:
            repeatedQuestions_res = {"repeatedQuestions":repeatedQuestions}
            json.dump(repeatedQuestions_res, file, indent=4, ensure_ascii=False)


    output_json = {
        "campuses": dict(campuses),
        "educationLevels": dict(education_levels),
        "questionCategories": dict(question_categories),
        "performance": {
            "averageResponseTime": round(average_response_time, 2),  # Округление до 2 знаков
            "emptyChatHistoryFrequency": round(empty_chat_history_frequency, 2),
            "nonEmptyChatHistoryFrequency": round(non_empty_chat_history_frequency, 2)
        },
        "customMetric": {
            "customMetricValue": 0.65
        },
        "hallucinationMetric": {
            "currentValue": 0.15,
            "history": [
                {"date": "2025-03-01", "value": 0.10},
                {"date": "2025-03-05", "value": 0.12},
                {"date": "2025-03-10", "value": 0.15},
                {"date": "2025-03-15", "value": 0.14},
                {"date": "2025-03-20", "value": 0.15}
            ],
            "details": [
                {"parameter": "Сравнение с эталоном", "value": 0.2, "comment": "Низкое совпадение с эталоном"},
                {"parameter": "Логическая связность", "value": 0.1, "comment": "Найдено несколько противоречий"},
                {"parameter": "Эвристика ключевых слов", "value": 0.15, "comment": "Наличие подозрительных фраз"}
            ]
        },
        "chatHistory": repeatedQuestions_res
    }

    with open('result.json', 'w', encoding='utf-8') as f:
        json.dump(output_json, f, ensure_ascii=False, indent=4)
    return output_json

@app.route("/api/metrics", methods=["GET"])
def get_metrics():
    output_json = get_metrics_json()
    return jsonify(output_json)

if __name__ == "__main__":
    app.run(debug=True)
