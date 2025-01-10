Page 14

If the hypothesis were true, we would expect that injecting noise would cause a much larger drop in text performance (since the tokens are no longer repeating) than in vision performance. However, the performance drop is similar across both modalities, as shown in Figure 4, and the text performance drop is often not significant. This suggests that the LLMs' ability to recognize textual frequency anomalies has other roots than their token repetitive bias.

## Rejected Hypothesis 3 on Arithmetic Reasoning

The LLM's understanding of time series is not related to its ability to perform arithmetic calculations.

Figure 4: Clean/Noisy, Top 3 AffiF1 variants per noise level

<!-- image -->

We designed an in-context learning scenario where the LLMs' accuracy for five-digit integer addition drops to 12%. The details can be found in Appendix A.4 and A.5. Despite this, the LLMs' anomaly detection performance remains mostly consistent, as shown in Figure 5. This suggests that the LLMs' anomaly detection capabilities are not directly tied to their arithmetic abilities.

## Retained Hypothesis 4 on Visual Reasoning

Time series anomalies are better detected by M-LLMs as images than by LLMs as text.

Across a variety of models and anomaly types, M-LLMs are much more capable of finding anomalies from visualized time series than textual time series, see Figure 6. The only exception is when detecting frequency anomalies with proprietary models. This aligns with human preference for visual inspection of time series data.