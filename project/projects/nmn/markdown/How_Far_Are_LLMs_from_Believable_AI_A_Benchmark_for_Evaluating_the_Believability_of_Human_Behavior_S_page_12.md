# Page 12

## Page Information

- **Type**: table_page
- **Word Count**: 318
- **Has Tables**: False
- **Has Figures**: False

## Content

# Page 12

## 4 Baseline Methods for Human Behavior Simulation

To prompt the LLM to simulate human behavior, three components are crucial: the instruction to explain how to simulate human behavior (I), the profile of specific characters (II), and some description of the task that the LLM needs to finish (III). Below will introduce how we implement these three components in our baselines.

I: Simulate Human Behavior For models like GPT-3.5 that have gone through RLHF (Wirth et al., 2017; Stiennon et al., 2020), the RLHF will equip LLMs with specific language preferences and habits, such as introducing itself "as a language model", which will harm the believability. To overcome these issues, we set an instruction prompt template to instruct the LLM on how to simulate human behavior. Please refer to Appendix B for details of the prompt template.

II: Profile of Specific Characters According to section 3.1, we will fill in corresponding information in the instruction prompt template . For example, the {person} will be replaced with the name of the character.

Table 2: CA scores across ten models to simulate a character. The last six columns correspond to the accuracy of the model for different types of questions. A larger CA indicates better consistency performance.

|                   |      | Immutable Characteristic   | Immutable Characteristic   | Social Role   | Social Role   | Relationship   | Relationship   |
|-------------------|------|----------------------------|----------------------------|---------------|---------------|----------------|----------------|
| Model             | CA   | Known                      | Unknown                    | Known         | Unknow        | Known          | UnKnown        |
| GPT-4             | 0.77 | 1.00                       | 0.47                       | 1.00          | 0.59          | 0.97           | 0.06           |
| GPT-3.5-Turbo-16K | 0.70 | 0.82                       | 0.58                       | 0.56          | 0.88          | 0.91           | 0.31           |
| XVERSE-13B-Chat   | 0.62 | 0.68                       | 0.53                       | 0.68          | 0.76          | 0.59           | 0.44           |
| Qwen-14B-Chat     | 0.60 | 0.59                       | 0.21                       | 0.82          | 0.12          | 0.94           | 0.38           |
| Vicuna-13B-16K    | 0.59 | 0.64                       | 0.32                       | 0.76          | 0.18          | 0.76           | 0.56           |
| ChatGLM2-6B-32K   | 0.55 | 0.68                       | 0.21                       | 0.71          | 0.24          | 0.79           | 0.25           |
| Qwen-7B-Chat      | 0.53 | 0.64                       | 0.11                       | 0.74          | 0.12          | 0.91           | 0.06           |
| ChatGLM2-6B       | 0.49 | 0.50                       | 0.16                       | 0.65          | 0.12          | 0.88           | 0.06           |
| LongChat-7B-32K   | 0.48 | 0.59                       | 0.05                       | 0.76          | 0.00          | 0.79           | 0.06           |
| Vicuna-7B-16K     | 0.46 | 0.36                       | 0.05                       | 0.85          | 0.06          | 0.74           | 0.06           |

III: Prompting for Consistency Dataset Given that our assessment of consistency is performed in a question-answering format, the prompt for the task will be set like this: "Answer the below question; you should only choose an option as the answer. {example}. {question}" . The placeholder of {example} will be filled if few-shot (Brown et al., 2020) is applied in the experiments. Additionally, chainof-thought (CoT) (Wei et al., 2022) and Self-Ask (Press et al., 2022) will be utilized in zero-shot and few-shot settings. In summary, five combinations of prompting strategies and learning settings are considered: Zero , Zero+CoT , Few , Few+CoT , Few+Self-Ask .

III: Prompting for Robustness Dataset The prompting used for the robustness dataset is similar to the one for the consistency dataset. The difference lies in that we will prompt the perturbed profile of the character to the instruction prompt template. In this way, the LLM can simulate the character's variants, and we will compute the RA and RCoV when the LLM simulates these variants to evaluate the robustness of the LLM.

## Visual Content

### Page Preview

![Page 12](/projects/nmn/images/How_Far_Are_LLMs_from_Believable_AI_A_Benchmark_for_Evaluating_the_Believability_of_Human_Behavior_S_page_12.png)
