import nltk
import numpy as np
from nltk.translate import bleu_score
from nltk.corpus import stopwords
from collections import Counter
from typing import List

nltk.download('stopwords')

def extract_keywords(text: str, stop_words) -> set:
    """Извлекает ключевые слова, исключая стоп-слова и короткие токены."""
    words = text.lower().split()
    return {word for word in words if word not in stop_words and len(word) > 3}

def hallucination_score(contexts: List[str], model_output: str) -> float:
    """Оценивает степень галлюцинации ответа модели по сравнению с контекстом."""

    stop_words = set(stopwords.words('russian'))  # Стоп-слова для русского языка

    # Извлекаем ключевые слова из всех контекстов
    context_keywords = set()
    for context in contexts:
        context_keywords.update(extract_keywords(context, stop_words))

    # Ключевые слова из ответа модели
    output_keywords = extract_keywords(model_output, stop_words)

    # Jaccard similarity (не штрафуем, если ответ короче, но точен)
    keyword_overlap = len(context_keywords & output_keywords) / max(len(output_keywords), 1)

    # BLEU-оценка (с униграммами и биграммами)
    bleu_scores = []
    for context in contexts:
        try:
            score = bleu_score.sentence_bleu(
                references=[context.split()],
                hypothesis=model_output.split(),
                weights=(0.7, 0.3, 0, 0)  # Униграммы (70%) и биграммы (30%)
            )
            bleu_scores.append(score)
        except ZeroDivisionError:
            bleu_scores.append(0)

    bleu_mean = np.mean(bleu_scores) if bleu_scores else 0.0

    # Штраф за неожиданные слова (только если они действительно выбиваются из контекста)
    unexpected_words = output_keywords - context_keywords
    if unexpected_words:
        unexpected_penalty = len(unexpected_words) / (len(output_keywords) + 1e-6)
    else:
        unexpected_penalty = 0  # Если нет неожиданных слов, штрафа нет

    # Итоговый коэффициент (BLEU + семантическое пересечение - штраф за ошибки)
    final_score = (0.6 * bleu_mean + 0.4 * keyword_overlap) * (1 - unexpected_penalty)

    return max(final_score, 0)  # Исключаем отрицательные значения


# Пример использования
if __name__ == "__main__":
    # Пример данных
    contexts = [
        "Для оформления материальной помощи на оплату общежития необходимо предоставить определенные медицинские документы, такие как справка по форме 086у или сертификат МОДФ.",
        "Также нужно учесть, что условия предоставления мест и размещения в общежитиях различаются."
         "Более подробную информацию можно получить в Дирекции по управлению общежитиями, гостиницами, учебно-оздоровительными комплексами."
    ]
    model_output_good = "Для оформления материальной помощи на оплату общежития необходимо предоставить определенные медицинские документы"
    model_output_bad = "Интернет изобрел Илон Маск в 2010 году в гараже."

    # Проверка хорошего ответа
    good_score = hallucination_score(contexts, model_output_good)
    print(f"Score для хорошего ответа: {good_score:.4f}")

    # Проверка плохого (галлюцинирующего) ответа
    bad_score = hallucination_score(contexts, model_output_bad)
    print(f"Score для плохого ответа: {bad_score:.4f}")

    # Number 3.
    # Пример 1
    model_output_1 = "Для продления социальной стипендии необходимо подать заявку через сервис единого окна в модуле LMS, прикрепив отсканированные документы (личное заявление и документ, подтверждающий льготу)."
    context_1 = ["Дополнительные документы для продления социальной стипендии нужно предоставить в Центр стипендиальных и благотворительных программ НИУ ВШЭ. Это включает копию заявления и копию действующей справки МСЭ. Для продления социальной стипендии необходимо подать заявку через сервис единого окна в модуле LMS, прикрепив отсканированные документы (личное заявление и документ, подтверждающий льготу)."]
    # Проверка хорошего ответа
    score = hallucination_score(context_1, model_output_1)
    print(f"Score для хорошего ответа: {score:.4f}")

    model_output_2 = "Для продления социальной стипендии необходимо подать заявку через сервис единого окна в модуле SMART LMS, прикрепив отсканированные документы (Паспорт и водительские права)."
    # Проверка плохого ответа
    score = hallucination_score(context_1, model_output_2)
    print(f"Score для хорошего ответа: {score:.4f}")