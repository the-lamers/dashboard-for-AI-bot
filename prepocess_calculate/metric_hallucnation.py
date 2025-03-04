import requests
from typing import Dict, List

def get_response(text: str, context: str) -> Dict:
    api_url = "https://api.yandex.net/v1/gpt"  # Замените на актуальный URL
    api_key = "YOUR_API_KEY"  # Замените на ваш API-ключ

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    # Формируем промпт для оценки галлюцинаций
    prompt = f"""
    Ты - эксперт по проверке достоверности ответов языковых моделей.

    Запрос: {text}
    Исходный контекст: {context}
    Ответ модели: {text}

    Оцени достоверность ответа по следующим критериям:
    1. Соответствие исходному контексту
    2. Наличие фактических ошибок
    3. Логическая связность

    Верни ответ в формате JSON:
    {{
        "hallucination_score": float (от 0 до 1),
        "explanation": str,
        "verdict": "достоверный" или "галлюцинация"
    }}
    """

    data = {
        "text": prompt
    }

    response = requests.post(api_url, headers=headers, json=data)
    return response.json()

def evaluate_hallucinations(text: str, context: str) -> Dict:
    """
    Оценивает вероятность галлюцинации в ответе LLM модели

    :param text: ответ модели
    :param context: исходный контекст запроса
    :return: словарь с оценкой и объяснением
    """
    try:
        response = get_response(text, context)
        result = {
            "hallucination_score": response["hallucination_score"],
            "explanation": response["explanation"],
            "verdict": response["verdict"]
        }
        return result
    except KeyError:
        return {
            "error": "Не удалось получить оценку от модели"
        }

# Пример использования
query = "Кто президент США?"
context = "Джо Байден стал президентом США в 2021 году."
response_text = "Барак Обама является текущим президентом США."

result = evaluate_hallucinations(response_text, context)
print(result)
