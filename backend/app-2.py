from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
from func_to_call import parse_all_data, parse_data_with_time
from collections import defaultdict, Counter

app = Flask(__name__)
CORS(app)

# Настройка логирования (logging – ведение журнала событий)
data_v2 = parse_data_with_time('train_set.json')

with open('parsed_dash.json', 'w', encoding='utf-8') as f:
    json.dump(data_v2, f, ensure_ascii=False, indent=4)


campuses = defaultdict(int)
education_levels = defaultdict(int)
question_categories = defaultdict(int)
total_response_time = 0
empty_chat_history_count = 0
non_empty_chat_history_count = 0

# Подсчет
for entry in data_v2:
    # Подсчет для campuses, education_levels, question_categories
    campuses[entry['campus']] += 1
    education_levels[entry['education_level'].lower()] += 1
    question_categories[entry['question_category']] += 1

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
        "repeatedQuestions": [
            {"question": "Когда пересдача?", "count": 25},
            {"question": "Как записаться на экзамен?", "count": 15}
        ]
    }
}

# Вывод результата
with open('result.json', 'w', encoding='utf-8') as f:
    json.dump(output_json, f, ensure_ascii=False, indent=4)

@app.route("/api/metrics", methods=["GET"])
def get_metrics():

    with open("parsed_dash.json", 'r', encoding='utf-8') as f:
        data = json.load(f)

    campus = request.args.get('campus', default=None, type=str)
    education_level = request.args.get('education_level', default=None, type=str)
    category_question = request.args.get('category_question', default=None, type=str)

    # Фильтруем данные по переданным параметрам
    filtered_data = [
        item for item in data
        if (not campus or item.get("campus") == campus) and
           (not education_level or item.get("education_level") == education_level) and
           (not category_question or item.get("question_category") == category_question)
    ]

    # Если ничего не найдено
    if not filtered_data:
        return jsonify({"error": "Данные не найдены"}), 404

    # Подсчитываем количество уникальных значений education_level и question_category
    education_counts = Counter(item.get("education_level") for item in filtered_data if item.get("education_level"))
    category_counts = Counter(item.get("question_category") for item in filtered_data if item.get("question_category"))

    # Формируем ответ
    response = {
        "filtered_data": filtered_data,  # Отфильтрованные данные
        "education_level_counts": dict(education_counts),  # Подсчет education_level
        "category_question_counts": dict(category_counts)  # Подсчет question_category
    }

    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True)
