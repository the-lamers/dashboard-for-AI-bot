import torch
import numpy as np
from transformers import BertTokenizer, BertModel
from sklearn.metrics.pairwise import cosine_similarity

class ConceptualCoherenceScore:
    def __init__(self):
        self.tokenizer = BertTokenizer.from_pretrained('bert-base-cased')
        self.model = BertModel.from_pretrained('bert-base-cased')
        self.model.eval()
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model.to(self.device)

    def _encode_text(self, text):
        inputs = self.tokenizer(text, padding=True, truncation=True, return_tensors="pt")
        with torch.no_grad():
            outputs = self.model(**{k: v.to(self.device) for k, v in inputs.items()})
            embeddings = outputs.last_hidden_state[:, 0, :].cpu().numpy()
        return embeddings

    def calculate_score(self, model_output, ground_truth, context):
        # 1. Вычисление языкового соответствия (как в BertScore)
        model_embeddings = self._encode_text(model_output)
        gt_embeddings = self._encode_text(ground_truth)
        language_score = cosine_similarity(model_embeddings, gt_embeddings)[0][0]

        # 2. Вычисление концептуальной согласованности
        context_embeddings = self._encode_text(context)
        concept_score = cosine_similarity(model_embeddings, context_embeddings)[0][0]

        # 3. Весовые коэффициенты
        w_language = 0.6  # больший вес для языкового соответствия
        w_concept = 0.4   # меньший вес для концептуальной согласованности

        # 4. Итоговая метрика
        final_score = (w_language * language_score) + (w_concept * concept_score)

        return {
            "final_score": final_score,
            "language_score": language_score,
            "concept_score": concept_score
        }

# Пример использования
if __name__ == "__main__":
    evaluator = ConceptualCoherenceScore()

    model_output = "ВШЭ - это крупнейший университет России, основанный в 1990 году"
    ground_truth = "ВШЭ - это национальный исследовательский университет, основанный в 1992 году"
    context = [
        "НИУ ВШЭ был основан в 1992 году",
        "Высшая школа экономики является одним из ведущих университетов России",
        "В 1992 году была создана Высшая школа экономики"
    ]

    result = evaluator.calculate_score(model_output, ground_truth, context)
    print(f"Итоговая метрика: {result['final_score']}")
    print(f"Языковое соответствие: {result['language_score']}")
    print(f"Концептуальная согласованность: {result['concept_score']}")
