Page 30

Baseline Details. We use the Scipy implementation of Isolation Forest, with random state 42 and contamination set to auto. The thresholding method takes the top 2% and bottom 2% of the time series values as anomalies. This is close to the ground truth anomaly ratio of 3 ∼ 4% .

Discussions. Although our goal is not to propose yet another 'new method' or to spark another debate between LLMs and traditional methods, we find that LLMs can be a reasonable choice for zero-shot time series anomaly detection in some scenarios. As suggested by Audibert et al. (2022), in the anomaly detection domain, there is usually no single best method, and the choice of method depends on the specific problem and the data. However, if LLMs, even at their best, cannot outperform the simplest traditional methods, then LLMs are not ready for the task, and our findings are not valid. This observation serves as a sanity check for our study, and we pass it. According to the experiments, LLMs with proper prompts and visual input outperform traditional methods on point, range, and trend datasets, as seen in Figure 10. We note that Gemini-1.5-flash typically has the best performance among our models. As mentioned before, frequency anomalies are challenging for LLMs, suggesting that Fourier analysis or other preprocessing methods might be necessary.

## Observation 9 on Optimal Text Representation

Across all text representation methods, no single method consistently outperforms the others.

Figure 11: Comparing text representations, CSV/PaP/TPD/Default

<!-- image -->

Previous works on LLM-based time series analysis typically use a single, so-called 'best' prompt. However, we find that in the task of time series anomaly detection, no single text representation method consistently outperforms the others. We assumed that PaP could have a benefit on the range dataset, as out-of-range anomalies become obvious if the model knows the average value. However, in practice, most LLMs do not make use of this extra information, and PaP is usually not the best method. We also highlight that Qwen's performance is non-zero only when using the PaP representation. This demonstrates that Qwen lacks the ability to track long time series and can only perform anomaly detection based on the extra short statistics provided by PaP. Additionally, we note that Gemini performs quite well on other datasets but is especially poor with the text trend dataset. This again demonstrates the modelspecific capabilities of LLMs.

## D FULL EXPERIMENT RESULTS

Table 2: Trend anomalies in shifting sine wave