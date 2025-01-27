# Page 7

## Page Information

- **Type**: figure_page
- **Word Count**: 561
- **Has Tables**: False
- **Has Figures**: True

## Content

# Page 7

## D. Graph Description Language

Graphs are represented in the structured data in arbitrary shapes, while LLMs typically process sequential data, such as the text as a sequence of words. To bridge this gap,

Given <graph>, what is the number of nodes and edges in this graph? Please answer with the number of nodes: X, number of edges: X.

<!-- image -->

Given <graph>, what is the degree of node 4?  Or, like, find the node degree of node [given node] in the given graph.

<!-- image -->

Given <graph>, what is the title of node 0?

<!-- image -->

In a directed graph with 5 nodes numbered from 0 to 4: node 0 should be visited before node 1, ... Q: Can all the nodes be visited? Give the solution.

<!-- image -->

Given <graph>, what is the density of the given graph?

<!-- image -->

Fig. 2: Graph Structure Understanding tasks.

<!-- image -->

9

In a directed graph with 5 nodes numbered from 0 to 4, and the edges are: an edge from node 0 to node 1 with capacity 10... Q: What is the maximum flow from node 0 to node 3?

Graph Structure Understanding Tasks

Given <graph>. Is node 3 the 1-hop neighbor of node 4? List the answers after 'Ans:' in the format of [Yes, No,].

<!-- image -->

Given <graph>, what is the eccentricity of the node 0?

<!-- image -->

Given <graph>. Is there an edge between node 1 and node 2?

<!-- image -->

Given <graph>, what is the diameter of the given graph?

<!-- image -->

There are 2 job applicants numbered from 0 to 1, and 3 jobs numbered from 0 to 2. Each applicant is interested in some of the jobs. Each job can only accept one applicant and a job applicant can be appointed for only one job. Applicant 0 is interested in job 1, ... Q: Find an assignment of jobs to applicants in such that the maximum number of applicants find the job they are interested in.

<!-- image -->

the graph description language (GDL) transforms the graph into sequential data, which can be inputted into an LLM. Specifically, GDL aims to convert graphs into sequential data while retaining the structure and unique attributes of the graph. This conversion allows the graph's information to be fed into an LLM for processing. There are several graph description languages:

- · Text description. Graph structure can be described using words such as 'Node 1 is connected to Node 2' and 'There are three nodes connected to Node 1'.
- · Adjacency list. An adjacency list represents each vertex in the graph with the collection of its neighbouring vertices or edges. Node A is connected with node B and node C can be denoted as N ( v ) = { B,C } .
- · Edge list. An edge list represents the edge connections between two nodes in the graph. (A, B) indicates a connection between nodes A and B.
- · GML. Graph Modelling Language [49] consists of an unordered sequence of node and edge elements enclosed within '[·]'.
- · GraphML. Graph Markup Language [50] consists of XML containing a graph element and an unordered sequence of node and edge elements.
- · SQL. Several specialized SQL languages are designed specifically for working with graph data. These languages are also capable of serving as graph description languages. Some notable examples include Cypher [51], a query language developed by Neo4j, and Gremlin [52], SPARQL [53], and GSQL [54]. They combine SQLlike syntax with graph-specific constructs and algorithms, making them suitable for complex graph analytics tasks.
- · Multi-modality encoding. Except for text description,

graph structure can also be represented using image description and motif description. The graph can be visualized as an image and inputted into an LLM to process images. Alternatively, motifs such as stars, triangles, or clique patterns can represent the graph structure as input into an LLM.

- · Encode as a story. The graph can be encoded within a specific context, such as a friendship, co-authorship, social network, politician, or expert. For example, the connections between nodes can represent friendship relationships. We can assign names to the nodes, such as 'David' and 'Alice'.

Notably, (1) different graph description languages can yield different results of LLMs. Therefore, it is suggested to test with multiple GDLs and select the one with the best experimental results. (2) If needed, the LLM's output form can be specified along with GDLs in the prompt. LLMs often generate excessive reasoning processes that may be unnecessary, so standardizing the LLM's output can be beneficial.

## Visual Content

### Page Preview

![Page 7](/projects/llms/images/A_Survey_of_Large_Language_Models_on_Generative_Graph_Analytics_Query_Learning_and_Applications_page_7.png)

### Figures

![](/projects/llms/figures/A_Survey_of_Large_Language_Models_on_Generative_Graph_Analytics_Query_Learning_and_Applications_page_7_figure_1.png)


![](/projects/llms/figures/A_Survey_of_Large_Language_Models_on_Generative_Graph_Analytics_Query_Learning_and_Applications_page_7_figure_2.png)


![](/projects/llms/figures/A_Survey_of_Large_Language_Models_on_Generative_Graph_Analytics_Query_Learning_and_Applications_page_7_figure_3.png)

