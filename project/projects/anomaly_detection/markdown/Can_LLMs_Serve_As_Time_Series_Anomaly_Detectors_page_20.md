Page 20

## A.6 LLMSettings

For both models, we employ a rerun strategy: if the model fails to provide the required JSONformatted response, we automatically rerun the code until the response adheres to the specified format. If the model fails more than five trials, we return the default response as { anomaly : [], reason : ""}.

## Global Point Anomaly

Directly Use (Correct) Yes, there is at least one anomaly point in the time series. The index of the anomaly point is 11. Reasoning behind the anomaly: The value 5 at index 11 is considered an anomaly because it is significantly different from the rest of the values in the series. The majority of the values in the series are either 1 or 2, with a few occurrences of 1 and 2. The value 5 is significantly higher than the other values and does not follow the pattern of the series.

Multi-modal Instruction (Correct) Presence of anomaly points: Yes. Indices of anomaly points: 11 (index 11 corresponds to the value 5). Reasoning: The value 5 at index 11 is significantly higher than the rest of the values in the series, which are mostly in the range of 1 and 2. This outlier value stands out as an anomaly due to its unusual magnitude and deviation from the overall pattern of the series.

Multi-modal Instruction (Incorrect) Yes, there are several anomaly points in this time series. The indices of the anomaly points are: Index 11 (value: 5): This value is significantly higher than the surrounding values, which are mostly in the range of 1-2. The sudden jump to 5 is unusual and may indicate an anomaly. Index 20 (value: 2): This value is higher than the surrounding values, which are mostly 1. The sudden increase in value may indicate an anomaly.

## Local Point Anomaly

Directly Use (Incorrect) : Presence of anomaly points: Yes. Indices of anomaly points: 4, 12. Reasoning behind these points being considered anomalies: - Index 4: The value 5 has a Z-score of 1.29, which is greater than 2 standard deviations away from the mean. This indicates that this data point is an anomaly. - Index 12: The value 5 has a Z-score of 1.29, which is greater than 2 standard deviations away from the mean. This indicates that this data point is an anomaly.

In-context Instruction (Incorrect) Yes, there are several anomaly points in this time series. The indices of the anomaly points are: Index 9 (value: 3): This value is different from the surrounding values, which are mostly increasing. The sudden decrease in value may indicate an anomaly. Index 10 (value: 3): This value is the same as the previous value, which is unusual in a time series that is generally increasing. Index 17 (value: 2): This value is significantly lower than the surrounding values, which are mostly increasing. The sudden decrease in value may indicate an anomaly.

## Seasonality Anomaly

Directly Use (Incorrect) : Yes, there are anomalies in the time series. Indices of anomaly points: Index 0: The value 1 is an anomaly because it's significantly lower than the previous value (0) and the overall trend of the series. Index 14: The value 5 is an anomaly because it's significantly higher than the previous value (1) and the overall trend of the series. Index 17: The value 5 is an anomaly because it's significantly higher than the previous value (1) and the overall trend of the series.

Chain-of-thought Instruction (Incorrect) Yes, there are anomaly points in this time series. The anomaly points are at indices [12] and [17]. Reasoning behind these points being considered anomalies: The values at indices [12] and [17] are 5, which is significantly higher than the previous and subsequent values. The time series has a cyclical pattern with decreasing values, and the sudden increase at indices [12] and [17] breaks this pattern, making them anomalies.