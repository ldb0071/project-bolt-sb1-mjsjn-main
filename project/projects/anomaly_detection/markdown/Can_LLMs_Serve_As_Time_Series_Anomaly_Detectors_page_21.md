Page 21

## Trend Anomaly

Directly Use (Partially Correct) : Yes, there are anomalies in the time series. The indices of the anomaly points are 9, 10, 11, and 12. Reasoning behind the anomaly points being considered anomalies: The points at indices 9, 10, and 11 (values 6, 7, and 8) are significantly higher than the rest of the time series, which consists mainly of values ranging from 1 to 3. These higher values are likely anomalies because they deviate significantly from the overall pattern of the time series.

Multi-modal Instruction (Correct) : Presence of anomaly points: Yes Indices of anomaly points: 9, 10, 11 Reasoning behind these points being considered anomalies: The time series can be visualized as a wave-like pattern with oscillations between 1, 2, and 3. The anomaly points at indices 9, 10, and 11 appear as a sudden spike in the wave pattern, making them stand out as anomalies.

Figure 17: More example responses of LLaMA3 on the trial cases for other anomaly types.

GPT-4 Settings The GPT-4 version we used is 'GPT-4-0125-preview' 10 . Specifically, we employ LangChain 11 to facilitate the integration of prompts with the OpenAI API and to parse the output into JSON format for easier evaluation. We use the default parameters in generating the responses.

LLaMA3 Settings To obtain the inference results for the original LLaMA3, we utilized Groq's API services 12 . All results were generated using LLaMA3-8B due to computational resource limitations. Our fine-tuning is based on Meta-Llama-3-8B-Instruct 13 . We used parameter-efficient fine-tuning approaches, specifically LoRA [Hu et al., 2021], with Hugging Face's PEFT packages 14 . The settings for LoRA are as follows: we fine-tuned all linear layers in the transformers, with the LoRA rank set to 16, LoRA alpha set to 64, and a dropout rate of 0.1. The training arguments are: gradient accumulation for 4 steps, using the paged\_adamw\_8bit optimizer, a learning rate of 2e-4 with a

The values at these indexes significantly deviate from the general trend and range of the data, indicating potential anomalies.

<!-- image -->

## (a) YAHOO - Good

<!-- image -->

<!-- image -->

The series shows a significant, abrupt change in pattern, with values transitioning from fluctuating around zero to a sharp increase, indicating an anomaly.