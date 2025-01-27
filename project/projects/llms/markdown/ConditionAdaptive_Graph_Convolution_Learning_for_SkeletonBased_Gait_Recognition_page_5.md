# Page 5

## Page Information

- **Type**: table_page
- **Word Count**: 625
- **Has Tables**: True
- **Has Figures**: True

## Content

# Page 5

## B. GCNs for Skeleton Modeling

In recent years, numerous GCNs have been adopted to model spatial-temporal features in skeleton-based video analysis domains, especially in skeleton-based action recognition. Most current GCNs follow the pipeline design of ST-GCN [19]. For skeleton-based methods using GCNs (MSGG [13],

CycleGait [14], GAITTAKE [15], Gait-D [36], GaitGraph [7], and JointsGait [8]), they process different sequences with the same network parameters in GCNs, therefore limiting the model capacity to extract sample-specific characteristics. On the contrary, the proposed JSFL module learns various filters for different sequences and joints, which benefit extracting personalized walking features. Besides, MSGG [13] and GAITTAKE [15] adopt temporal attention approaches, which improve temporal aggregation flexibility. However, this adaptive manner is limited in the temporal domain and only used for feature aggregation, which does not play the main role in feature extraction, while our JSFL module is applied in both spatial and temporal domains, and used for feature extraction in the GCN backbone. A Transformer-based method (Gait-TR [38]) uses Transformer blocks to dynamically learn spatial gait patterns, but its temporal learning parameters are still shared for different samples, which is not flexible.

Some dynamic GCNs [16]-[18] were proposed to learn joint correlations dynamically in order to relax the fixed topology constraints and enrich the global context. However, these methods were not designed to extract fine-grained features, and their graphs were not generated to relate explicitly to viewing conditions, which is crucial for gait recognition. In contrast, the proposed VATL module employs learning of adaptive topologies, explicitly based on viewing conditions.

## Visual Content

### Page Preview

![Page 5](/projects/llms/images/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_5.png)

### Figures

![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_5_figure_1.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_5_figure_2.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_5_figure_3.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_5_figure_4.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_5_figure_5.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_5_figure_6.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_5_figure_7.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_5_figure_8.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_5_figure_9.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_5_figure_10.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_5_figure_11.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_5_figure_12.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_5_figure_13.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_5_figure_14.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_5_figure_15.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_5_figure_16.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_5_figure_17.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_5_figure_18.png)


## Tables

### Table 1

| 𝑺
Temporal
Convolutions
𝑻 ×𝑵×𝑪
𝑷
Temporal
Pooling
𝟏×𝑵×𝑪
FC
𝟏×𝑵×𝑪ൗr
FC
𝟏×𝑵×(𝑲 ×𝑪) 𝒇
𝑺 𝑺
Reshape &
Normalization
𝑲 ×𝑵×𝑪
𝑺 | 𝑻
Temporal
Convolutions
𝑻 ×𝑵×𝑪′
𝑷
FC
𝜶×𝑻 ×𝑵×𝑪′
𝑷
FC
𝒇 𝑻 𝑲 𝑻×𝑵×𝑪′
Normalization
𝑲 ×𝑵×𝑪′
𝑻 |
| --- | --- |

### Table 2

|  |  |
| --- | --- |

### Table 3

|  |  |
| --- | --- |
