# Evaluation Metrics for Natural Language Tasks

Master Data & IA (INPT) homework. Three generative NLP tasks: **summarization**, **question answering** and **open text generation**. Each script is a short, runnable example of the metrics presented in the slides.

## Installation
```bash
pip install -r requirements.txt
```
`qa_eval.py` has no dependency. `bert-score` and `transformers` download their models on first run (internet needed).

## Files
| File | Task | Metrics | Run |
|---|---|---|---|
| `summarization_eval.py` | Summarization | ROUGE-1/2/L, BERTScore | `python summarization_eval.py` |
| `qa_eval.py` | Question answering | Exact Match, token F1, Recall@k, MRR | `python qa_eval.py` |
| `generation_eval.py` | Text generation | Perplexity (GPT-2), distinct-n, Self-BLEU | `python generation_eval.py` |
| `build_deck.js` | Slides | Generates `NLP_Evaluation_Metrics.pptx` | `node build_deck.js` (needs `pptxgenjs`) |

## Documentation of the code

### summarization_eval.py
Compares three candidate summaries (extractive, paraphrase, hallucination) against one reference.
- `rouge_scorer.RougeScorer`: F-measure of ROUGE-1, ROUGE-2 and ROUGE-L (with stemming).
- `bert_score.score`: F1 computed from contextual embeddings.
- Expected observation: the paraphrase gets a low ROUGE but a good BERTScore; the hallucinated summary keeps a high ROUGE although it is factually wrong.

### qa_eval.py
- `normalize(text)`: SQuAD normalization (lowercase, no punctuation, no articles).
- `exact_match(pred, gold)`: 1 if the normalized strings are identical, else 0.
- `f1_score(pred, gold)`: harmonic mean of token precision and recall.
- `recall_at_k(ranked_ids, relevant_id, k)` and `reciprocal_rank(...)`: retrieval metrics for open-domain QA (MRR is the mean of the reciprocal rank).

### generation_eval.py
- `perplexity(text)`: exp of the average cross-entropy of GPT-2 on the text (lower is better).
- `distinct_n(texts, n)`: ratio of unique n-grams to all n-grams (higher = more diverse).
- `self_bleu(texts)`: BLEU of each output against the others (higher = less diverse).

## Metrics summary
| Task | Automatic metrics | Main limitation |
|---|---|---|
| Summarization | ROUGE, BERTScore, factual consistency | ROUGE ignores meaning and factuality |
| Question answering | EM, F1, Recall@k, MRR | EM/F1 penalize valid paraphrases |
| Text generation | Perplexity, distinct-n, Self-BLEU, MAUVE | No single reference: needs human or LLM judges |
