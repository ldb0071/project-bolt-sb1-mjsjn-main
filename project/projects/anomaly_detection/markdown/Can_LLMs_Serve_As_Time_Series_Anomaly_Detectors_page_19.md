Page 19

## Local Point Anomaly

Directly Use (Incorrect) : No points in the series have a z-score greater than 3 or less than -3. Thus, based on this criterion, there are no anomalies in the data.

Chain-of-thought Instruction (Correct) : Identify Anomalies: The pattern in the series typically increases from 1 to 5 and then decreases back to 1. By visual inspection, one can observe a disruption in the expected decrease after the peak value (5). Indices of Anomaly Points: The expected pattern is disrupted at indices 9 and 10, where the values are [3, 3]. Reasoning for Anomalies: The values of 3 at indices 9 and 10 should be considered anomalies because they disrupt the expected descending sequence that should follow after reaching the peak value of 5. In all other occurrences, after the value sequence reaches 5, it decreases sequentially (5, 4, 3, 2, 1). However, in this instance, the sequence unexpectedly stabilizes at 3 for two consecutive points, thereby breaking the typical cyclical pattern.

## Seasonality Anomaly

Directly Use (Incorrect) : There are no anomalies in the time series as per the z-score threshold of 3.

Multi-modal Instruction (Correct) : The numerical analysis confirms the visual observations. The anomalies in the time series are as follows: Index 17 (Value 5), Index 18 (Value 1), and Index 19 (Value 5). These points are considered anomalies because they show a significant and abrupt change from the established pattern of gradual increases and decreases.

## Trend Anomaly

Directly Use (Incorrect) : The mean of the time series is approximately 5.1, and the standard deviation is about 2.43. Using a threshold of 3 standard deviations from the mean to define anomalies, we did not detect any anomalous points in the series.

In-context Instruction (Correct) : Presence of Anomaly Points: Yes, there are anomaly points in this time series. Indices of Anomaly Points: The anomaly points are located at indices 9, 10, and 11. Reasoning: The points at indices 9, 10, and 11 ([6, 7, 8]) are considered anomalous because they mark a sudden and significant change from the previous cyclic pattern [1, 2, 3, 2, 1, 2, 3, 2, 1]. The magnitude of these points is much higher, indicating an unexpected shift in the time series' behavior.

Figure 16: More examples responses of GPT4 on the trial cases for other anomaly types.

Formalization to Evaluation Dataset We generated three datasets, each containing 100 samples, with time series lengths of 100, 200, and 400, respectively. Each dataset includes 20 samples for each of the following anomaly types: global point anomaly, local point anomaly, seasonality anomaly, trend anomaly, and shape anomaly. This distribution allows us to effectively evaluate model performance across different types of time series anomalies and various time series lengths. Additionally, the evaluation dataset lengths differ from those used to fine-tune LLaMA3 to prevent the model from learning any specific length-related patterns or tricks.

Difference from Lai et al. [2021] Although we have followed the definition of anomaly types from this work, TTGenerator considers more detailed types for the base pattern, including additional trend and seasonality types, as well as more detailed anomaly types. Most importantly, this work did not provide automatic textual descriptions for the time series, which are essential for constructing an instruction dataset.