# Page 17

## Page Information

- **Type**: figure_page
- **Word Count**: 627
- **Has Tables**: False
- **Has Figures**: False

## Content

# Page 17

## Input:(Regular prompt)

The structure of the benzene ring molecular graph of benzene ring contains a hexagon.

Output:(API call prompt)

The structure of the [GL('benzenering')] molecular graph of benzene ring contains a hexagon.

Example 2

Input:(Regular prompt)

What is the diameter of the binomial tree?

Output:(API call prompt)

The diameter of the binomial tree is [GR(GL('gpr', 'binomial tree'), 'toolx:diameter') → r].

Second, fine-tune existing LLMs such as GPT-J [60] [61], LLaMA [5] [62], etc., using technologies like LoRA [63] on the generated prompt dataset. Thirdly, utilize the finetuned LLM for inference to add graph reasoning API calls

Fig. 7: Supervised fine-tuning (SFT) method in graph structure understanding tasks. Prefix tuning is shown above: combine graph structural and textual information as prefixes in prefix tuning and input it into LLM with instructions, like GraphLLM [64]. Instruction tuning can also be used.

<!-- image -->

into statements. After generating API call statements, how can external graph tools be invoked? Graph reasoning query processing comes in. Graph reasoning query processing entails utilizing external graph reasoning tools based on API call statements to obtain the final answer.

- 2) Supervised fine-tuning (SFT) method : Beyond leveraging prompts for graph-structured tasks with LLMs, certain studies have also implemented supervised fine-tuning of LLMs, illustrated in Figure 7. GraphLLM [64] is committed to addressing the obstacles in graph reasoning by LLMs and introduces a hybrid model that inherits the capabilities of both graph learning models and LLMs, enabling LLMs to interpret and reason about graph data proficiently, utilizing the superior expressive power of graph learning models.

## Visual Content

### Page Preview

![Page 17](/projects/llms/images/A_Survey_of_Large_Language_Models_on_Generative_Graph_Analytics_Query_Learning_and_Applications_page_17.png)
