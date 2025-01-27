# Page 25

## Page Information

- **Type**: table_page
- **Word Count**: 516
- **Has Tables**: False
- **Has Figures**: False

## Content

# Page 25

## Prompt IV-1: Manual Prompt Template with Slots

The title of one paper is < Title > and its abstract is < Abstract > . This paper is cited by the following papers: < Titlelist1 > . Each of these papers belongs to one category in: < Categories > . You need to 1.Analyse the papers' topic based on the given title and abstract; 2.Analyse the pattern of citation information based on their titles, and retrieve the citation information you think is important to help you determine the category of the first given paper. Now you need to combine the information from 1 and 2 to predict the category of the first given paper. You should only output one category.

This is citation network, each node denotes one There are nodes . node 1 is central node, with title "Can Language Models Solve Graph Problems in Natural Language?" is connected to node 2 with title "Exploring the potential in learning on graphs node 3 with title "Natural language is all graph needs~ node with title "Talk like graph: Encoding graphs for node 5 with title "Label-free node classification on graphs with language models (llms)" which arxiv CS subcategory does node 1 with title "Can Language Models Solve Graph Problems in Natural form XX" large large

Based on the titles of the node 1 paper and its connected papers, it seems that the research is focused on the intersection of natural language processing and graph theory, possibly with an emphasis on the capabilities of language models (LLMs) to understand and process graph-structured data. large

most likely arXiv Computer Science (cs) subcategory for node 1 titled Solve Graph Problems in Natural Language?" would be:

cs.CL (Computation and Language)

This subcategory covers computational linguistics and natural language processing, which is where work on language models typically falls Additionally, since the titles suggest focus on graph problems there may be an overlap with:

cs LG (Learning)

This subcategory includes machine learning and might be relevant if the paper discusses the learning aspects of language models applied to graph data However the primary classification based on the title seems to be related to natural language processing and computational linguistics, making most fitting choice

prompts through sampling. Specifically, it conducts a twostage sampling process on the source node and each candidate neighbor from the original candidate set to acquire anchor nodes. Prompt generation is then based on these anchor nodes.

We provide manual prompt examples for various graph learning tasks in Table III. Additionally, we test LLMs with GPT 3.5 for node classification and KGQA using manual prompts, as shown in Figure 13 and Figure 14.

Supervised fine-tuning (SFT) LLMs. IntructGLM [78] and GraphGPT [79] both employ SFT to train LLM for the node classification task. IntructGLM [78] utilizes a single LLM by prompting methods. The prompt includes the description of node attributes and structure through text descriptions and corresponding queries. LLMs are then tasked with answering questions and determining node categories, leading to fine-tuning through supervised learning. On the other hand, GraphGPT [79] feeds graph structural information and text

This is knowledge graph. There are nodes: ["Nolan 'Inception" and edges are from "Inception" to "Nolan" with relationship "is directed by" , from "Oppenheimet" to "Nolan" with relationship "is directed by" to "US" with relationship to "Leonardo" with relationship "is starred by" Based on the given knowledge graph, the director who directs Inception also direct what?

Based on the given knowledge graph, the director who directs 'Inception also directs "Oppenheimer This can be inferred from the two edges connecting 'Inception to "Nolan and "Oppenheimer to "Nolan both with the relationship "is directed by

Fig. 14: Examples for KGQA with GPT3.5 - Graph Learning Tasks. Prefix tasks Downstream tasks

<!-- image -->

Fig. 15: Graph prompt for graph learning.Graph prompt methods first unify prefix and downstream tasks, then pre-train GNN on the unified tasks. The pre-trained GNN, when faced with different downstream tasks, combines with a tunable prompt through tuning prompts to handle the downstream tasks better.

into LLM via embedding. Subsequently, two rounds of instruction tuning are conducted to refine LLM and effectively address the node classification task. IntructGLM [78] employs prompts to input subgraph structures into LLM, while GraphGPT [79] inputs them into LLM through embedding.

3) Graph prompt : In graph learning tasks, a wide array of tasks at the node, edge, and graph levels creates a challenge in achieving compatibility between pre-training and downstream tasks, potentially leading to negative transfer effects that can harm the performance of downstream tasks and compromise the reliability of transfer learning in graph data. Current methods aim to harmonize pre-training and downstream tasks to facilitate more effective transfer learning of graph information. Despite these efforts, it remains essential to identify task-specific differences for optimal performance. Inspired by NLP, researchers have started incorporating prompts in graph contexts to enable the reuse of pre-trained models across various downstream tasks without the need for repeated fine-

tuning, as shown in Figure 15. The integration of prompts is crucial in assisting downstream tasks in achieving taskspecific optimal outcomes, bridging the gap between pretrained models and the diverse array of graph tasks to enhance performance and transferability.

Training on unified tasks GPPT [80] and GraphPrompt [81] aim to unify pre-training and downstream tasks in graph learning. GPPT transforms node classification tasks into edge prediction tasks and employs masked edge prediction for GNN pre-training. Meanwhile, GraphPrompt combines node and graph classification tasks into a subgraph similarity prediction task and utilizes graph prompt functions, introducing unified instances and task templates to enhance performance. Subsequent research, like All in One [82], further consolidates edge, node, and graph classification tasks into a single framework using multi-task prompting approaches, standardizing graph prompts similar to language prompts and enhancing initialization through metalearning techniques for improved reliability and generality across different tasks in graph data analysis.

## Visual Content

### Page Preview

![Page 25](/projects/llms/images/A_Survey_of_Large_Language_Models_on_Generative_Graph_Analytics_Query_Learning_and_Applications_page_25.png)
