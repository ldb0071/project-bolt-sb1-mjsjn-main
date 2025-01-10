Page 3

One reason for using deep learning models in time series anomaly detection is their ability to bring prior knowledge on what constitutes normal behavior from pretraining on large-scale datasets. Large language models (LLMs) may offer a promising solution due to their strong zero-shot capabilities. However, there is currently a lack of research exploring the application of modern (M-)LLMs to time series anomaly detection, presenting an opportunity for investigation in this area.

Multimodal LLMs (M-LLMs). The multimodal capabilities of LLMs have been explored in various domains, including image captioning, video understanding, and multimodal translation (Lu et al., 2019; Li et al., 2019; Sun et al., 2019; Huang et al., 2019). Recent advancements have led to more sophisticated M-LLMs, such as Qwen-VL and Phi-3-Vision, demonstrating superior performance in visual-centric tasks and compact deployment capabilities (Bai et al., 2023; Abdin et al., 2024). In the context of time series analysis, M-LLMs have been used to model multimodal data, such as time series and textual information, showing promising results in forecasting and anomaly detection (Liu et al., 2021). However, there is a notable lack of application of M-LLMs to time series as visual inputs, even though humans often detect time series anomalies through visual inspection. This gap is particularly significant given that time series data can be represented in multiple modalities (e.g., numerical, textual, or visual) without losing substantial new information. Consequently, time series analysis presents a unique opportunity to evaluate an M-LLM's ability to understand and process the same underlying data across different representational formats. The potential for MLLMs to bridge the gap between human visual intuition and machine learning in time series analysis represents a promising avenue for future research.

## 3 TIME SERIES ANOMALY DETECTION: DEFINITION AND CATEGORIZATION

We begin by defining time series anomaly detection and categorizing different anomalies.

## 3.1 TIME SERIES ANOMALY DETECTION DEFINITION

Weconsider time series X := { x 1 , x 2 , . . . , x T } collected at regular intervals, where x t is the feature scalar or vector at time t , and T is the total number of time points. Anomalies are data points that deviate significantly from the expected pattern of the time series and can be defined by the generating function or conditional probability, depending on whether the system is deterministic or stochastic.

Generating function. Assume the time series generation is deterministic. A data point x t is considered an anomaly if it deviates much from the value predicted by the generating function, i.e.,

| x t -G ( x t | x t -1 , x t -2 , . . . , x t -n ) | > δ (1)

Conditional probability. Assume the time series generation is governed by a history-dependent stochastic process. A data point x t is considered an anomaly if its conditional probability is below a certain threshold ϵ , i.e.,