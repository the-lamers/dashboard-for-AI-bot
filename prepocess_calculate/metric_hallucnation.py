import requests
from typing import List

def get_response(text: str) -> dict:
    api_url = "https://api.yandex.net/v1/gpt"  # Пример URL, замените на актуальный
    api_key = "YOUR_API_KEY"  # Замените на ваш API-ключ

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    data = {
        "text": text
    }

    response = requests.post(api_url, headers=headers, json=data)
    return response.json()

def llm_as_judge(text: str, contexts: List[str]) -> bool:
    # Отправьте текст на анализ модели
    response = get_response(text)

    # Проанализируйте ответ модели
    # Например, вы можете проверить, соответствует ли ответ контекстам
    for context in contexts:
        if context in response["text"]:
            return True
    return False
