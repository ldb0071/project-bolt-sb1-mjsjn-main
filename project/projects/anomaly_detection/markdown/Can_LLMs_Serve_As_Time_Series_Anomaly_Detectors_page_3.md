Page 3

<!-- image -->

presence of anomalies, and ii) if anomalies are identified, providing the indices for the anomalies and explaining the reasons. We assess the LLMs in terms of their capabilities in detecting five representative types of time series anomalies: global point anomaly, local point anomaly, seasonality anomaly, trend anomaly, and shape anomaly. Detailed descriptions of these anomalies can be found in Section 5.1, and examples of each anomaly type are provided in Appendix A.4.

In Figure 1, the top part illustrates the performance of these LLMs on a short time series with shape anomalies at indices 17, 18, and 19. Unfortunately, after five trials, neither model achieves accurate results. Similar outcomes are observed for other anomaly types, including local point anomalies, seasonality anomalies, and trend anomalies. However, both LLaMA-3 and GPT-4 perform well in detecting global point anomalies. This indicates that LLMs cannot be directly applied to detect most typical time series anomalies.

Upon examining the intermediate reasoning steps of these LLMs, it appears that they involve simplistic methodologies, such as Isolation Forest [Liu et al., 2008] and the z-score technique, as shown in the figure. These approaches make it easier to identify global point anomalies. Unlike GPT-4, which may leverage external tools including Python, LLaMA-3's responses are solely derived from its textual reasoning capabilities. This occasionally results in hallucinated calculations and indices in its responses. Despite this, LLaMA-3 seems to intuitively understand the indices and corresponding values in the time series, particularly in the example shown in the figure, recognizing the significance of indices 4 and 12 for the value 5, even though these are not the actual anomalies.

In summary, the operational logic of these LLMs for time series anomaly detection can be characterized as follows: they first select a suitable anomaly detection strategy, identify the time series sequences within the input, and then construct their responses based on this strategy. However, based on our exploration, we cannot directly apply LLMs for time series anomaly detection, in particular, comprehensive anomaly types in time series.

## 4 How to Make LLMs An Explainable Time Series Anomaly Detector via Prompt Engineering?

## 4.1 Prompting Strategies

Multi-modal Instruction Since LLMs seem to grasp the overall shape of time series, we add prompts to guide the LLMs to also consider the visual representation of the time series for anomaly detection. Refer to the example prompt template in Figure 2.

In-context Learning [Dong et al., 2023] In-context learning is a common prompting approach that includes n -shot examples in the prompts to help LLMs with target tasks. For time series anomaly detection, we include examples of five anomaly types: global point anomalies, local point anomalies, seasonality anomalies, trend anomalies, and shape anomalies, respectively. More details about these types of anomalies can be found in Section 5.1. Figure 2 shows an example of 1-shot in-context learning with an example of global point anomalies. This includes a brief description of the characteristics of global point anomalies, an example time series containing global point anomalies, and an example of the desired explanation for this time series anomaly detection.

Chain-of-thought Prompting [Wei et al., 2022b] Chain-of-thought prompting further guides LLMs to decompose complex questions into detailed intermediate reasoning steps. For time series anomaly detection, humans typically first look at the whole time series to detect whether there are anomalies.

If anomalies are detected, they then examine each anomaly in detail and explain the reasons for being anomalies. We formalize this process into a prompt, as illustrated in Figure 2. The simplest approach is to directly request the model to follow these reasoning steps. Alternatively, we can also add n -shot examples for the reasoning process.

## 4.2 Performance on Trial Examples