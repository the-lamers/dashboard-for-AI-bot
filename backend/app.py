from flask import Flask, jsonify, request
from flask_cors import CORS
import json
from func_to_call import parse_all_data, parse_data_with_time
from collections import defaultdict

app = Flask(__name__)
CORS(app)

# Загружаем данные один раfз
data_v2 = parse_data_with_time('train_set.json')

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