Page 5

where n is typically small (e.g., 1-5). In zero-shot anomaly detection, n = 0 , i.e., the model f is expected to identify anomalies without any labeled examples. These scenarios pose significant challenges for deep neural nets and some traditional models that require a lot of training examples.

## 3.2 TIME SERIES ANOMALIES CATEGORIZATION

Time series anomalies can be broadly categorized into two main types: out-of-range anomalies and contextual anomalies (Lai et al., 2024). The contextual anomalies can be further divided into frequency anomalies, trend anomalies, and contextual point anomalies. Each type presents unique characteristics and challenges for detection. By examining how LLMs recognize different types of anomalies, we can demonstrate that our hypotheses about LLMs' understanding of time series data generalize across anomaly types.

## 3.2.1 OUT-OF-RANGE ANOMALIES

Figure 1: Example time series with different anomaly types

<!-- image -->

Out-of-range anomalies are individual data points far from all other data points in the series such that they can be detected even if the time series is shuffled, see Figure 1(d). These anomalies can be identified using non-temporal methods, such as clustering or thresholding.

## 3.2.2 CONTEXTUAL ANOMALIES

Contextual anomalies are data points or consecutive subsequences that deviate from the expected pattern of the time series. These anomalies are only detectable when the order of the time series is preserved. Contextual anomalies can be further divided into three subcategories: