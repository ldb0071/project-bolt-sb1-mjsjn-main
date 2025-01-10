Page 10

Weincorporate two main prompting techniques in our investigation: Zero-Shot and Few-Shot Learning (FSL) and Chain of Thought (CoT) For FSL, we examine the LLM's ability to detect anomalies without any examples (zero-shot) and with a small number of labeled examples (few-shot). For CoT, we implement example in-context CoT templates, guiding the LLM through a step-by-step reasoning process. Our template prompts the LLM to: (1) Recognize and describe the general time series pattern (e.g., periodic waves, increasing trend) (2) Identify deviations from this pattern (3) Determine if these deviations constitute anomalies based on the dataset's normal behaviors.

## 4.2.1 INPUT REPRESENTATION

Visual representations of activities can enhance human analysts' ability to detect anomalies (Riveiro & Falkman, 2009), and the pretraining of M-LLM involves detection tasks (Bai et al., 2023). Inspired by these facts, we infer that LLMs' anomaly detection may benefit from visual inputs. Therefore, we explore two primary input modalities for time series data: textual and visual representations.

Textual Representations. We examine several text encoding strategies to enhance the LLM's comprehension of time series data:(1) Original: Raw time series values presented as rounded spaceseparated numbers. (2) CSV: Time series data formatted as CSV (index and value per line, commaseparated), inspired by Jin et al. (2024b). (3) Prompt as Prefix (PAP): Including key statistics of the time series (mean, median, trend) along with the raw data, as suggested by Jin et al. (2024a). (4) Token per Digit (TPD): Splitting floating-point numbers into space-separated digits (e.g., 0.246 → 2 4 6 ) to circumvent the OpenAI tokenizer's default behavior of treating multiple digits as a single token, following Gruver et al. (2023). This strategy only improve the performance of models that apply byte-pair encoding (BPE) tokenization, see Appendix C Observation 7.

Visual Representations. Weutilize Matplotlib to generate visual representations of the time series data. These visualizations are then provided to multimodal LLMs capable of processing image inputs. Since LLMs have demonstrated strong performance on chart understanding tasks (Shi et al., 2024), they are expected to identify anomaly regions' boundaries from the visualized time axis.

## 4.2.2 OUTPUT FORMAT

To ensure consistent and easily interpretable results, we prompt the LLM to provide a structured output in the form of a JSON list containing anomaly ranges, e.g.,

[{"start": 10, "end": 25}, {"start": 310, "end": 320}, ...]

This format allows for straightforward comparison with ground truth anomaly labels and facilitates quantitative evaluation of the LLM's performance. By employing this comprehensive set of evaluations, we draw more robust conclusions about the following hypotheses.