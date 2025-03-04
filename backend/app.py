from flask import Flask, jsonify
from flask_cors import CORS
import json
import logging
import os

app = Flask(__name__)
CORS(app)

# Настройка логирования (logging – ведение журнала событий)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def parse_data(file_path):
  try:
    if not os.path.exists(file_path):
      logging.error(f"Файл не найден: {file_path}")
      return []
    with open(file_path, "r", encoding="utf-8") as f:
      data = json.load(f)
      if not isinstance(data, list):
        logging.error("Неверный формат данных: ожидается список записей")
        return []
      return data
  except Exception as e:
    logging.exception("Ошибка при чтении файла")
    return []

def compute_metrics(data):
  campus_counts = {}
  education_counts = {}
  question_cat_counts = {}
  repeated_q_map = {}
  response_times = []
  empty_chat_count = 0
  non_empty_chat_count = 0
  total_questions = 0

  for item in data:
    total_questions += 1

    campus = item.get("campus", "Не указан")
    campus_counts[campus] = campus_counts.get(campus, 0) + 1

    edu_level = item.get("education_level", "Не указан")
    education_counts[edu_level] = education_counts.get(edu_level, 0) + 1

    q_cat = item.get("question_category", "Другое")
    question_cat_counts[q_cat] = question_cat_counts.get(q_cat, 0) + 1

    user_q = item.get("user_question", "Неизвестный вопрос")
    repeated_q_map[user_q] = repeated_q_map.get(user_q, 0) + 1

    if "response_time" in item and isinstance(item["response_time"], (int, float)):
      response_times.append(item["response_time"])

    contexts = item.get("contexts", [])
    if contexts:
      non_empty_chat_count += 1
    else:
      empty_chat_count += 1

  repeated_questions = []
  for q, count in repeated_q_map.items():
    if count > 1:
      repeated_questions.append({"question": q, "count": count})

  average_response_time = sum(response_times) / len(response_times) if response_times else 0

  # Динамическая кастомная метрика – отношение суммы повторов вопросов к общему числу вопросов
  custom_metric_value = sum(q["count"] for q in repeated_questions) / total_questions if total_questions > 0 else 0

  metrics = {
    "campuses": campus_counts,
    "educationLevels": education_counts,
    "questionCategories": question_cat_counts,
    "performance": {
      "averageResponseTime": average_response_time,
      "emptyChatHistoryFrequency": empty_chat_count,
      "nonEmptyChatHistoryFrequency": non_empty_chat_count
    },
    "customMetric": {
      "customMetricValue": round(custom_metric_value, 2)
    },
    "chatHistory": {
      "repeatedQuestions": repeated_questions
    },
    # Статический анализ галлюцинаций (hallucination – галлюцинация)
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
    }
  }
  return metrics

@app.route("/api/metrics", methods=["GET"])
def get_metrics_endpoint():
  file_path = "parsed_dash.json"  # Путь к файлу с данными
  data = parse_data(file_path)
  if not data:
    return jsonify({"error": "Не удалось загрузить данные"}), 500

  main_metrics = compute_metrics(data)

  # Формируем ответ, включающий ключи, необходимые для фронтенда:
  response = {
    "campuses": main_metrics.get("campuses", {}),
    "educationLevels": main_metrics.get("educationLevels", {}),
    "questionCategories": main_metrics.get("questionCategories", {}),
    "performance": main_metrics.get("performance", {}),
    "hallucinationMetric": main_metrics.get("hallucinationMetric", {})
  }
  
  return jsonify(response)

if __name__ == "__main__":
  app.run(debug=True, port=5000)
