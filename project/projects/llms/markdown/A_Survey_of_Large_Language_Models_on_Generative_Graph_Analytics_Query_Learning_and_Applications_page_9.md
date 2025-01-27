# Page 9

## Page Information

- **Type**: figure_page
- **Word Count**: 708
- **Has Tables**: False
- **Has Figures**: False

## Content

# Page 9

## A. Task Introduction

- 1) Graph size calculation: Graph size refers to the number of nodes and edges in a graph. Given a general graph G = ( V , E ) , the graph size detection task is to detect the |V| and |E| in G . Through this task, LLMs are expected to understand the fundamental structure of a graph accurately. Given a prompt describing the graph and asking related queries, LLMs are supposed to determine |V| and |E| , as shown in Figure 2 (a).
- 2) Degree calculation: The degree detection task involves determining the degree of a specific node in a graph. The neighbors of node v can be denoted as N ( v ) = { u | ( u, v ) ∈ E ( v ) } , where E ( v ) is the edge set including edges connected to v . The degree of v i is the number of its neighbors in G , which can be denotes as deg G ( v i ) = |N ( v i ) | . Through this task, LLMs are expected to comprehend the context surrounding v i and identify N ( v i ) accurately. By inputting a prompt about v i and G , LLMs are expected to calculate the degree of the node. This task is shown in Figure 2 (b).
- 3) Connected nodes search: The connected nodes detection task involves finding all the nodes in N G ( v i ) of v i in G . Given the prompt about G , LLMs are expected to analyze the local structure of the given node v i and determine N G ( v i ) , as shown in Figure 2 (c).
- 4) Edge validation: The edge detection task refers to whether there exists an edge e ij or e ij between v i and v i . Through this task, LLMs are expected to accurately identify the connectivity between nodes and understand the local

structure of nodes. Given the prompt about the neighbors of v i to the LLMs, LLMs will likely indicate whether e ij or e ij exists, as shown in Figure 2 (d).

- 5) Path search: We consider two types of paths, including the simple path and the shortest path, as shown in Figure 2 (e). Given a graph G = {V , E} , the simple path task involves detecting whether there exists a path ( v i , ..., v j ) between a source node v i and a target node v j in G . In other words, it is about finding a simple path ( v i , ..., v j ) between v i and v j without specific requirements. This task evaluates the ability of LLMs to traverse a graph and understand its structure. Given the prompt about G to LLMs, the goal is to return a simple path from v i to v j .

Given a weighted directed acyclic graph G = {V , E} with each edge e ∈ E has a non-negative weight w ( e ) , the shortest paths task involve finding a path p = ( e 1 , e 2 , . . . , e n ) from a source node to a target node in G such that the sum of the weights of edges w ( p ) = ∑ n i =1 w ( e i ) is minimized. LLMs can evaluate the length of the shortest path and identify the qualified paths. This task can be further divided into three objectives: 1. Finding the shortest path between two nodes. 2. Finding all the shortest paths for all paired nodes. 3. Finding the average length of all the shortest paths. This task assesses whether the LLM can effectively determine the shortest route between two specified nodes within the graph.

- 6) Attribute retrieval: The attribute retrieval task involves retrieving detailed information related to nodes, such as the

TABLE II: Prompts for Graph Structure Understanding Tasks, where [graph] is the input of the data. [TBR] means to be reasoned by LLMs.

