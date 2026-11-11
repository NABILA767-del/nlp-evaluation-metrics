const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.theme = { headFontFace: "Calibri", bodyFontFace: "Calibri" };
const C = { navy: "12355B", blue: "1B7FD0", light: "EEF4FA", text: "1F2933", grey: "5C6B7A", white: "FFFFFF" };

pres.defineSlideMaster({
  title: "CONTENT", background: { color: C.white },
  objects: [{ rect: { x: 0, y: 0, w: 10, h: 0.12, fill: { color: C.blue } } }],
  slideNumber: { x: 9.2, y: 5.25, color: C.grey, fontSize: 10 },
  placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.35, w: 8.8, h: 0.8, fontSize: 28, bold: true, color: C.navy, margin: 0 }, text: "" },
});
pres.defineSlideMaster({ title: "TITLE", background: { color: C.navy } });

function content(title, bullets, side) {
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText(title, { placeholder: "title" });
  s.addText(bullets.map((b, i) => ({ text: b, options: { bullet: true, breakLine: i < bullets.length - 1, paraSpaceAfter: 8 } })),
    { x: 0.6, y: 1.35, w: 5.3, h: 3.7, fontSize: 16, color: C.text, valign: "top", isTextBox: true, margin: 0 });
  s.addShape(pres.ShapeType.rect, { x: 6.2, y: 1.35, w: 3.2, h: 3.7, fill: { color: C.light }, line: { color: C.light } });
  s.addText(side, { x: 6.4, y: 1.5, w: 2.8, h: 3.4, fontSize: 13, color: C.navy, valign: "top", isTextBox: true, margin: 0 });
}

const t = pres.addSlide({ masterName: "TITLE" });
t.addText("Evaluation Metrics for Natural Language Tasks", { x: 0.7, y: 1.5, w: 8.6, h: 1.3, fontSize: 36, bold: true, color: C.white, isTextBox: true, margin: 0 });
t.addText("Summarization  |  Question Answering  |  Text Generation", { x: 0.7, y: 3.0, w: 8.6, h: 0.5, fontSize: 18, color: "BFD7F0", isTextBox: true, margin: 0 });
t.addText("Master Data & IA, INPT  -  2026", { x: 0.7, y: 4.6, w: 8.6, h: 0.4, fontSize: 14, color: "BFD7F0", isTextBox: true, margin: 0 });

content("Summarization: ROUGE and BERTScore",
  ["ROUGE-1/2: overlap of unigrams/bigrams with the reference", "ROUGE-L: longest common subsequence", "BERTScore: cosine similarity of contextual embeddings", "Also: factual consistency (SummaC) and human judgment"],
  "ROUGE-N recall =\nmatched n-grams / n-grams in reference\n\nF1 = 2PR / (P + R)\n\nPython: rouge-score, bert-score");
content("Summarization: limits",
  ["Paraphrases get a low ROUGE although they are correct", "A hallucinated summary can keep a high ROUGE", "References are subjective: several valid summaries exist", "Combine overlap, semantic and factuality metrics"],
  "Demo (summarization_eval.py)\n\nextractive: high ROUGE\nparaphrase: low ROUGE, good BERTScore\nhallucination: high ROUGE, wrong facts");
content("Question Answering: EM and F1",
  ["Exact Match: 1 if the normalized answer equals the gold answer", "Token F1: partial credit from precision and recall", "Open-domain QA adds retrieval: Recall@k and MRR", "Multiple choice: accuracy"],
  "Normalization: lowercase, remove punctuation and articles\n\nMRR = mean(1 / rank of first correct document)\n\nDemo (qa_eval.py):\n\"the eiffel tower in Paris\"\nEM = 0, F1 = 0.67");
content("Question Answering: limits",
  ["EM is very strict: valid paraphrases score 0", "F1 ignores meaning, only counts shared tokens", "Long generative answers: BERTScore or LLM-as-judge", "Check faithfulness to the source for RAG systems"],
  "Rule of thumb\n\nShort span answers: EM + F1\nRetrieval step: Recall@k, MRR\nFree-form answers: semantic metric + judge");
content("Text Generation: intrinsic and diversity metrics",
  ["Perplexity: how surprised the model is by a text (lower is better)", "distinct-n: share of unique n-grams", "Self-BLEU: similarity between outputs (higher = less diverse)", "MAUVE: closeness to the human text distribution"],
  "PPL = exp( -1/N * sum log p(w_i | w_<i) )\n\nDemo (generation_eval.py):\nrepetitive outputs -> low distinct-n, high Self-BLEU");
content("Text Generation: limits",
  ["No single reference: BLEU and ROUGE do not fit open generation", "Low perplexity does not mean good or true text", "Human evaluation: fluency, coherence, relevance, factuality", "LLM-as-judge is scalable but biased: calibrate it", "Safety checks: toxicity and bias"],
  "Best practice\n\nAutomatic metrics for speed,\nhuman or LLM judges for quality,\nalways report several metrics.");

const cmp = pres.addSlide({ masterName: "CONTENT" });
cmp.addText("Comparison of the three tasks", { placeholder: "title" });
const H = (x) => ({ text: x, options: { bold: true, color: C.white, fill: { color: C.navy } } });
cmp.addTable([
  [H("Task"), H("Main metrics"), H("Main limitation")],
  ["Summarization", "ROUGE, BERTScore", "Ignores factuality"],
  ["Question answering", "EM, F1, Recall@k, MRR", "Penalizes paraphrases"],
  ["Text generation", "Perplexity, distinct-n, MAUVE", "No single reference"],
], { x: 0.6, y: 1.4, w: 8.8, colW: [2.4, 3.4, 3.0], fontSize: 15, color: C.text, border: { type: "solid", color: "C9D6E3", pt: 1 }, rowH: 0.6 });

const e = pres.addSlide({ masterName: "CONTENT" });
e.addText("Conclusion", { placeholder: "title" });
e.addText([
  { text: "Generative tasks need more than one metric", options: { bullet: true, breakLine: true, paraSpaceAfter: 10 } },
  { text: "Overlap metrics are cheap but blind to meaning and facts", options: { bullet: true, breakLine: true, paraSpaceAfter: 10 } },
  { text: "Semantic metrics, LLM judges and humans complete the picture", options: { bullet: true, breakLine: true, paraSpaceAfter: 10 } },
  { text: "Code and README: see the GitHub repository", options: { bullet: true } },
], { x: 0.6, y: 1.5, w: 8.8, h: 3, fontSize: 20, color: C.text, valign: "top", isTextBox: true, margin: 0 });

pres.writeFile({ fileName: "NLP_Evaluation_Metrics.pptx" }).then(() => console.log("ok"));
