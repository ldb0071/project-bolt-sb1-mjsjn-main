Page 8

## Hypothesis 3 (Gruver et al., 2023) on Arithmetic Reasoning

LLMs' ability to perform addition and multiplication (Yuan et al., 2023) maps onto extrapolating linear and exponential trends.

This hypothesis suggests a connection between LLMs' arithmetic capabilities and their ability to extrapolate simple mathematical sequences. It is argued that LLM's proficiency in basic arithmetic operations, such as addition and multiplication, enables it to extend patterns like linear sequences (e.g., x ( t ) = 2 t ) by iteratively applying the addition operation (e.g., +2 ). To validate the hypothesis, we design an experiment where an LLM is specifically guided to impair its arithmetic abilities while preserving its other linguistic and reasoning capabilities . If the hypothesis holds, we should observe a corresponding decline in the model's ability to predict anomalies in the trend datasets. Otherwise, LLMs rely on alternative mechanisms for time series pattern recognition and extrapolation.

## Hypothesis 4 on Visual Reasoning

Time series anomalies can be more easily detected as visual input rather than text input.

Motivated by the fact that human analysts often rely on visual representations for anomaly detection in time series, we hypothesize that M-LLMs, whose training data includes human expert detection tasks, may prefer visualized time series to raw numerical data. This hypothesis can be readily tested by comparing the performance of multimodal LLMs on identical time series presented as both text and visualizations. A significant performance gap would suggest LLMs, like humans, prefer to understand time series data visually.

## Hypothesis 5 on Visual Perception Bias

LLMs' understanding of anomalies is consistent with human visual perception.

We hypotheses based on the growing interest in using LLMs for time series due to their internal human-like knowledge (Jin et al., 2024b) and their demonstrated ability to align with human cognition in complex tasks (Thomas et al., 2024). However, humans have known cognitive limitations in detecting certain types of anomalies, and recent research suggests that LLMs may exhibit humanlike cognitive biases (Opedal et al., 2024).