| Task                     | Prompts                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
|--------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Graph Partition          | In the academic collaboration network dblp, scholar #355233 is involved in [TBR] local community formed by his/her collaborators.                                                                                                                                                                                                                                                                                                                                                                                          |
| Graph Searching          | According to the Freebase knowledge graph, the relation between entity /m/027rn and entity /m/06cx9 is [TBR].                                                                                                                                                                                                                                                                                                                                                                                                              |
| Pattern matching         | Triangle: find a single triangle containing node X. Or in the given graph, the triangle must be connected by three edges, list the triangle after 'Ans:' in the format of [0-1-2]. Cliques: find all the cliques with N nodes in the given graph, list all the cliques after 'Ans:' in the format of [0-1-2] and separate the answers by a comma. Wedge Centering find a single wedge containing node X in the given graph, node X must be the center of this wedge, list the wedge after 'Ans:' in the format of [0-1-2]. |
| Cycle Check              | In an undirected graph, (i,j) means that node i and node j are connected with an undirected edge. The nodes are numbered from 0 to 5, and the edges are: (3,4) (3,5) (1,0) (2,5) (2,0) Q: Is there a cycle in this graph?                                                                                                                                                                                                                                                                                                  |
| Topological Sort         | In a directed graph with 5 nodes numbered from 0 to 4: node 0 should be visited before node 4, ... Q: Can all the nodes be visited? Give the solution.                                                                                                                                                                                                                                                                                                                                                                     |
| Maximum Flow             | In a directed graph with 5 nodes numbered from 0 to 4, and the edges are: an edge from node 0 to node 1 with capacity 10... Q: What is the maximum flow from node 0 to node 3?                                                                                                                                                                                                                                                                                                                                             |
| Bipartite Graph Matching | There are 2 job applicants numbered from 0 to 1, and 3 jobs numbered from 0 to 2. Each applicant is interested in some of the jobs. Each job can only accept one applicant and a job applicant can be appointed for only one job. Applicant 0 is interested in job 1, ... Q: Find an assignment of jobs to applicants in such that the maximum number of applicants find the job they are interested in.                                                                                                                   |
| Hamilton Path            | Given [graph], is there a path in this graph that visits every node exactly once? If yes, give the path. Note that in a path, adjacent nodes must be connected with edges.                                                                                                                                                                                                                                                                                                                                                 |
| Graph Neural Networks    | Given [graph]. Embeddings: node 0: [1,1], ... In a simple graph convolution layer, each node's embedding is updated by the sum of its neighbors' embeddings. Q: What's the embedding of each node after one layer of simple graph convolution layer?                                                                                                                                                                                                                                                                       |
| Dynamic Graph            | In an undirected dynamic graph, (u, v, t) means that node u and node v are linked with an undirected edge at time t. Your task is to answer when two nodes are first connected in the dynamic graph. Two nodes are connected if there exists a path between them. Given an undirected dynamic graph with the edges [(0, 1, 0), (1, 2, 1), (0, 2, 2)]. When are node 0 and node 2 first connected?                                                                                                                          |

attributes of a node. For example, in a citation network, LLMs are tasked with retrieving specific attributes of a node, such as the title, abstract, or author of a paper. Given the prompt about G and detailed attribute information, LLMs are expected to retrieve the required information, as shown in Figure 2 (f).

7) Graph density: Graph density represents the ratio between the number of edges present in a graph and the maximum number of edges that the graph can have. For an undirected simple graph G = {V , E} , the graph density is defined as:

D = 2 |E| |V| ( |V| 1) (2)

For a directed simple graph, the graph density is defined as:

D = |E| |V| ( |V| 1) (3)

This task requires LLM to calculate the density of a given graph and assess its understanding of the entire graph, as shown in Figure 2 (g).

8) Eccentricity: The eccentricity of a node in a graph is defined as the length of the longest shortest path starting at that node. The eccentricity of one node: this task requires LLMs

to answer the eccentricity of a given node. The eccentricity of many nodes: this task requires LLMs to answer the eccentricity of a subset of nodes or all the nodes in the graph, as shown in Figure 2 (h).

9) Graph radius: Based on the eccentricity of nodes, the radius of a graph is the minimum eccentricity of any vertex in the graph. LLMs can calculate the radius of the given graph with the description of the graph.

10) Graph center: The center of a graph is the set of vertices of graph eccentricity equal to the graph radius. Based on the eccentricity task and graph radius task, LLMs should be given the graph information and asked to calculate the graph center.

- 11) Graph diameter: Based on the shortest path, the diameter of a graph is the length of the shortest path between the most distant nodes. LLMs can calculate the graph's diameter with the given graph information, as shown in Figure 2 (i).
- 12) Graph periphery: Based on the graph eccentricities and graph diameter, the graph periphery is a set of vertices that have graph eccentricities equal to the graph diameter. LLMs can answer questions related to the graph periphery using the given graph information.

Given the undirected graph with the specified nodes and edges, nodes: [0, 1, 2, 3, edges: [(0, 1), (1, 3), (1,4), (2, 3)], find single path from node 0 to node connected by edges in given graph, list the answer after "Ans in the format of [0-1-2]. 4] , the

To find single path from node node connected by edges in the given graph, can use the depth-first search (DFS) algorithm\_

Starting from node explore each possible until reach node Path

Here is the path from node 0 to node

Ans: [0-1-4]

Fig. 3: Examples for Path Task with GPT3.5 - Graph Structure Understanding Tasks.

In directed graph with nodes numbered 0 to 4, and the edges are: an from node to node 10, an edge from node to node 4 with capacity 1, an edge from node to node 3 with capacity 5, an edge from node to node 3 with capability 5, an edge from node with capability 9 . Q: What is the maximum flow from node 0 to node 3? Give the answer only from edge

The maximum flow from node 0 to node 3 in the given directed graph is

Fig. 4: Examples for Maximum Flow Task with GPT3.5 Graph Structure Understanding Tasks.

are 2 job applicants numbered to 1, and 3 jobs numbered from 0 to Each applicant is interested in some of the jobs. Each job can only accept one applicant and job applicant can be appointed for only one job . Applicant 0 is interested in job applicant is an assignment of jobs to applicants in such that the maximum  number of applicants find the job are interested only . There from in. they

final assignment that maximizes the number of applicants finding the job they are interested in is follows: The

Applicant 0 is assigned to Job 1

Applicant 1 is assigned to Job

In this assignment, both applicants are assigned to the jobs they are interested resulting in the maximum number of applicants finding the job they desire in,

Fig. 5: Examples for Bipartite Graph Matching Task with GPT3.5 - Graph Structure Understanding Tasks.

13) Clustering coefficient computing: The clustering coefficient is a measure of how connected a vertex's neighbors are to one another. We define the edges among neighbors of v i as { e jk : v j , v k ∈ N G ( v i ) , e jk ∈ E} . For directed graphs, the clustering coefficient is defined as:

