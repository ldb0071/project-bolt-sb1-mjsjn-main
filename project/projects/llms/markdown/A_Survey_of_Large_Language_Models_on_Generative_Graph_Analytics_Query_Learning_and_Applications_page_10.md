# Page 10

## Page Information

- **Type**: figure_page
- **Word Count**: 650
- **Has Tables**: True
- **Has Figures**: False

## Content

# Page 10

## B. Graph Structure Understanding Methods

The rise of LLMs has sparked researchers' interest in exploring their powerful text processing and generalization capabilities for graph reasoning. Therefore, existing efforts have introduced various benchmarks to test LLMs' graph reasoning potential, aiming to explore their capacity to address graph-related problems. Prompting methods have emerged as the primary approach to assess LLMs' understanding of graph structures, with some studies also focusing on fine-tuning LLMs to enhance their graph reasoning abilities. Thus, the following two main methods are introduced: prompting method and fine-tuning LLMs .

1) Prompting method : The prompting method [55] can be categorized into three main types: manual prompt, selfprompting, and API call prompt, as shown in Figure 6. Most studies utilize manual prompts, where carefully crafted prompts guide LLMs to comprehend graph structures better and understand the objectives of graph tasks, thereby leading to improved performance on graph-related tasks.

Manual prompts. NLGraph [27] introduces a benchmark aiming to assess the understanding capabilities of LLMs in processing textual descriptions of graphs and translating them

into conceptual spaces. This benchmark covers various graph reasoning tasks like connectivity, shortest path, maximum flow, and graph neural network construction, with three difficulty levels (easy, medium, hard) based on graph size and density. Meanwhile, the number of nodes n = |V| and the probability p control edge generation, allowing manipulation of graph size and density for a more reliable evaluation of LLM potential in graph comprehension.

Next, to guide LLMs in solving these graph tasks, two prompt methods are proposed by NLGraph [27]: build-a-graph prompting and algorithmic prompting.

Prompt III-1: Build-a-Graph Prompting. Build-a-Graph prompting method is to guide LLMs to conceptual grounding by adding one sentence shown as red words below:

## Visual Content

### Page Preview

![Page 10](/projects/llms/images/A_Survey_of_Large_Language_Models_on_Generative_Graph_Analytics_Query_Learning_and_Applications_page_10.png)

## Tables

### Table 1

|  |
| --- |
|  |

### Table 2

|  |
| --- |
|  |

### Table 3

|  |
| --- |
|  |

### Table 4

|  |
| --- |
|  |

### Table 5

|  |
| --- |
|  |

### Table 6

|  |
| --- |
|  |

### Table 7

|  |  |  |
| --- | --- | --- |

### Table 8

| Graph-enhanced prefix:
Structural and textual features | Instructions: How many C-C-O triangles are
in the molecule? |
| --- | --- |
