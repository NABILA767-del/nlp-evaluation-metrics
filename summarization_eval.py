"""Summarization: ROUGE (n-gram overlap) vs BERTScore (semantic similarity)."""
from rouge_score import rouge_scorer
from bert_score import score as bert_score

REFERENCE = "The city council approved a new budget to expand public transport."
CANDIDATES = {
    "extractive": "The city council approved a new budget.",
    "paraphrase": "Local authorities voted funds to grow bus and tram services.",
    "hallucination": "The city council approved a new budget to build a stadium.",
}


def main():
    scorer = rouge_scorer.RougeScorer(["rouge1", "rouge2", "rougeL"], use_stemmer=True)
    cands = list(CANDIDATES.values())
    _, _, f1 = bert_score(cands, [REFERENCE] * len(cands), lang="en")
    print(f"{'candidate':14} R1     R2     RL     BERTScore-F1")
    for (name, text), bf in zip(CANDIDATES.items(), f1):
        r = scorer.score(REFERENCE, text)
        print(f"{name:14} {r['rouge1'].fmeasure:.2f}   {r['rouge2'].fmeasure:.2f}   "
              f"{r['rougeL'].fmeasure:.2f}   {bf.item():.2f}")
    # Take-away: the paraphrase is good but gets low ROUGE; the hallucination
    # keeps a high ROUGE although it is factually wrong.


if __name__ == "__main__":
    main()
