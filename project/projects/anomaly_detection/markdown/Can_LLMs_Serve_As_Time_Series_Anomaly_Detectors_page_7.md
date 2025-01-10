Page 7

Anomaly Points Generation Following Lai et al. [2021], we examine various types of time series anomalies, including point-wise and pattern-wise anomalies. Point-wise anomalies are defined as unexpected incidents at individual time points:

| x t -ˆ x t | > δ (2)

This includes local point anomalies, where δ = λ · σ ( X [ x -C ≤ x ≤ x + C ] ) with C as the context window size, and global point anomalies, where δ = λ · σ ( X ) , representing significant spikes or dips in the time series. Here, σ denotes the standard deviation and λ sets the threshold level. Pattern-wise anomalies represent anomalous subsequences characterized by changes in seasonality, trend, or shape. Specifically, within a time series data X , an underlying subsequence X i,j from timestamp i to j can be considered anomalous if:

sim ( X i,j , ˆ X i,j ) > δ (3)

This indicates significant deviation from the expected values ˆ X i,j . A seasonality anomaly may occur with an amplitude change (i.e., a modified ˜ A n in s ( T i,j ) ) or a period change (i.e., a modified ˜ ω n in s ( T i,j ) ). Trend anomalies may involve a change point (where trends differ before and after point i , with 1 < i < N ), or a trend break (where the trend changes at i and then reverts at j , with 1 < i < j < N ). Shape change anomalies may manifest as a pattern change (where the base pattern shifts starting at i and continues to j , with 1 < i < N ), or a pattern break (where the base pattern changes at i but returns to normal by j , with 1 < i < j < N ).

Explanation Generation After generating the base time series and the anomalies, we utilize a template to produce a description of the time series. This description includes: (i) details about the base time series such as seasonality, trend, and noise; and (ii) specifics about the anomalies, including the types of anomalies and their starting and ending indices. For time series that do not contain anomalies, the description will state: 'There is no obvious anomaly in this time series" . To enhance the diversity of the dataset, we employ GPT-4 to rewrite the description for each sample.

In summary, TTGenerator synthesizes time series with outliers by (i) selecting random seasonality and trend patterns, (ii) inserting various types of outliers, and (iii) generating descriptions for the time series and the anomalies. More details are provided in Appendix A.5.

## 5.2 Instruction Fine-tuning on LLaMA3

With TTGenerator, we generate the instruction dataset as follows: 1) Random Selection of Length: We randomly select the length of the generated time series from various time series lengths. We do not consider longer time series due to the context window length limitation for the LLMs, such as the 8k token limit for LLaMA3. 2) Sample Generation: We generate a single sample that includes the time series values, labels for the anomalies, and explanations for both the base time series and the anomalies. 3) Text Prompt Formation: We concatenate the information of a time series to form the text prompt to train the model as:

```
Instruction : {instruction} Time Series Values : {time series values} Requirements : {requirements} Response : {JSON format with keys anomaly as the labels for the anomalies and reason
```

as the explanation for the anomalies}

where {instruction} refers to the general instruction and {requirements} specify that the output should be formatted in JSON with anomaly and reason as the two keys. 4) Repetition: Finally, we repeat the procedures 1)-3) n times to create the final dataset, where n is the dataset size. To fine-tune the instruction dataset on LLaMA3, we use a parameter-efficient fine-tuning (PEFT) approach, specifically LoRA [Hu et al., 2021], to obtain the fine-tuned model. More details on the fine-tuning can be found in Appendix A.6.