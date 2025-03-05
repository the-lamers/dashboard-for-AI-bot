from flask import Flask, jsonify, request
from flask_cors import CORS
import json
from func_to_call import parse_all_data, parse_data_with_time
from collections import defaultdict
from sklearn.cluster import AgglomerativeClustering
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import requests


app = Flask(__name__)
CORS(app)

# Загружаем данные один раfз
data_v2 = parse_data_with_time('train_set.json')

<<<<<<< HEAD
with open('parsed_dash.json', 'w', encoding='utf-8') as f:
    json.dump(data_v2, f, ensure_ascii=False, indent=4)


campuses = defaultdict(int)
education_levels = defaultdict(int)
question_categories = defaultdict(int)
total_response_time = 0
empty_chat_history_count = 0
non_empty_chat_history_count = 0
questions = []

# Подсчет
for entry in data_v2:
    # Подсчет для campuses, education_levels, question_categories
    campuses[entry['campus']] += 1
    education_levels[entry['education_level'].lower()] += 1
    question_categories[entry['question_category']] += 1

    questions.append(entry['user_question'])
    # Суммирование времени ответа
    total_response_time += entry['response_time']

    # Подсчет пустых и непустых историй чата (примерная логика)
    if entry.get('comment') is None:  # Пример проверки пустой истории
        empty_chat_history_count += 1
    else:
        non_empty_chat_history_count += 1

# Расчет среднего времени ответа
average_response_time = total_response_time / len(data_v2)

# Расчет частот пустой и непустой истории чата
total_chat_histories = empty_chat_history_count + non_empty_chat_history_count
empty_chat_history_frequency = (empty_chat_history_count / total_chat_histories) * 100
non_empty_chat_history_frequency = (non_empty_chat_history_count / total_chat_histories) * 100

repeatedQuestions = []
clusters = {}

model_id = "sentence-transformers/all-MiniLM-L6-v2"
hf_token = "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"

api_url = f"https://api-inference.huggingface.co/pipeline/feature-extraction/{model_id}"
headers = {"Authorization": f"Bearer {hf_token}"}

def query(texts):
    response = requests.post(api_url, headers=headers, json={"inputs": questions, "options":{"wait_for_model":True}})
    return response.json()

embeddings = query(questions)

clustering = AgglomerativeClustering(n_clusters=None, distance_threshold=0.15, metric='cosine', linkage='average')
labels = clustering.fit_predict(embeddings)
for i, label in enumerate(labels):
    clusters.setdefault(label, []).append(questions[i])

for cluster_id, cluster_questions in clusters.items():
    repeatedQuestions.append({"question": cluster_questions[0], "count": len(cluster_questions)})

repeatedQuestions = sorted(repeatedQuestions, key=lambda x: x["count"], reverse=True)  
repeatedQuestions = repeatedQuestions[:10]

# Формирование итогового JSON
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
        "currentValue": 0.15,  # Например, 15% некорректных ответов
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
    "chatHistory": {
        "repeatedQuestions": repeatedQuestions
    }
}

# Вывод результата
with open('result.json', 'w', encoding='utf-8') as f:
    json.dump(output_json, f, ensure_ascii=False, indent=4)


def filter_data(campus, education_level, category_question):
    """Фильтрует данные по переданным параметрам"""
    return [
        entry for entry in data_v2
        if (not campus or entry.get("campus") == campus) and
           (not education_level or entry.get("education_level") == education_level) and
           (not category_question or entry.get("question_category") == category_question)
    ]


@app.route("/api/metrics", methods=["GET"])
def get_metrics():
    """Обрабатывает запрос и возвращает отфильтрованные метрики"""

    # Получаем параметры запроса
    campus = request.args.get('campus', default=None, type=str)
    education_level = request.args.get('education_level', default=None, type=str)
    category_question = request.args.get('category_question', default=None, type=str)

    # Фильтруем данные
    filtered_data = filter_data(campus, education_level, category_question)

    # Считаем статистику
    campuses = defaultdict(int)
    education_levels = defaultdict(int)
    question_categories = defaultdict(int)
    total_response_time = 0
    empty_chat_history_count = 0
    non_empty_chat_history_count = 0

    for entry in filtered_data:
        campuses[entry['campus']] += 1
        education_levels[entry['education_level'].lower()] += 1
        question_categories[entry['question_category']] += 1

        total_response_time += entry['response_time']

        if entry.get('comment') is None:
            empty_chat_history_count += 1
        else:
            non_empty_chat_history_count += 1

    # Среднее время ответа
    average_response_time = round(total_response_time / len(filtered_data), 2) if filtered_data else 0

    # Частота пустых/непустых чатов
    total_chat_histories = empty_chat_history_count + non_empty_chat_history_count
    empty_chat_history_frequency = round((empty_chat_history_count / total_chat_histories) * 100, 2) if total_chat_histories else 0
    non_empty_chat_history_frequency = round((non_empty_chat_history_count / total_chat_histories) * 100, 2) if total_chat_histories else 0

    # Итоговый JSON
    output_json = {
        "campuses": dict(campuses),
        "educationLevels": dict(education_levels),
        "questionCategories": dict(question_categories),
        "performance": {
            "averageResponseTime": average_response_time,
            "emptyChatHistoryFrequency": empty_chat_history_frequency,
            "nonEmptyChatHistoryFrequency": non_empty_chat_history_frequency
        },
        "customMetric": {"customMetricValue": 0.65},
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
        "chatHistory": {
            "repeatedQuestions": [
                {"question": "Когда пересдача?", "count": 25},
                {"question": "Как записаться на экзамен?", "count": 15}
            ]
        }
    }

    return jsonify(output_json)

if __name__ == "__main__":
    app.run(debug=True)
