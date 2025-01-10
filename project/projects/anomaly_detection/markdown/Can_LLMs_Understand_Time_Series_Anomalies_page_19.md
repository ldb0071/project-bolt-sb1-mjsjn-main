Page 19

score is 52.78 , whereas the official LLaMA score is 56.2 . Therefore, it is not surprising when we saw the score of InternVL2-Llama3-76B is 52.95 without an image and 53.26 with a trivial image. Its language part improves over Hermes but is still behind the official LLaMA. Similar to Qwen, we recommend avoiding using the official LLaMA for result replication.

Conclusion Overall, we show that the models' language part does not degrade when adding images to the text queries. While some models do have a lower MMLU-Pro score when using vision, it is due to the language part's initialization.

## A.2 MODEL DEPLOYMENT

We use vLLM (Kwon et al., 2023) for Qwen inference and LMDeploy (Contributors, 2023) for InternVL2 inference.

## A.3 VARIANTS NAMECODE

Validating hypotheses requires prompting the LLMs in a variety of ways. Table 1 shows a comprehensive list of the variants and their corresponding name codes, i.e., visualization labels.

## A.4 VARIANTS SPECIFICATIONS

Text / Vision The text variants prompt the LLMs with textual descriptions of the time series data, while the vision variants use visual representations of the time series data.

Zero-shot / One-shot without CoT The one-shot variant provides the LLM with an anomaly detection example. The answer is the correct anomaly ranges in the expected JSON format, without additional explanation. The zero-shot variant does not provide any anomaly detection examples. To enforce the JSON format even in the zero-shot setting, the prompt includes an example JSON answer with spaceholders.