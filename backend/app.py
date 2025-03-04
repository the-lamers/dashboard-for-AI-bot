from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import re
import ast
from typing import List, Dict, Any

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

cache = {}

def parse_all_data(data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    return _parse_data(data, include_time=False)

def parse_data_with_time(data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    return _parse_data(data, include_time=True)

def _parse_data(data: List[Dict[str, Any]], include_time: bool) -> List[Dict[str, Any]]:
    result = []
    for item in data:
        parsed = {
            'selected_role': item['Выбранная роль'],
            'campus': item['Кампус'],
            'education_level': item['Уровень образования'],
            'question_category': item['Категория вопроса'],
            'user_question': _clean_text(item['Вопрос пользователя']),
            'user_filters': item['user_filters'],
            'question_filters': item['question_filters'],
            'saiga_answer': _clean_text(item['Saiga']),
            'giga_answer': _clean_text(item['Giga']),
            'winner': item['Кто лучше?'],
            'comment': item['Комментарий'],
            'contexts': _parse_contexts(item['Ресурсы для ответа'])
        }

        if item.get('Уточненный вопрос пользователя'):
            parsed.update({
                'refined_question': _clean_text(item['Уточненный вопрос пользователя']),
                'refined_answer': _clean_text(item['Ответ AI (уточнение)']),
                'refined_contexts': _parse_contexts(item['Ресурсы для ответа (уточнение)'] or '')
            })

        if include_time:
            parsed.update({
                'response_time': item['Время ответа модели (сек)'],
                'refined_response_time': item.get('Время ответа модели на уточненный вопрос (сек)')
            })
        
        result.append(parsed)
    
    return result

def _parse_contexts(resources: str) -> List[Dict[str, Any]]:
    contexts = []
    pattern = re.compile(r"Document\(page_content='(.*?)', metadata=({.*?})\)", re.DOTALL)
    
    for match in re.finditer(pattern, resources):
        content, metadata_str = match.groups()
        try:
            metadata = ast.literal_eval(metadata_str)
            tags = _extract_tags(metadata)
            
            contexts.append({
                'text': _clean_text(content),
                'metadata': {
                    'source': metadata.get('source'),
                    'file_name': metadata.get('file_name'),
                    'url': metadata.get('url')
                },
                'tags': tags
            })
        except Exception as e:
            print(f"Контекст не распарсился: {e}")
    
    return contexts

def _extract_tags(metadata: Dict) -> Dict[str, List[str]]:
    return {
        'topic_tags': [v for k,v in metadata.items() if k.startswith('topic_tag_') and v],
        'user_tags': [v for k,v in metadata.items() if k.startswith('user_tag_') and v]
    }

def _clean_text(text: str) -> str:
    if not text: return ''
    return re.sub(r'\\[nrt]|[\n\r\t]+|\s+', ' ', text).strip()

# dummy_metrics = {
#     "campuses": {
#         "Москва": 120,
#         "Нижний Новгород": 80,
#         "Санкт-Петербург": 95,
#         "Пермь": 60
#     },
#     "educationLevels": {
#         "бакалавриат": 200,
#         "магистратура": 150,
#         "специалитет": 90,
#         "аспирантура": 40
#     },
#     "questionCategories": {
#         "Деньги": 50,
#         "Учебный процесс": 100,
#         "Практическая подготовка": 70
#     },
#     "chatHistory": {
#         "repeatedQuestions": [
#             {"question": "Когда пересдача?", "count": 25},
#             {"question": "Как записаться на экзамен?", "count": 15}
#         ]
#     },
#     "performance": {
#         "averageResponseTime": 3.29,
#         "emptyChatHistoryFrequency": 70,
#         "nonEmptyChatHistoryFrequency": 30
#     },
#     "customMetric": {
#         "customMetricValue": 0.65
#     },
#     "hallucinationMetric": {
#         "currentValue": 0.15,  # Например, 15% некорректных ответов
#         "history": [
#             {"date": "2025-03-01", "value": 0.10},
#             {"date": "2025-03-05", "value": 0.12},
#             {"date": "2025-03-10", "value": 0.15},
#             {"date": "2025-03-15", "value": 0.14},
#             {"date": "2025-03-20", "value": 0.15}
#         ],
#         "details": [
#             {"parameter": "Сравнение с эталоном", "value": 0.2, "comment": "Низкое совпадение с эталоном"},
#             {"parameter": "Логическая связность", "value": 0.1, "comment": "Найдено несколько противоречий"},
#             {"parameter": "Эвристика ключевых слов", "value": 0.15, "comment": "Наличие подозрительных фраз"}
#         ]
#     }
# }

@app.route('/api/upload', methods=['POST'])
def upload_file():
    try:
        file = request.files['file']
        data = json.load(file)
        parsed_data = parse_data_with_time(data)  # Parse the uploaded JSON
        cache[file.filename] = parsed_data  # Cache the parsed data
        return jsonify({"message": "File received and parsed", "data": parsed_data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/metrics', methods=['GET'])
def get_cache():
    return jsonify(cache)

if __name__ == '__main__':
    app.run(debug=True)













































