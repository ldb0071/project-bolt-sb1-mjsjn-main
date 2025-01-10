Page 26

| Metrics   |   YAHOO |    ECG |   SVDB |   IOPS |
|-----------|---------|--------|--------|--------|
| Precision |  0.0127 | 0.2654 | 0.3024 | 0.088  |
| Recall    |  0.052  | 0.3225 | 0.2408 | 0.1214 |

| Dataset   | F-score           | Range-F           |
|-----------|-------------------|-------------------|
| YAHOO     | 0.0440( ↑ 0.0236) | 0.1027( ↑ 0.0091) |
| ECG       | 0.1537( ↓ 0.1374) | 0.1736( ↓ 0.1522) |
| SVDB      | 0.1683( ↓ 0.0998) | 0.1850( ↓ 0.1002) |
| IOPS      | 0.0161( ↓ 0.0859) | 0.0245( ↓ 0.1169) |

indicating a model propensity to identify a broader array of potential anomalies, albeit with lower precision. Conversely, for the SVDB dataset, precision surpasses recall, suggesting a more selective approach by the model in flagging anomalies. This phenomenon may be attributed to the anomaly composition within the datasets, as elaborated in Table 7 found in Appendix A.1. Specifically, SVDB exhibits a higher ratio of anomalous points. The distribution of the precision and recall over the four datasets is are shown in Figure 20.

More Examples for the Explanation on Different Datasets Figure 18 shows additional examples of explanations provided by GPT-4 on different datasets. We observe that for the ECG and SVDB datasets, GPT-4 struggles to accurately interpret the ECG signals, occasionally mistaking normal spike and dip patterns for anomalies. However, when the changes are obvious, GPT-4 is able to detect such pattern changes. The issues with the YAHOO and IOPS datasets arise when GPT-4 hallucinates in terms of direction, indexes, or change values.

More analysis for the hallucination in indices Figure 21 illustrates the distribution of hallucinations in indices across the four datasets. In each figure, the left part shows the distribution of the number of hallucination indices within the time series segments where GPT-4 hallucinated in the identified anomalous indices. The right part displays the distribution of the number of hallucination points across all 100 segments for each dataset. The results indicate that GPT-4 does not hallucinate in indices in most time series segments; however, when the model does hallucinate, the number of hallucination points tends to be large.

Subsequently, we evaluate the model's performance after excluding segments with hallucinations, with the results detailed in Table 9. Ideally, one would expect an improvement in performance after removing these affected segments. Surprisingly, except for the YAHOO dataset, the remaining three datasets exhibited a notable decrease in performance. This suggests a tendency for the model to hallucinate more frequently in segments with a higher proportion of anomalies. Moreover, it indicates that, for these segments, the model attempts to identify additional positions, even though some may not align with the actual segments.

Table 10: Evaluation Metrics for GPT-4 on Synthesized Dataset

|   Timeseries Length | Anomaly Type     |   F-score |   Range-F |   Precision |   Recall |
|---------------------|------------------|-----------|-----------|-------------|----------|
|                 100 | Context Seasonal |    0.2351 |    0.318  |      0.3992 |   0.1667 |
|                 100 | Context Shape    |    0.1993 |    0.314  |      0.1601 |   0.2638 |
|                 100 | Context Trend    |    0.2688 |    0.4232 |      0.1675 |   0.68   |
|                 100 | Point Global     |    0.4576 |    0.7    |      0.4426 |   0.4737 |
|                 100 | Point Local      |    0.3934 |    0.623  |      0.4068 |   0.381  |
|                 200 | Context Seasonal |    0.1524 |    0.1992 |      0.248  |   0.11   |
|                 200 | Context Shape    |    0.0869 |    0.1624 |      0.0616 |   0.1473 |
|                 200 | Context Trend    |    0.1263 |    0.246  |      0.0944 |   0.1909 |
|                 200 | Point Global     |    0.2362 |    0.4531 |      0.2381 |   0.2344 |
|                 200 | Point Local      |    0.1477 |    0.3399 |      0.1294 |   0.1719 |
|                 400 | Context Seasonal |    0.2444 |    0.2757 |      0.4332 |   0.1702 |
|                 400 | Context Shape    |    0.3202 |    0.3509 |      0.2226 |   0.5703 |
|                 400 | Context Trend    |    0.1305 |    0.1676 |      0.0826 |   0.3101 |
|                 400 | Point Global     |    0.2    |    0.26   |      0.2564 |   0.1639 |
|                 400 | Point Local      |    0.0656 |    0.1475 |      0.0784 |   0.0563 |

Performance on Synthesized Dataset We further evaluate GPT-4 on our synthesized dataset with different time series anomaly types and time series lengths, the results for F-score, Range-F, precision, and recall can be found in Table 10.

We observe that, generally, GPT-4 performs better on point-aware anomalies than on context-aware anomalies. Additionally, the overall performance decreases as the time series length increases. Comparing global point anomalies and local point anomalies, GPT-4 performs better on global point anomalies, which is consistent to the results on trial cases. Within context-aware anomalies, when the time series length is short, GPT-4 has more difficulty identifying shape anomalies compared to the other two types of context-aware anomalies. However, as the time series length increases, the shape anomalies become more apparent, allowing GPT-4 to perform better on these anomalies.

Table 11: Hallucination statistics for each time series length by GPT-4Table 12: Hallucination statistics for each anomaly type by GPT-4

|   Time Series Length |   Sum of Count |   Average of Mean |   Average of Median |
|----------------------|----------------|-------------------|---------------------|
|                  100 |             11 |           1.46667 |                 1.2 |
|                  200 |             18 |          41.8967  |                44.5 |
|                  400 |             35 |         145.203   |               143   |