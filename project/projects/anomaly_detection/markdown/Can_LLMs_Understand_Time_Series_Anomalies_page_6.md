Page 6

Trend Anomalies. Trend anomalies occur when the overall direction or rate of change in a time series deviates significantly from the expected trend. These anomalies are characterized by unexpected changes in the changing rate of the time series. A trend anomaly may manifest as a sudden acceleration, deceleration, or reversal of the established trend. Figure 1(a) shows an example of acceleration. The detection of trend anomalies often involves inspection of the gradient.

Frequency Anomalies. Frequency anomalies occur when the periodic components of a time series deviate from the expected pattern. These anomalies are usually identified by analyzing the frequency domain of the time series, typically using techniques like Fourier transforms. A frequency anomaly is detected when there's a significant shift in the dominant frequencies, see Figure 1(b).

Contextual Point Anomalies. Contextual point anomalies occur when individual data points deviate from the expected pattern of the time series, even while remaining within the overall regular range of values. As shown in Figure 1(c), these points are not extreme outliers but don't fit the local context of the time series. They may violate the smooth continuity of the data, contradict short-term trends, or disrupt established patterns without necessarily exceeding global thresholds.

## 3.3 TIME SERIES FORECASTING VS. ANOMALY DETECTION

As most of the literature on LLM for time series analysis focuses on forecasting, we use the conjectures from these works as a starting point to understand LLMs' behavior in anomaly detection. The

tasks of time series forecasting and anomaly detection share many similarities. By definition, deterministic forecasting of future time steps is about learning the generating function (see Equation 1). Probabilistic forecasting is about learning the conditional probability function (see Equation 2). Therefore, both time series forecasting and anomaly detection rely heavily on extrapolation. In forecasting tasks, models extrapolate past patterns to predict future values, extending the known series into unknown territory. Similarly, anomaly detection involves extrapolating the 'normal' behavior of a time series to identify points that deviate significantly from this expected pattern.

LLMsare trained on a corpus of token sequences, { U 1 , U 2 , . . . , U N } , where U i = { u 1 , u 2 , . . . , u L i } and u j is a token in the vocabulary V . The model learns to autoregressively predict the next token in the sequence given the previous tokens, i.e., P ( u j +1 | u 1 , u 2 , . . . , u j ) . The motivation for applying LLMs to time series forecasting is often their zero-shot extrapolation capabilities (Brown et al., 2020). The autoregressive generation of tokens and time series steps (in Equation 2) are similar, and the LLMs act as an Occam's razor to find the simplest form of G (in Equation 1) (Gruver et al., 2023). This connection suggests that hypotheses made in LLMs for forecasting may also apply to anomaly detection. Many such hypotheses are proposed as possible explanations for the model's behavior without validation from controlled studies, which motivates our investigation.

## 4 UNDERSTANDING LLM'S UNDERSTANDING OF TIME SERIES

To demystify LLMs' anomaly detection capabilities, we take a principled approach by formulating several scientific hypotheses. Then we build an LLM time series anomaly evaluation framework to test each of the hypotheses.