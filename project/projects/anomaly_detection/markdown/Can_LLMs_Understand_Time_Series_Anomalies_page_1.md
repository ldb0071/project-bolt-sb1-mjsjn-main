Page 1

## CAN LLMS UNDERSTAND TIME SERIES ANOMALIES?

## Zihao Zhou

Dept of Computer Science and Engineering University of California, San Diego La Jolla, CA 92093, USA ziz244@ucsd.edu

## Rose Yu

Dept of Computer Science and Engineering University of California, San Diego La Jolla, CA 92093, USA roseyu@ucsd.edu

## ABSTRACT

Large Language Models (LLMs) have gained popularity in time series forecasting, but their potential for anomaly detection remains largely unexplored. Our study investigates whether LLMs can understand and detect anomalies in time series data, focusing on zero-shot and few-shot scenarios. Inspired by conjectures about LLMs' behavior from time series forecasting research, we formulate key hypotheses about LLMs' capabilities in time series anomaly detection. We design and conduct principled experiments to test each of these hypotheses. Our investigation reveals several surprising findings about LLMs for time series: (1) LLMs understand time series better as images rather than as text, (2) LLMs did not demonstrate enhanced performance when prompted to engage in explicit reasoning about time series analysis. (3) Contrary to common beliefs, LLM's understanding of time series do not stem from their repetition biases or arithmetic abilities. (4) LLMs' behaviors and performance in time series analysis vary significantly across different model architectures . This study provides the first comprehensive analysis of contemporary LLM capabilities in time series anomaly detection. Our results suggest that while LLMs can understand trivial time series anomalies (we have no evidence that they can understand more subtle real-world anomalies), many common conjectures based on their reasoning capabilities do not hold. Our code and data are available at https://github.com/Rose-STL-Lab/AnomLLM/ .

## 1 INTRODUCTION

The remarkable progress in large language models (LLMs) has led to their application in various domains, including time series analysis. Recent studies have demonstrated LLMs' potential as zeroshot and few-shot learners in tasks such as forecasting and classification (Gruver et al., 2023; Liu et al., 2024c). However, the effectiveness of LLMs in time series analysis remains a subject of debate. While some researchers argue that LLMs can leverage their pretrained knowledge to understand time series patterns (Gruver et al., 2023), others suggest that simpler models may outperform LLM-based approaches (Tan et al., 2024).