Page 9

To validate this hypothesis, we leverage findings from human perception research, such as the observation that humans are far less sensitive to acceleration than to constant speed changes (Mueller & Timney, 2016). We compare LLM performance on two datasets: one featuring anomalies that revert an increasing trend to a decreasing trend (analogous to negating constant speed), and another with anomalies that accelerate an increasing trend. Both datasets would have similar prevalence rates, making them equally detectable by traditional methods that identify gradient changes. If LLMs exhibit significantly poorer performance in detecting acceleration anomalies compared to trend reversals, it would suggest that they indeed suffer from similar perceptual limitations as humans.

## Hypothesis 6 on Long Context Bias

LLMs perform better with time series with fewer tokens, even if there is information loss.

Despite recent advancements in handling long sequences, LLMs still struggle with complex, realworld tasks involving extended inputs (Li et al., 2024). This limitation may also apply to time series analysis. To test this hypothesis, we propose an experiment comparing LLM performance on original time series text and pooled textual representations (reduced size by interpolation). If the hypothesis holds, we should observe performance improvement with the subsampled text.

## Hypothesis 7 on Architecture Bias

LLMs' time series understanding are consistent across different model architectures.

This hypothesis stems from the tendency in recent literature (Tang et al., 2024; Tan et al., 2024; Zeng et al., 2022) to generalize findings about time series understanding across all LLMs based on exper-

iments with a limited set of models, typically GPT and LLaMA variants. This approach implies that different model families' comprehension of time series data is universally consistent, varying primarily with the number of parameters. However, unlike in NLP tasks where specific models excel in areas like translation or mathematics (Cobbe et al., 2021), there's a lack of understanding regarding specialized skills in time series analysis across different LLM architectures. To test this hypothesis, we perform all previous experiments across different LLM architectures. If the hypothesis holds, we should see previous conclusions either consistently validated or invalidated across all models.

## 4.2 PROMPTING STRATEGIES