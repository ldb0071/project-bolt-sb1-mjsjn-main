# Page 10

## Page Information

- **Type**: table_page
- **Word Count**: 527
- **Has Tables**: True
- **Has Figures**: True

## Content

# Page 10

## C. Joint-Specific Filter Learning

Since different body parts typically exhibit different amounts of variation and degrees of freedom due to the articulated structure of the skeleton, the JSFL module is used to describe the individual spatial-temporal characteristics flexibly in different gait sequences by generating customized filters. As shown in Fig. 3, two separate branches corresponding to spatial and temporal filter generations are utilized to extract the spatial configurations and capture the temporal dynamics, respectively. Particularly, the filters are generated in a depthwise manner to increase efficiency.

The gait features X ∈ R T × N × C are used as an input and a temporal adaptive pooling is applied to obtain a temporal downsampled output X P ∈ R T P × N × C , where T P denotes the pooled size. For both spatial and temporal branches, we initially utilize temporal convolutions to learn the contextual

Fig. 3: JSFL constructs two separate branches to generate S (spatial) and T (temporal) joint-specific filters, respectively.

<!-- image -->

information at each joint. Then, we apply a temporal pooling (TP) operation to the spatial branch to aggregate the temporal global context. Next, two cascaded fully-connected layers with a batch normalization layer and a rectified linear unit (ReLU) activation function are used to construct the cross-channel communications and produce filter f s with the expected size 1 × N × ( K S × C ) . Subsequently, we reshape the filter into a size K S × N × C , and adopt batch normalization to avoid filter parameters being extremely large or small. In summary, the operations in the spatial branch can be formulated as follows:

f S = F ( F ( TP ( TC ( X P )) , W 3 ) , W 4 ) , F S = BN ( Reshape ( f s )) , (5)

where TC , TP , F and BN denote temporal convolution, temporal pooling, fully-connected layer, and batch normalization respectively. W 3 ∈ R C × C r reduces the channel dimension by the ratio r and W 4 ∈ R C r × C recovers the channel dimension.

Different from the spatial branch, the temporal branch is used to describe motion characteristics, which does not include TP for maintaining the temporal structure, and uses two cascaded fully-connected layers with a ReLU activation function along the temporal dimension. The objective is to effectively exploit rich temporal relations in different moments in order to explore motion properties. Next, a normalization operation is applied to ensure parameter distribution stability. In summary, the operations in the temporal branch can be formulated as follows:

f T = F ( F ( TC ( X P ) , W 5 ) , W 6 ) , F T = BN ( f T ) , (6)

Fig. 4: VATL defines a set of learnable view-related topologies and employs prior-view knowledge to learn the view-adaptive topology. GAP, FC, and WS denote global average pooling, fully-connected layer, and weighted summation respectively.

<!-- image -->

where W 5 ∈ R T P × ( α × T P ) inflates the temporal dimension by the ratio α and W 6 ∈ R ( α × T P ) × K T reduces it to a defined size K T .

Discussion. Some appearance-based gait methods [2], [3], [5] use part-based approaches to model the local features. These methods are similar to JSFL to some extent. We compare JSFL with these part-based approaches. Their differences are summarized as follows: a) The part-based methods extract features of different sequences using uniform convolutions, whereas JSFL extracts features for each sequence adaptively. b) The part-based methods use non-shared convolutions, whose parameter usage is times larger than that of the vanilla convolutions. However, JSFL, which saves approximately half of the parameters shown in the first and second rows of Table VI, is more efficient than the vanilla convolution. c) The part-based methods mostly obtain the parts using a manual partition, where the part semantics are not well aligned. In contrast, JSFL can obtain the well-aligned parts from the skeleton inputs.

## Visual Content

### Page Preview

![Page 10](/projects/llms/images/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_10.png)

### Figures

![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_10_figure_1.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_10_figure_2.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_10_figure_3.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_10_figure_4.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_10_figure_5.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_10_figure_6.png)


## Tables

### Table 1

| 2 | 8 | 94.1 | 87.0 | 87.4 | 89.5 | 1.14 |
| --- | --- | --- | --- | --- | --- | --- |
| 2 | 8 | 94.5 | 87.2 | 87.8 | 89.8 | 1.14 |
| 2 | 8 | 94.9 | 87.8 | 88.1 | 90.3 | 1.14 |

### Table 2

| 4 | 8 | 94.9 | 87.6 | 88.0 | 90.2 | 1.15 |
| --- | --- | --- | --- | --- | --- | --- |

### Table 3

| 2 | 8 | 94.9 | 87.8 | 88.1 | 90.3 | 1.14 |
| --- | --- | --- | --- | --- | --- | --- |
| 2 | 16 | 94.2 | 86.7 | 87.4 | 89.4 | 0.86 |

### Table 4

| 0 | 0 | 92.4 | 86.5 | 86.1 |
| --- | --- | --- | --- | --- |
| 0 | 1 | 92.9 | 87.7 | 87.3 |
| 1 | 1 | 91.5 | 84.2 | 84.7 |
| 1 | 1 | 93.8 | 87.6 | 87.3 |
| 1 | 0.1 | 94.1 | 87.6 | 87.6 |
| 0.5 | 0.1 | 94.0 | 87.5 | 87.5 |
| 0.7 | 0.1 | 93.7 | 86.4 | 86.7 |
| 0.3 | 0.1 | 94.5 | 87.6 | 87.9 |
| 0.1 | 0.1 | 94.9 | 87.8 | 88.1 |
