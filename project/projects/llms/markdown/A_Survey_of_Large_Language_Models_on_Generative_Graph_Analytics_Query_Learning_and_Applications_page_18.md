# Page 18

## Page Information

- **Type**: figure_page
- **Word Count**: 494
- **Has Tables**: False
- **Has Figures**: False

## Content

# Page 18

## C. Comparisons and Discussions

In the following part, we compare the prompting and SFT methods mentioned above.

The prompting method can be divided into three categories: manual prompts, self-prompting, and API call prompts. Most current methods primarily rely on manual prompts, incorporating techniques like Chain of Thought (CoT) [65], self-consistency [66], and in-context learning [67]. To obtain better prompt representations, self-prompting methods are also widely used. However, the exclusive use of manual prompts and self-prompting offers limited enhancement to model performance, as they merely tap into the pre-existing capabilities of LLMs. Additionally, due to the limited input window of LLM, the graph size that can be input to LLM at once is also restricted, while graph sizes in the real world are typically large.

For the prompting method, we also propose two feasible directions to better leverage existing LLMs for handling structure understanding tasks. The first direction is breaking down complex tasks into several sub-problems. While LLMs can tackle simple graph tasks, they struggle with more challenging ones. Breaking down complex graph understanding tasks into simpler components enables LLMs to engage in multi-step reasoning processes, leading to the resolution of complex

Given <graph>, which arxiv CS subcategory does paper 'paper title' with abstract 'paper abstract' belongs to? use the abbreviation to answer.

<!-- image -->

Given <knowledge graph>, the director who directs Inception also direct what?

<!-- image -->

Given <graph>, is this molecule active with H3C4?

<!-- image -->

## Visual Content

### Page Preview

![Page 18](/projects/llms/images/A_Survey_of_Large_Language_Models_on_Generative_Graph_Analytics_Query_Learning_and_Applications_page_18.png)
