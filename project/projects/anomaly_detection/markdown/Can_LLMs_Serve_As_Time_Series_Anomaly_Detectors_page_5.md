Page 5

Table 2: Details of hallucination of GPT-4 on each dataset. Mean and Median stand for the mean and median numbers of hallucinated points over the hallucinated segments.

| Dataset   |   # Segments |   Mean |   Median |
|-----------|--------------|--------|----------|
| YAHOO     |           24 |  122   |        2 |
| ECG       |           29 |  322.4 |      460 |
| SVDB      |           21 |  283.4 |      260 |
| IOPS      |           28 |  111.5 |        3 |

is more pronounced in datasets such as ECG and SVDB, which have a higher anomaly ratio (about 20% to 30% of segment points), leading to an increase in hallucinated positions.

Explanation Analysis For the explanation provided by GPT-4, we manually analyze the results and classify the explanations into three categories: i) good explanation, where the model provides reasonable reasons for the detection results and correctly identifies the index of the anomalies; ii) bad explanation, where the model fails to explain the detected anomalies well or cannot detect them; and iii) good explanation with hallucination in values, where the model reasonably explains the detected anomalies but incorrectly mentions the index or value of the anomalies. Figure 3 shows examples for the three conditions, and more examples for other datasets can be found in Appendix B.2. Table 3 shows the counts for explanation performance under different conditions. For the YAHOO and IOPS datasets, which exhibit more local and global point anomalies like spikes and dips, GPT-4 generally provides accurate explanations. Poor explanation on the datasets typically occurs when GPT-4 fails to detect anomalies precisely, such as identifying only certain local point anomalies while overlooking significant global ones or missing pattern change anomalies. Occasionally, GPT-4 misinterprets figures, mistaking a dip for a spike, as shown in Figure 3. In contrast, the ECG and SVDB datasets, which contain more context-aware anomalies such as pattern changes, pose greater challenges for GPT-4 in providing accurate explanations. The model often continues to search for local and global point anomalies, sometimes mistakenly identifying periodic spikes in ECG signals as anomalies.

However, when a pattern change is pronounced, GPT-4 can detect the shift and provide a coherent explanation. In general, hallucinations in explanation typically occur when GPT-4 describes the index or values of anomalies. Such errors are more frequent in

Table 3: Summary of the explanation capability of GPT-4 on different datasets.

| Count                            |   YAHOO |   ECG |   SVDB |   IOPS |
|----------------------------------|---------|-------|--------|--------|
| Good Explanation                 |      25 |    26 |      9 |     25 |
| Good Explanation w Hallucination |      24 |     5 |      3 |     35 |

Figure 3: Examples for a) good, b) bad, and c) hallucinated explanation by GPT-4 on IOPS dataset.

<!-- image -->

These indexes show a sudden and significant increase in the values, breaking the general trend of the series. This spike is distinct from the rest of the data.

<!-- image -->

(a) Good