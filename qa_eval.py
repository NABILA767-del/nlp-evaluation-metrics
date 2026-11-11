"""Question answering: Exact Match, token-level F1 (SQuAD style), Recall@k and MRR. No dependencies."""
import re
import string
from collections import Counter


def normalize(text):
    text = text.lower()
    text = "".join(ch for ch in text if ch not in set(string.punctuation))
    text = re.sub(r"\b(a|an|the)\b", " ", text)
    return " ".join(text.split())


def exact_match(pred, gold):
    return float(normalize(pred) == normalize(gold))


def f1_score(pred, gold):
    p, g = normalize(pred).split(), normalize(gold).split()
    common = Counter(p) & Counter(g)
    overlap = sum(common.values())
    if overlap == 0:
        return 0.0
    precision, recall = overlap / len(p), overlap / len(g)
    return 2 * precision * recall / (precision + recall)


def recall_at_k(ranked_ids, relevant_id, k):
    return float(relevant_id in ranked_ids[:k])


def reciprocal_rank(ranked_ids, relevant_id):
    return 1 / (ranked_ids.index(relevant_id) + 1) if relevant_id in ranked_ids else 0.0


if __name__ == "__main__":
    gold = "The Eiffel Tower"
    for pred in ["Eiffel Tower", "the eiffel tower in Paris", "Statue of Liberty"]:
        print(f"{pred!r:30} EM={exact_match(pred, gold):.0f}  F1={f1_score(pred, gold):.2f}")
    ranking = ["d7", "d2", "d9", "d1"]  # retriever output, best first
    print("Recall@1 =", recall_at_k(ranking, "d2", 1),
          "| Recall@3 =", recall_at_k(ranking, "d2", 3),
          "| MRR =", reciprocal_rank(ranking, "d2"))
