"""Open text generation: perplexity (GPT-2), distinct-n and Self-BLEU (diversity)."""
import math
from nltk.translate.bleu_score import SmoothingFunction, sentence_bleu


def distinct_n(texts, n):
    ngrams = [tuple(t.split()[i:i + n]) for t in texts for i in range(len(t.split()) - n + 1)]
    return len(set(ngrams)) / max(len(ngrams), 1)


def self_bleu(texts):
    smooth, scores = SmoothingFunction().method1, []
    for i, hyp in enumerate(texts):
        refs = [t.split() for j, t in enumerate(texts) if j != i]
        scores.append(sentence_bleu(refs, hyp.split(), smoothing_function=smooth))
    return sum(scores) / len(scores)


def perplexity(text, model_name="gpt2"):
    import torch
    from transformers import AutoModelForCausalLM, AutoTokenizer
    tok = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForCausalLM.from_pretrained(model_name).eval()
    ids = tok(text, return_tensors="pt").input_ids
    with torch.no_grad():
        loss = model(ids, labels=ids).loss
    return math.exp(loss.item())


if __name__ == "__main__":
    repetitive = ["the cat sat on the mat"] * 3
    diverse = ["the cat sat on the mat", "a storm rolled over the quiet harbour",
               "she wrote code until midnight"]
    for name, outs in [("repetitive", repetitive), ("diverse", diverse)]:
        print(f"{name:11} distinct-1={distinct_n(outs, 1):.2f} "
              f"distinct-2={distinct_n(outs, 2):.2f} self-BLEU={self_bleu(outs):.2f}")
    print("Perplexity (GPT-2):", round(perplexity("The weather is nice today."), 1))
