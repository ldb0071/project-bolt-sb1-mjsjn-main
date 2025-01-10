Page 15

## Rejected Hypothesis 5 on Visual Perception Bias

The LLM's understanding of anomalies is not consistent with human perception.

We create the 'flat trend' dataset where the anomalous trend is too subtle to be visually detected by humans but becomes apparent when computing the moving average of the gradient, as shown in Figure 8. The LLMs' performance is very similar to the regular trend dataset, regardless of the modality. This suggests that the LLMs do not suffer from the same limitations as humans when detecting anomalies.

## Retained Hypothesis 6 on Long Context Bias

LLMs perform worse when the input time series have more tokens.

We observe a consistent improvement in performance when interpolating the time series from 1000 steps to 300 steps, as shown in Figure 7. Notably, the top-3 best-performing text variants in all experiments typically apply such shortening. This underscores the LLM's difficulty in handling long time series, especially since the tokenizer represents each digit as a separate token.

Figure 8: Flat Trend/Trend, Top 3 Affi-F1 variants per dataset

<!-- image -->

## Rejected Hypothesis 7 on Architecture Bias