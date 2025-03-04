import requests
from typing import Dict, List

import re
import numpy as np

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


# Another solution
/*Эта метрика позволяет не только выявлять галлюцинации,
но и давать рекомендации по улучшению ответа, что делает её полезной как для конечных
пользователей, так и для разработчиков систем на базе LLM.*/

def extract_scores(shadow_response):
    # Регулярные выражения для извлечения оценок
    context_score = re.search(r'Соответствие контексту:\s*([0-9\.]+)', shadow_response)
    fact_score = re.search(r'Фактическая достоверность:\s*([0-9\.]+)', shadow_response)
    logic_score = re.search(r'Логическая связность:\s*([0-9\.]+)', shadow_response)
    style_score = re.search(r'Стилистическая адекватность:\s*([0-9\.]+)', shadow_response)

    # Проверка наличия всех оценок
    if not all([context_score, fact_score, logic_score, style_score]):
        raise ValueError("Не все оценки найдены в теневом ответе")

    # Преобразование в числа
    scores = {
        'C': float(context_score.group(1)),
        'F': float(fact_score.group(1)),
        'L': float(logic_score.group(1)),
        'S': float(style_score.group(1))
    }

    return scores

def calculate_HALO_score(scores):
    # Веса для каждого параметра
    weights = {
        'C': 0.4,
        'F': 0.3,
        'L': 0.2,
        'S': 0.1
    }

    # Расчет взвешенной суммы
    HALO_score = np.sum([scores[param] * weights[param] for param in scores])

    return HALO_score

def halo_check(original_response, context):
    # Генерация теневого ответа (здесь используется заглушка)
    shadow_response = f"""
    Анализ ответа:
    Соответствие контексту: 0.8
    Фактическая достоверность: 0.7
    Логическая связность: 0.9
    Стилистическая адекватность: 0.85
    """

    # Извлечение оценок
    scores = extract_scores(shadow_response)

    # Расчет итогового HALO_score
    HALO_score = calculate_HALO_score(scores)

    # Форматированный вывод
    result = {
        "HALO_score": HALO_score,
        "Детали оценок": scores,
        "Статус": "ОК" if HALO_score >= 0.6 else "Требует перепроверки",
        "Действие": "Разрешить" if HALO_score >= 0.6 else "Заблокировать"
    }

    return result

def halo_check(original_response, context):
    shadow_response = llm(f"Проанализируй ответ: '{original_response}'\nКонтекст: {context}\nОцени по параметрам: соответствие контексту, фактическая достоверность, логическая связность, стилистическая адекватность")

    # Извлечение оценок из shadow_response
    # Расчет HALO_score
    # Возврат результата

    return HALO_score

result = halo_check("Это тестовый ответ", "Это тестовый контекст")
print(result)
