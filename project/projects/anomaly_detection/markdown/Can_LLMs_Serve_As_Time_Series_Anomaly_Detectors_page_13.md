Page 13

prompts are shown in Figure 7. Note that the range of n for in-context learning is 1-5, and for chain-of-thought learning is 0-5.

Requirements Prompt The requirements are specified for either trial cases or general experiments, with full details shown in Figure 6. For general experiments, we request the LLMs to return results in JSON format to 1) facilitate easier extraction of detection results and 2) avoid generating lengthy responses that may exceed the context window length. After obtaining the JSON output, we use LangChain's 9 JSON output parser for further analysis.

## A.4 Trial Examples

The details about the trial examples used in Sections 3 and 4 are shown in Figure 7, where the explanation part describes the ideal explanation for those anomalies. When constructing in-context learning and chain-of-thought prompts with n-shot examples, we use distinct anomaly types to formulate the prompt. For example, when inferring on a time series with shape anomalies, we will randomly choose examples of other types of anomalies, such as local point anomalies. Specifically, we set n to 1 to obtain the results shown in Figure 1.

## Requirements for Trial Cases

If anomalies are present, please indicate: 1) The presence of anomaly points in this time series. 2) The indices of these anomaly points, and 3) The reasoning behind these points being considered anomalies.

## Requirements for General Experiments

Please consider answering the following questions according to your observation. First, please try to identify the potential anomalies, and provide the list of the indexes of anomalies, if no anomalies, please return []. Second, if there are anomalies in the time series, please provide a short explanation of the anomalies.

Summarize the answers into two keys:

- -anomaly : a list of indexes
- -reason : a string of explanation

And format the output as JSON with the two keys.

Required: return the JSON only without other information.