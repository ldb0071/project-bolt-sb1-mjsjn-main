Page 20

CoT Stands for Chain of Thought, see Section 4.2.1.

Zero-shot CoT / One-shot CoT The zero-shot CoT variant follows the same mechanism as in Kojima et al. (2023), which involves simply adding 'Let's think step by step' to the original prompt. The JSON part is extracted from the output. The 1-shot CoT variant (Wei et al., 2022) involves writing a template anomaly detection answer for each dataset, e.g.,

To detect anomalies in the provided time series data, we can look for sudden changes or outliers in the time series pattern. Based on the general pattern, the normal data is a periodic sine wave between -1 and 1. The following ranges of anomalies can be identified:

[{"start": 171, "end": 178}]

During those periods, the data appears to become noisy and unpredictable, deviating from the normal periodic pattern.

PaP Stands for Prompt-as-Prefix, see section 4.2.1.

TpD Stands for Token-per-Digit, see section 4.2.1.

CSV Stands for the Comma-Separated-Values format, see section 4.2.1.

DysCalc Stands for Dyscalculia. The DysCalc variant reduces the model's ability to perform simple arithmetic operations by in-context learning. An example context is as follows: