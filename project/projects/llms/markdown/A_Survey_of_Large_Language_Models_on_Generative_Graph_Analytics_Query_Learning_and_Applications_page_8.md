# Page 8

## Page Information

- **Type**: figure_page
- **Word Count**: 634
- **Has Tables**: True
- **Has Figures**: False

## Content

# Page 8

## III. GRAPH STRUCTURE UNDERSTANDING TASKS

Graph structure understanding tasks evaluate whether LLMs can comprehend graph structures. Simple tasks include the queries of neighbors, shortest paths, connectivity, the calculation of graph radius, and the clustering coefficient. More complex tasks include solving maximum flow problems and performing topological sorting. These tasks need LLMs to comprehend graph structures locally and globally, as shown in Figure 2. In this section, we present 21 graph understanding tasks along with their definitions. Subsequently, we elaborate on the two main methods currently used to address graph structure understanding tasks: prompting and supervised finetuning LLMs.

Given <graph>. Simple path: Find a single path from node 0 to node 4 connected by edges in the given graph. Shortest path: Give the shortest path from node 0 to node 4.

<!-- image -->

Given <graph>, in the given graph, the triangle must be connected by three edges, list the triangle after 'Ans:' in the format of [0-1-2]

<!-- image -->

Given <graph>, is there a path in this graph that visits every node exactly once? If yes, give the path. Note that in a path, adjacent nodes must be connected with edges.

<!-- image -->

TABLE I: Prompts for Graph Structure Understanding Tasks, where [graph] is the input of the data.

| Task                             | Prompts                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Graph Data Loading               | The structure of the [file path] molecular graph of the benzene ring contains a hexagon.                                                                                                                                                                                                                                                                                                                                                |
| Graph Size Detection             | Given [graph], what is the number of nodes and edges in this graph? Please answer with the number of nodes: X, number of edges: X.                                                                                                                                                                                                                                                                                                      |
| Degree Detection                 | Given [graph], what is the degree of node 4? Or, find the node degree of node [given node] in the given graph.                                                                                                                                                                                                                                                                                                                          |
| Connected Nodes                  | Given [graph]. Is node 5 the 1-hop neighbor of node 4? List the answers after 'Ans:' in the format of [Yes, No,].                                                                                                                                                                                                                                                                                                                       |
| Edge Detection                   | Given [graph]. Is there an edge between node 1 and node 2?                                                                                                                                                                                                                                                                                                                                                                              |
| Path                             | Simple path: Given the undirected graph with the specified nodes and edges, nodes: [0, 1, 2, 3, 4], edges: [(0, 1), (1, 4), (1, 3), (4, 3), (3, 2)], find a single path from node 1 to node 2 connected by edges in the given graph. Shortest path: Given the directed graph with the specified nodes and edges, nodes: [0, 1, 2, 3, 4], edges: [(0, 1), (1, 4), (1, 3), (4, 3), (3, 2)], give the shortest path from node 0 to node 4. |
| Attribute Retrieval              | Given [graph]. What is the title of node 0?                                                                                                                                                                                                                                                                                                                                                                                             |
| Graph Density                    | Given [graph]. What is the density of the given graph?                                                                                                                                                                                                                                                                                                                                                                                  |
| Eccentricity                     | Given [graph]. What is the eccentricity of the given graph?                                                                                                                                                                                                                                                                                                                                                                             |
| Graph Radius                     | Given [graph]. What is the radius of the given graph?                                                                                                                                                                                                                                                                                                                                                                                   |
| Graph Diameter                   | Given [graph]. What is the diameter of this graph?                                                                                                                                                                                                                                                                                                                                                                                      |
| Graph Periphery                  | Given [graph]. What is the periphery of this graph? Or What are the nodes included by the periphery of the given graph?                                                                                                                                                                                                                                                                                                                 |
| Clustering Coefficient Computing | Given [graph]. What is the clustering coefficient of [given node]?                                                                                                                                                                                                                                                                                                                                                                      |

## Visual Content

### Page Preview

![Page 8](/projects/llms/images/A_Survey_of_Large_Language_Models_on_Generative_Graph_Analytics_Query_Learning_and_Applications_page_8.png)

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

|  |
| --- |
|  |

### Table 8

|  |
| --- |
|  |

### Table 9

|  |
| --- |
|  |

### Table 10

|  |
| --- |
|  |

### Table 11

|  |
| --- |
|  |

### Table 12

|  |
| --- |
|  |

### Table 13

|  |
| --- |
|  |

### Table 14

|  |
| --- |
|  |

### Table 15

|  |
| --- |
|  |

### Table 16

|  |
| --- |
|  |

### Table 17

|  |
| --- |
|  |
