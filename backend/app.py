from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Демонстрационные метрики (обратите внимание, что реальная логика расчёта галлюцинаций может быть реализована
# отдельно (например, с использованием ML/эвристик), а здесь используются фиксированные данные для демонстрации)
dummy_metrics = {
    "campuses": {
        "Москва": 120,
        "Нижний Новгород": 80,
        "Санкт-Петербург": 95,
        "Пермь": 60
    },
    "educationLevels": {
        "бакалавриат": 200,
        "магистратура": 150,
        "специалитет": 90,
        "аспирантура": 40
    },
    "questionCategories": {
        "Деньги": 50,
        "Учебный процесс": 100,
        "Практическая подготовка": 70
    },
    "chatHistory": {
        "repeatedQuestions": [
            {"question": "Когда пересдача?", "count": 25},
            {"question": "Как записаться на экзамен?", "count": 15}
        ]
    },
    "performance": {
        "averageResponseTime": 3.29,
        "emptyChatHistoryFrequency": 70,
        "nonEmptyChatHistoryFrequency": 30
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
    }
}

@app.route("/api/metrics", methods=["GET"])
def get_metrics():
    return jsonify(dummy_metrics)

if __name__ == "__main__":
    app.run(debug=True)
