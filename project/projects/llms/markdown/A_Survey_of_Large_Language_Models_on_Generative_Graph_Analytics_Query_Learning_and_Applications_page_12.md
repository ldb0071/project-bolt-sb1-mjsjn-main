# Page 12

## Page Information

- **Type**: figure_page
- **Word Count**: 472
- **Has Tables**: True
- **Has Figures**: True

## Content

# Page 12

## Prompt III-2: Algorithmic Prompting

We can use a Depth-First Search (DFS) algorithm to find the shortest path between two given nodes in an undirected graph.

The basic idea is to start at one of the nodes and use DFS to explore all of its adjacent nodes. At each node, you can keep track of the distance it takes to reach that node from the starting node.

Once you have explored all the adjacent nodes, you can backtrack and pick the node which has the shortest distance to reach the destination node.

Given < graph description > . Q: Give the shortest path

from node 0 to node 4.

Compared with other advanced prompts and in-context learning techniques, the two proposed prompts perform better on graph tasks. Based on the experiments, LLMs indeed possess preliminary graph reasoning abilities. Also, the benefits of advanced prompting and in-context learning diminish in complex graph problems and may even have a negative impact. LLMs are also susceptible to false correlations, performing poorly on graph structures such as chains and cliques.

To explore whether LLMs can truly comprehend graph structures and reason on graphs, meanwhile, enhance the performance of LLM-GQP tasks, [26] and [24] test LLMs also using manual prompts, where [26] explores the conditions under which LLMs can benefit from the inherent structural information in the data and examines two potential factors influencing LLM's performance: data leakage and homogeneity.

In summary, the conclusions are as follows:

- · No evidence suggests that LLM's performance is significantly attributed to data leakage.
- · The performance of LLMs on target nodes is positively correlated with the local homogeneity of the nodes.

[24] investigates the graph reasoning capabilities of LLMs and introduces new evaluation metrics-comprehension, correctness, fidelity, and rectification-to assess LLMs' proficiency in understanding graph structures and performing reasoning tasks. The findings reveal that LLMs can effectively understand graph structures and perform reasoning tasks. However, LLMs still face challenges in structural reasoning, particularly in multi-answer tasks where GPT models demonstrate errors and overconfidence. In contrast, GPT-4 displays improved self-correction abilities.

Beyond static graphs, LLMs' ability to understand dynamic graph structures is also assessed. Dynamic graphs change over time, capturing temporal network evolution patterns. LLM4DyG [25] introduces the LLM4DyG benchmark, which uses prompting methods to evaluate LLMs' spatio-temporal understanding capabilities on dynamic graphs.

Prompt III-3: DST2. The newly proposed Disentangled Spatial-Temporal Thoughts (DST2) prompting technique enhances LLMs' spatial and temporal understanding of dynamic graphs. DST2 is shown below:

## Visual Content

### Page Preview

![Page 12](/projects/llms/images/A_Survey_of_Large_Language_Models_on_Generative_Graph_Analytics_Query_Learning_and_Applications_page_12.png)

### Figures

![](/projects/llms/figures/A_Survey_of_Large_Language_Models_on_Generative_Graph_Analytics_Query_Learning_and_Applications_page_12_figure_1.png)


## Tables

### Table 1

| learnableprompt | arning Tasks, where [·] is the input of the data.
op-
gen- Trainable LM
…
base,
…
…
task
bute Trainable LLM
…
node
…
edto
…
ased Node Text Attribute
odes, Encoding graph into embeddings.
Frozen LLM
…
…
…
Generating graph pseudo labels.
n be
cers,
s act Providing external knowledge/explanations.
der-
TextEmbeddings
vast +
iated
s act GNN
task
s to
GraphStructure
raph
ligns Fig. 9: Encoding graph into embeddings, when LLMs act as
enhancers.InputthenodetextattributeintoLM/LLMtoobtain
asks text embeddings, then combine the text embeddings with the
By graph structure for training and learning in GNNs.
tors,
can
more ure9),generatinggraphpseudolabels(asshowninFigure10), |
| --- | --- |

### Table 2

| ] i | s | the | in | put |
| --- | --- | --- | --- | --- |

### Table 3

| e d | ata | . |
| --- | --- | --- |

### Table 4

|  |  |  |  |
| --- | --- | --- | --- |

### Table 5

|  |
| --- |
|  |

### Table 6

|  |
| --- |
|  |

### Table 7

|  |
| --- |
|  |

### Table 8

|  |
| --- |
|  |

### Table 9

|  |  |
| --- | --- |
|  |  |

### Table 10

|  |  |
| --- | --- |
|  |  |

### Table 11

|  |
| --- |
|  |

### Table 12

|  |  |
| --- | --- |

### Table 13

|  |  |
| --- | --- |

### Table 14

|  |
| --- |
|  |

### Table 15

|  |  |
| --- | --- |
|  |  |

### Table 16

|  |  |
| --- | --- |
|  |  |

### Table 17

|  |
| --- |
|  |

### Table 18

|  |  |
| --- | --- |

### Table 19

|  |  |
| --- | --- |

### Table 20

| None |  |  | None |  | None |  |  |  | None |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  | None | None | None |
| None | None |  | None |  | None |  |  |  |  |

### Table 21

|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |
