Page 27

Tables 11 and 12 present the statistics of hallucinations in indices on the synthetic dataset for different time series lengths and different types of time series anomalies.

| Anomaly Type   |   Sum of Count |   Average of Mean |   Average of Median |
|----------------|----------------|-------------------|---------------------|
| Seasonal       |             12 |          85.8333  |            71.6667  |
| Shape          |             17 |         142.87    |           170.833   |
| Trend          |             15 |          83.339   |            69.6667  |
| Global Point   |             10 |           1.19048 |             1.33333 |
| Local Point    |             10 |           1.04167 |             1       |

From the perspective of time series length, we observe that hallucinations in indices become more significant as the time series length increases. The average number of hallucination points is small for shorter time series, with fewer than 2 points for datasets with a length of 100. However, for datasets with a length of 400, the problem becomes more severe, with the average number of hallucination points increasing to around 150.

From the perspective of anomaly type, GPT-4 tends to hallucinate more on context-aware anomalies, while it rarely hallucinates indices for global point and local point anomalies. Among the contextaware anomalies, GPT-4 is more prone to hallucinating indices in shape anomalies compared to the other two types of context-aware anomalies.

## B.3 More results on LLaMA3

Experiments on Benchmark Datasets Due to the very limited context window of 8K tokens in LLaMA3, we attempted evaluation on LLaMA3 using four benchmark datasets. However, for the ECG and SVDB datasets, which contain about 30% anomalies, LLaMA3 often failed to provide complete responses in many trials. As a result, we have not included the results for these four datasets in the main context. On the other hand, for the YAHOO dataset, the model was able to provide more complete responses. Therefore, we report the results for the YAHOO dataset in table 13. We observe that after fine-tuning, LLaMA3 slightly outperforms GPT-4 on the YAHOO dataset.

Table 13: LLaMA3's performance on YAHOO dataset.

| Metrics    |   F-score |   Range-F |   Precision |   Recall |
|------------|-----------|-----------|-------------|----------|
| Original   |    0.0181 |    0.108  |      0.0096 |   0.1651 |
| Fine-tuned |    0.0397 |    0.1121 |      0.0419 |   0.0377 |

More results on the Hallucination in Indices Table 14 presents the details of hallucinated indices across different anomaly types for both the original LLaMA3 and the fine-tuned LLaMA3 models. Generally, the number of hallucinated indices is lower for point-aware anomalies. However, compared

Table 14: Statistics of the hallucinated indices of LLaMA3 by Anomaly Type

| Anomaly Type   | Original LLaMA3   | Original LLaMA3   | Original LLaMA3   | Fine-tuned LLaMA3   | Fine-tuned LLaMA3   | Fine-tuned LLaMA3   |
|----------------|-------------------|-------------------|-------------------|---------------------|---------------------|---------------------|
|                | # Segments        | Mean              | Median            | # Segments          | Mean                | Median              |
| Global Point   | 38                | 204.1             | 103.3             | 23                  | 156.6               | 152.5               |
| Local Point    | 38                | 211.2             | 58.7              | 24                  | 140.9               | 99.0                |
| Seasonal       | 43                | 216.3             | 106.7             | 25                  | 170.2               | 147.7               |
| Shape          | 44                | 200.9             | 123.8             | 29                  | 240.3               | 257.7               |
| Trend          | 34                | 259.9             | 155.7             | 21                  | 222.7               | 194.3               |

to GPT-4, LLaMA3 exhibits a significantly higher number of hallucinated indices for point-aware anomalies. Additionally, we observe a decrease in the number of hallucinated segments after finetuning.

For the performance under different instruction dataset settings We evaluate the impact of sample size for fine-tuning on an instruction dataset with 100, 500, 1000, and 2000 samples. Interestingly, fine-tuning with 2000 samples generally results in worse performance compared to using fewer samples. In some cases, fine-tuning with 500 samples outperforms models fine-tuned with more data. Overall, fine-tuning with 1000 samples yields the best performance in most cases, so we use this sample size by default for our fine-tuning process. Regarding the time series length for fine-tuning, we find that fine-tuning on varying lengths (i.e., for each sample, randomly selecting the time series length in the range of 180, 360, and 720) consistently provides the best performance across different settings. Another observation is that when we fine-tune our models on datasets with time series lengths of 180, 360, and 720, and evaluate them on time series lengths of 100, 200, and 400, the reduction in hallucinated indices as the time series length decreases may be due to the fact that the evaluation lengths are closer to the lengths used during fine-tuning. For each sample, we use different instruction prompt strategies, including general instruction (direct use), multi-modal instruction, in-context learning, and chain-of-thought prompting. Our trials show that LLaMA3 does not significantly benefit from prompt engineering. This is also observed during the fine-tuning stages, where performance worsens with in-context or chain-of-thought prompt strategies. Consequently, we opt to use general instruction for both fine-tuning and inference.

Summary Generally, GPT-4 performs better than LLaMA3 in most cases, although LLaMA3 sometimes achieves better performance after fine-tuning. Based on our manual review of the explanations provided by both models, GPT-4 offers more specific and accurate, or nearly accurate, descriptions compared to LLaMA3. We attribute this superiority to GPT-4's larger parameter scale, more diverse training datasets, and longer context window. Nevertheless, both models demonstrate great potential as effective time series anomaly detectors with explanations.

## C Related Works for Time Series Anomaly Detection

Traditional methods for detecting anomalies in time series data can be broadly categorized into several approaches. Prediction-based methods are the most prevalent, involving the training of a robust time series forecasting model, such as Prophet [Taylor and Letham, 2018] or the more recent transformer-based models like Informer [Zhou et al., 2021]. Anomalies are identified as points exhibiting significant deviations from forecasted values. Clustering-based approaches, exemplified by Isolation Forest (IForest) [Liu et al., 2008], utilize binary tree structures based on space partitioning, where nodes closer to the root are more likely to be anomalies. Pattern-matching approaches, such as Matrix Profile (MP) [Yeh et al., 2016], detect anomalies as subsequences with notably large nearestneighbor distances. Reconstruction-based approaches, represented by Autoencoders [Sakurada and Yairi, 2014], learn to reconstruct data, flagging as outliers those points that significantly diverge from the reconstructed values. The primary issue is that while most of them excel at capturing specific types of anomalies, they are also difficult to explain in terms of their detection results.

## D Limitation and Future Work

Although we have observed that GPT-4 can deliver good performance with minimal instructions, its current lack of public fine-tuning capabilities on GPT-4 prevents us from exploring whether fine-tuning on GPT-4 could achieve state-of-the-art (SOTA) performance. We are in the process

of applying for access to the fine-tuning API for GPT-4 at the time of this submission. Therefore, in future work, we will explore the fine-tuning performance of GPT-4 if we gain access to this functionality. Another limitation is that, while different approaches for representing time series in large language models (LLMs), such as images and embeddings, have been observed, we consider representing time series as pure text tokens in this research. One reason is based on our preliminary studies on GPT-4 with representing the time series as images only, we found that, although GPT-4 can grasp the overall shape of the time series, it experiences significantly more hallucinations in the indexes compared to representing the time series as pure tokens. Beyond the issue of hallucination in the indexes, another reason we avoided using embeddings and images to represent time series is the necessity for accurate identification and explanation of all anomaly points in time series anomaly detection tasks, where the accurate knowledge of the position and value of each time series point is essential. Another advantage of representing the time series as pure tokens is that it eliminates the need for data preprocessing, making it easier to integrate time series with textual prompts, thereby fully leveraging the LLMs' capabilities in handling tokens. While we have not explored representing time series as embeddings or images in this research, we plan to conduct further analysis in this area to gain broader insights into using LLMs for time series anomaly detection tasks.