C i = |{ e jk : v j , v k ∈ N G ( v i ) , e jk ∈ E}| |N G ( v i ) ||N G ( v i ) -1 | (4)

For undirected graphs, the clustering coefficient is defined as:

C i = 2 |{ e jk : v j , v k ∈ N G ( v i ) , e jk ∈ E}| |N G ( v i ) ||N G ( v i ) -1 | (5)

LLMs can calculate the clustering coefficient as a measure of the degree to which nodes in a graph tend to cluster together.

14) Graph partition: This task is an online social network reasoning task, which is to infer the community structure of an online social network by partitioning users into different clusters based on their interaction information. Each cluster represents a social community formed by users who interact with each other frequently. LLMs partition the users of the social network based on user social interaction patterns and generate the resulting cluster assignments.

15) Graph searching: This task is a knowledge graph reasoning task, which involves inferring relationships between entities based on their information or inferring connected entities based on the information of entities and relationships. Specifically, LLM takes entities or relationships as input and searches for relevant entities or relationships to generate output.

16) Pattern matching: This task is to identify star, wedge, triangle, or clique patterns that contain a target node. The target node can be defined as the center of the pattern. Alternatively, the task can involve identifying whether these patterns exist in a given graph and determining the number of occurrences. Given a description of the LLM graph, the goal is for LLM to identify different patterns and provide the corresponding answers, as shown in Figure 2 (j).

17) Cycle validation: This task is to determine whether a graph contains a cycle. Given G = {V , E} , a cycle is a nonempty trail with a vertex sequence ( v 1 , v 2 , ..., v n , v 1 ) . Given the graph information, LLM is asked to determine whether this graph has a cycle.

18) Topological sorting: Topological sorting of a directed graph G = {V , E} refers to a linear ordering of its nodes, where each node comes before all the nodes it points to, for example, there exists a directed edge e ij from v i to v j , v i comes before v j in the ordering. The resulting array of node ordering is called topological ordering. LLM is required to generate a valid topological sorting for the given directed graph, and there may be multiple valid solutions, as shown in Figure 2 (k).

19) Maximum flow: Given a capacity constraint, the maximum flow problem involves finding the maximum flow that can be sent through pipes, channels, or other pathways in a network. Define a flow as f ij from v i to v j and the capacity on edge e ij as c ij . Given the capability constraints, f ij ≤ c ij

Fig. 6: Promoting methods in graph structure understanding tasks. There are three categories: manual prompts, self-prompting, and API call prompts.

<!-- image -->

Manual prompt

<!-- image -->

<!-- image -->

API call prompts

for all e ij . Meanwhile, ∑ f ij > 0 f ij = ∑ f ji > 0 f ji for ∀ v i except for

the source and the target { s, t } Given a network graph, LLM generates a path that maximizes the flow from the source to the sink, as shown in Figure 2 (l).

20) Bipartite graph matching: A bipartite graph is a type of graph where the nodes can be divided into two disjoint sets, U and V , such that there are no adjacent nodes within each set. A matching in a bipartite graph is a set of edges where no two edges share an endpoint. In a maximum matching, if any edge is added, it is no longer a matching. For a given bipartite graph, there can be multiple maximum matchings. LLM can generate a solution that finds the maximum matching, as shown in Figure 2 (m).

21) Hamilton Path: In an undirected graph, a Hamiltonian path is a path in the graph that visits each vertex exactly once. Given an undirected graph, the task is for LLM to find a valid Hamiltonian path, as shown in Figure 2 (n).

## Visual Content

### Page Preview

![Page 9](/projects/llms/images/A_Survey_of_Large_Language_Models_on_Generative_Graph_Analytics_Query_Learning_and_Applications_page_9.png)
