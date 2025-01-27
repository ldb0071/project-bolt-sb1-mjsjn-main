# Page 5

## Page Information

- **Type**: figure_page
- **Word Count**: 562
- **Has Tables**: False
- **Has Figures**: False

## Content

# Page 5

## B. Graph Neural Network

Graph Neural Networks (GNNs) [16] [17] are a type of deep learning model that can handle graph-structured data. The goal of these GNNs is to learn representations for each node, which are computed based on the node's own features, the features of the edges connected to it, the representations of its neighbors, and the features of its neighboring nodes,

h l v = AGGR ( h l -1 v , { h l u -1 : u ∈ N v } ; θ l ) (1)

where h l v represents the representation of node v in the l -th layer. AGGR denotes the aggregation function that aggregates the representations of neighboring nodes from the previous layer. For the tasks that focus on individual nodes, e.g., node classification, the learned representations can be used directly to accomplish specific objectives. However, for the tasks that consider the entire graph, e.g., graph classification, a global representation can be obtained by pooling or applying other methods to the representations of all nodes. This global representation can then be used to perform the corresponding tasks.

## Visual Content

### Page Preview

![Page 5](/projects/llms/images/A_Survey_of_Large_Language_Models_on_Generative_Graph_Analytics_Query_Learning_and_Applications_page_5.png)
