# Page 13

## Page Information

- **Type**: figure_page
- **Word Count**: 603
- **Has Tables**: True
- **Has Figures**: True

## Content

# Page 13

## Prompt III-3: DST2

DyG Instruction: In an undirected dynamic graph, (u, v, t) means that node u and node v are linked with an undirected edge at time t.

Task Instruction: Your task is to answer when two nodes are first connected in the dynamic graph. Two nodes are connected if there exists a path between them. Answer Instruction: Give the answer as an integer number at the last of your response after 'Answer:'

Exemplar: Here is an example: Question: Given an undirected dynamic graph with the edges [(0, 1, 0), (1, 2, 1), (0, 2, 2)]. When are node 0 and node 2 first connected? Answer:1

Question: Question: Given an undirected dynamic graph with the edges [(0, 9, 0), (1, 9, 0), (2, 5, 0), (1, 2, 1), (2, 6, 1), (3, 7, 1), (4, 5, 2), (4, 7, 2), (7, 8, 2), (0, 1, 3), (1, 6, 3), (5, 6, 3), (0, 4, 4), (3, 4, 4), (3, 6, 4), (4, 6, 4), (4, 9, 4), (6, 7, 4)]. When are node 2 and node 1 first connected?

Results show that LLMs have preliminary spatio-temporal understanding capabilities on dynamic graphs. Dynamic graph tasks become increasingly challenging with larger graph sizes and densities while insensitive to periods and data generation mechanisms.

We provide manual prompt examples for various graph structure understanding tasks in Table I and Table II. Additionally, we test LLMs with GPT 3.5 for path, max flow, and bipartite graph matching using manual prompts, as shown in Figure 3, Figure 4 and Figure 5 respectively.

For self-prompting. Self-prompting refers to the process where an LLM continuously updates the initial prompt to make it easier for LLMs to understand and more beneficial for solving tasks. In other words, the LLM designs prompts based on the original prompt. GPT4Graph [23] utilizes self-prompting by continuously updating the prompt with descriptions related to the graph. Specifically, first, the graph data is converted into graph description languages, as shown in Section II-D. Then, together with queries, it is inputted into the prompt handler to create a prompt, which is then inputted into the LLM. Based on the output of the LLM, the prompt is updated and reinput into the LLM, repeating multiple rounds of updates to obtain an optimized graph description context, such as context summarization and format explanation. This process can be seen as the LLM's self-updating prompt procedure. Finally, the optimized graph description context is input along with the original input into the LLM to obtain the final result.

Prompt III-4: Self-prompting. The input original prompt is shown below:

## Visual Content

### Page Preview

![Page 13](/projects/llms/images/A_Survey_of_Large_Language_Models_on_Generative_Graph_Analytics_Query_Learning_and_Applications_page_13.png)

### Figures

![](/projects/llms/figures/A_Survey_of_Large_Language_Models_on_Generative_Graph_Analytics_Query_Learning_and_Applications_page_13_figure_1.png)


![](/projects/llms/figures/A_Survey_of_Large_Language_Models_on_Generative_Graph_Analytics_Query_Learning_and_Applications_page_13_figure_2.png)


![](/projects/llms/figures/A_Survey_of_Large_Language_Models_on_Generative_Graph_Analytics_Query_Learning_and_Applications_page_13_figure_3.png)


![](/projects/llms/figures/A_Survey_of_Large_Language_Models_on_Generative_Graph_Analytics_Query_Learning_and_Applications_page_13_figure_4.png)


![](/projects/llms/figures/A_Survey_of_Large_Language_Models_on_Generative_Graph_Analytics_Query_Learning_and_Applications_page_13_figure_5.png)


## Tables

### Table 1

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |

### Table 2

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |

### Table 3

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |

### Table 4

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
