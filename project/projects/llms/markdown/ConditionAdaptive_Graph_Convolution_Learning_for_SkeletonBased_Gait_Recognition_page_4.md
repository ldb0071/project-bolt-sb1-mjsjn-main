# Page 4

## Page Information

- **Type**: citation_rich
- **Word Count**: 618
- **Has Tables**: True
- **Has Figures**: True

## Content

# Page 4

## A. Gait Recognition

Currently, two categories of mainstream gait recognition methods are available; the appearance-based and the modelbased methods. The appearance-based approaches obtain silhouettes as inputs, which rely on abundant shape information to model spatial-temporal features.

Some of the representative appearance-based methods are disentanglement-based, set-based, part-based, and 3D convolutional neural networks (CNNs)-based. The disentanglementbased methods [22]-[24] aimed to disentangle the original walking features into identity-relevant features and identityirrelevant features, which avoided the negative effects of confounding variables. The set-based approaches [1], [25] regarded a gait sequence as an unordered set, which processed each frame independently, and did not explicitly model temporal relations. Further, the part-based methods [2], [3], [26], [27] proposed to extract features of different parts individually for fine-grained feature extraction, and applied temporal motion modeling in different scales. 3D CNN-based methods [4], [5], [28], [29] stacked layers of 3D convolutions to capture spatialtemporal patterns in multiple scales.

The model-based approaches methods model the human structure and body movement by designing simulated models [30], [31] or using skeletons [6]-[8], [11] as inputs. Recently, due to the successful development of pose estimation methods [32]-[34], the skeleton-based methods have prevailed.

The PoseGait [6], CNN-pose [11], and pose-based temporal-spatial network (PTSN) [35] methods used a skeleton sequence as a 2D matrix and employ 2D CNNs or LSTMs to model gait features. These methods did not consider the topological connections of the skeletons. The JointsGait [8], Mao et.al. [12], GaitGraph [7], MSGG [13], CycleGait [14], Gait-D [36] adopted GCN-based architectures from skeletonbased action recognition [19], [37]. Recently, a transformerbased method [38] adopted transformer blocks to model the spatial and temporal correlations in a self-attention manner. Furthermore, the ModelGait [9] and Li et.al. [10] methods used a human mesh-recovery (HMR) [39] network to extract and use both shape and pose features.

The proposed CAG belongs to the skeleton-based methods and utilizes a GCN-based network architecture.

## Visual Content

### Page Preview

![Page 4](/projects/llms/images/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4.png)

### Figures

![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_1.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_2.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_3.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_4.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_5.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_6.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_7.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_8.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_9.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_10.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_11.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_12.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_13.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_14.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_15.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_16.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_17.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_18.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_19.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_20.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_21.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_22.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_23.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_24.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_25.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_26.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_27.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_28.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_29.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_30.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_31.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_32.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_33.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_34.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_35.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_36.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_37.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_38.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_39.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_40.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_41.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_42.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_43.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_44.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_45.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_46.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_47.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_48.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_49.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_50.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_51.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_52.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_53.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_54.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_55.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_56.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_57.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_58.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_59.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_60.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_61.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_62.png)


![](/projects/llms/figures/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_4_figure_63.png)


## Tables

### Table 1

|  |
| --- |
|  |
|  |
|  |
|  |
|  |
