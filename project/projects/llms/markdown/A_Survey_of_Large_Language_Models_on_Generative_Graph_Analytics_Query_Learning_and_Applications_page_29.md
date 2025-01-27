# Page 29

## Page Information

- **Type**: table_page
- **Word Count**: 962
- **Has Tables**: False
- **Has Figures**: False

## Content

# Page 29

## A. Tasks Introduction

Graph-formed reasoning refers to combining the graph form with LLMs to obtain more accurate and reliable answers. LLMs have strong reasoning capabilities, and many prompting methods are proposed to enhance LLMs' reasoning abilities, addressing algorithmic problems, mathematical issues, etc., such as chain of thought, self-consistency, in-context learning, and more. However, these methods diverge from the patterns of human thought. The human thought process is typically non-linear rather than a simple chain of continuous thoughts, like in Figure 17. Graphs can represent the thinking patterns of individuals during the thought process. Suppose LLMs can also use graph-formed reasoning for inference. In that case, they may be able to solve more complex problems, such as algorithmic problems, logical reasoning problems, and mathematical word problems, as shown in Figure 16. In this section, we present seven graph-formed reasoning tasks along with their definitions. Next, we introduce graph-formed reasoning methods involving two types of reasoning: think on the graph and verify on the graph.

1) Sorting: The problem of sorting involves arranging certain elements in a specific order. For example, sorting a list of duplicate numbers from 0 to 9 can be done using a merge-based sorting algorithm. First, the input sequence of numbers is divided into subarrays. Then, these subarrays are sorted individually and merged to form the final solution, as shown in Figure 16 (a).

2) Set operations: Set operation task mainly focuses on set intersection. Specifically, the second input set is split into subsets and the intersection of those subsets with the first input set is determined with the help of the LLM, as shown in Figure 16 (b).

- 3) Keyword counting: The keyword counting task aims to determine the frequency of specific keywords within a given category in the input text. The input text is divided into

<!-- image -->

Fig. 18: Graph-formed reasoning. Two directions: think on graphs and verify on graphs. Think on the graph refers to using the graph structure to derive the final conclusion during the LLMs' reasoning process. Verify on the graph refers to using the graph to verify the correctness of the LLMs' intermediate and final output.

<!-- image -->

multiple paragraphs, and the keywords are counted in each paragraph, with the sub-results aggregated, as shown in Figure 16 (e).

- 4) Document merging: Document merging is the process of generating a new document based on multiple input documents that have overlapping content sections. The goal is to minimize duplication as much as possible while preserving the maximum amount of information, as shown in Figure 16 (c).
- 5) Math word problems: Math word problems include single- and multi-step word problems with addition, multiplication, subtraction, division and other math topics. LLM requires an understanding of text and mathematical relationships and involves a multi-step reasoning process where calculations are performed step by step to arrive at an answer ultimately, as shown in Figure 16 (d).
- 6) Multi-hop question qnswering: Multi-hop question answering requires LLM to retrieve and integrate information from multiple text passages or multi-hop graphs to answer questions. For a complex reasoning question, LLM uses a sophisticated thinking process to perform reasoning and ultimately arrive at the correct answer, as shown in Figure 16 (f).
- 7) Logic reasoning: Logical reasoning is a process aimed at concluding rigorously. It occurs in inference or argumentation, starting from a set of premises and reasoning towards a conclusion supported by those premises. Propositional logic is the most fundamental logical system, consisting of p, q, r, and various operations, as shown in Figure 16 (g).

## Visual Content

### Page Preview

![Page 29](/projects/llms/images/A_Survey_of_Large_Language_Models_on_Generative_Graph_Analytics_Query_Learning_and_Applications_page_29.png)
