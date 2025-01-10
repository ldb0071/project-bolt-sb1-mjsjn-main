Page 7

## 4.1 HYPOTHESES

The following hypotheses represent a synthesis of existing literature (1-3), our own insights into LLM behavior (4-5), and prevailing assumptions in the field that warrant closer examination (6-7). The hypotheses cover two main aspects: LLMs' reasoning paths (1, 3, 4) and biases (2, 5, 6, 7).

## Hypothesis 1 (Tan et al., 2024) on CoT Reasoning

LLMs do not benefit from engaging in step-by-step reasoning about time series data.

The authors claim that existing LLM methods, including zero-shot approaches, do very little to use innate reasoning. While they demonstrate that LLM-based methods perform similarly or worse than methods without LLMs in time series tasks, none of their experiments assess the LLMs' reasoning capabilities.

To validate this hypothesis, we focus on the performance of one-shot and zero-shot Chain of Thought (CoT) prompting, which explicitly elicits an LLM's reasoning abilities (Wei et al., 2022). We use terms from cognitive science to describe the LLMs' different behaviors with and without CoT: the reflexive mode (slow, deliberate, and logical) and the reflective mode (fast, intuitive, and emotional) (Lieberman, 2003). Therefore, the question becomes whether the LLMs benefit from the reflexive mode, when it thinks slowly about the time series. If the hypothesis is false, the LLMs should perform better when they are prompted to explain.

## Hypothesis 2 (Gruver et al., 2023) on Repetition Bias

LLMs' repetition bias (Holtzman et al., 2020) corresponds precisely to its ability to identify and extrapolate periodic structure in the time series.

This hypothesis draws a parallel between LLMs' tendency to generate repetitive tokens and their potential ability to recognize periodic patterns in time series data. To validate the hypothesis, we design an experiment where the datasets contain both perfectly periodic and noisy periodic time series. The introduction of minor noise would disrupt the exact repetition of tokens in the input sequence, even if the underlying pattern remains numerically approximately periodic. If the hypothesis holds, we should observe a significant drop in performance, despite the numbers maintaining its fundamental periodic structure.