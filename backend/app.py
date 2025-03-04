from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Демонстрационные метрики
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
  }
}

@app.route("/api/metrics", methods=["GET"])
def get_metrics():
  return jsonify(dummy_metrics)

if __name__ == "__main__":
  app.run(debug=True)
