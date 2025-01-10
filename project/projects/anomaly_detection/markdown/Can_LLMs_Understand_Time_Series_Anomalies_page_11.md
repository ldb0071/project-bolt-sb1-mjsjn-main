Page 11

## 5 EXPERIMENT

## 5.1 EXPERIMENT SETUP

Models. We perform experiments using four state-of-the-art M-LLMs, two of which are opensourced: Qwen-VL-Chat (Bai et al., 2023) and InternVL2-Llama3-76B (Chen et al., 2024), and two of which are proprietary: GPT-4o-mini (OpenAI, 2024) and Gemini-1.5-Flash (Google, 2024).

Figure 3: Example anomaly detection results for out-of-range anomalies. Direct thresholding with expert knowledge yields the best result, but the LLMs can also detect the approximate ranges without priors. Isolation Forest raises lots of false positives but still has a higher F1 than LLMs, which motivates the use of affinity F1.

<!-- image -->

The language part of the models covers four LLM architectures: Qwen , LLaMA , Gemini , and GPT . Since we send the text queries to M-LLMs instead of their text component, we validated via MMLU-Pro (Wang et al., 2024) that adding a vision modality does not reduce the model's performance on text tasks. The validation details can be found in Appendix A.1. We have 21 prompting variants for each model, with 13 for text and 8 for vision. In controlled experiments, for each model, we report the specific variants or the top 3 variants with the highest scores under the condition. We label the variants with the name codes in Table 1, with details in Appendix A.4.

Datasets. We synthesize four main datasets corresponding to different anomaly types in Section 3.2: point, range, frequency, and trend. We add noisy versions of point, frequency, and trend to test Hypothesis 2. We add an acceleration-only version of the trend dataset to test Hypothesis 5. Further details on the datasets can be found in Appendix B.

Metrics. The LLMs generate anomaly periods that can be converted to binary labels and do not output anomaly scores. Therefore, we report precision, recall, and F1-score metrics. However,

Table 1: Variants and their corresponding namecodes