# Page 8

## Page Information

- **Type**: table_page
- **Word Count**: 691
- **Has Tables**: True
- **Has Figures**: False

## Content

# Page 8

## A. Preliminary Concepts

Notations. A human skeleton is denoted as a topology graph G = {V , E} , where the vertex set V denotes body joints and the edge set E denotes bones. The vertex set is represented as V = { v 1 , v 2 , ..., v N } , where N denotes the number of vertices. The edge set E is formulated as an adjacent matrix A ∈ R N × N , where each element a i,j is defined as the connection strength between vertices v i and v j . We formulate a skeleton sequence of T frames as I ∈ R T × N × C in , where C in denotes the input-channel dimension. For each input skeleton, we apply a batch normalization layer to normalize the joint coordinates before feeding them into the network. The features of the vertex set of T frames are formulated as X ∈ R T × N × C , where C denotes the channel dimension of each vertex.

Graph Convolution. Let X S ∈ R T × N × C ' be the output features after performing spatial configuration extraction, where C ' denotes the output-channel dimension. In this way, the general graph convolution described in [19] follows the formulation given below:

X S = K S ∑ k =1 A k XW k S , (1)

where K S denotes the kernel size of the spatial domain (e.g., 3 in ST-GCN [19]), and W S ∈ R K S × C × C ' denotes the feature transformation filter in the spatial domain. The adjacent matrix A k ∈ R N × N enables GCN to aggregate the information about vertices in a spatial context, which captures the human architecture configuration.

After the application of spatial configuration extraction, a kernel size of K T temporal convolution is employed by W T to model the temporal dynamics; the output X T with a temporal dimension T ' is obtained as follows:

X T = Conv ( X S , W T ) , (2)

where W T ∈ R K T × C ' × C ' , and X T ∈ R T ' × N × C ' .

## Visual Content

### Page Preview

![Page 8](/projects/llms/images/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_8.png)

## Tables

### Table 1

| NM | BG | CL |
| --- | --- | --- |
| 92.7 | 80.8 | 79.3 |
| 92.0 | 81.4 | 80.1 |
| 92.3 | 80.6 | 76.7 |
| 95.7 | 89.6 | 88.6 |

### Table 2

| NM | BG | CL |
| --- | --- | --- |
| 92.5 | 83.1 | 83.3 |
| 93.9 | 87.2 | 87.5 |
| 91.6 | 75.5 | 78.6 |
| 88.0 | 76.8 | 77.6 |

### Table 3

| NM | BG | CL | None |
| --- | --- | --- | --- |
| 95.0 | 87.2 | 70.4 | 21.4 |
| 96.2 | 91.5 | 78.7 | 21.4 |
| 95.7 | 89.6 | 88.6 | 2.1 |

### Table 4

| G2 | G3 | NM | BG | CL |
| --- | --- | --- | --- | --- |
|  |  | 93.8 | 85.7 | 87.3 |
| ✓ |  | 93.7 | 84.7 | 87.0 |
|  | ✓ | 92.5 | 83.1 | 83.3 |
| ✓ |  | 93.9 | 85.3 | 87.8 |
|  | ✓ | 93.8 | 85.8 | 87.3 |
| ✓ | ✓ | 93.8 | 84.7 | 87.1 |
| ✓ | ✓ | 94.0 | 85.9 | 87.3 |

### Table 5

| NM | BG | CL | Avg | None |
| --- | --- | --- | --- | --- |
| 92.5 | 83.1 | 83.3 | 86.3 | 2.05 |
| 93.9 | 87.2 | 87.2 | 89.5 | 1.07 |
| 94.0 | 85.9 | 87.3 | 89.1 | 2.09 |
| 94.9 | 87.8 | 88.1 | 90.3 | 1.17 |
| 95.7 | 89.6 | 88.6 | 91.3 | 2.34 |
