Page 12

Here are some basic knowledge about the time series anomalies: Generally, anomalies in time series can be either point-based anomalies or context-aware anomalies, where point-based anomalies are points have significant larger or lower values than other points, context-aware anomalies could be shifts in trend, or changing in base patterns.

Think to solve the problem step by step.

First, try identify whether there are anomalies in the input.

Second, if anomalies are identified, try to get it's index according to it's position in the list.

Third, explain why those points should be considered as anomalies.

for i in range(n):

Example { i }: For time series { Example Time Series

}

First, there are { Anomaly Type } in this time series.

Second, the values at positions { Example Time Series Anomaly Indices } are anomalies.

The reason is { Ideal Explanation for the Time Series Anomalies }.

Figure 5: Full Instruction Prompt for Each Strategy. For in-context learning and chain-of-thought learning, either the general instruction or multi-modal instruction is added to the beginning of the prompt to guide LLMs in performing the anomaly detection task.