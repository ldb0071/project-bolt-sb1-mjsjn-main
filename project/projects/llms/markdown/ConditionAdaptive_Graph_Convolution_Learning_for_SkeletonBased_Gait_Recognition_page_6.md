# Page 6

## Page Information

- **Type**: table_page
- **Word Count**: 834
- **Has Tables**: False
- **Has Figures**: False

## Content

# Page 6

## C. Adaptive Mechanisms

Data-dependent mechanisms have achieved great success in computer vision, which adjust feature extractions to capture instance-specific properties. SE-Net [40] connected the relations among different channels to adaptively attend to the most important ones. Self-attention methods [41]-[43] utilized QKV-based techniques to effectively construct the global context. Further, inspired by the attention ideas, the methods reported in [44]-[46] generated dynamic weights to combine a set of filters in order to promote the network representation capacity. Recently, lightweight networks [47][50] produced convolutional filters on-the-fly, which adaptively fit the customized features.

For appearance-based methods (GaitPart [2] and MetaGait [51]) using attention mechanisms, their approaches are just supplements to the uniform feature extraction of their backbones. In contrast, the proposed JSFL module achieves dynamic feature extraction by generating adaptive convolutional filters, which no longer require an attention mechanism. Besides, the part-level feature learning in appearance-based methods is achieved by a manual partition, where the part semantics are not well aligned. In contrast, JSFL can obtain better-aligned parts from the skeleton inputs.

Previously, a few appearance-based gait approaches (MGAN [52], GaitGAN [53], Chai et.al. [54], and Vi-GaitGL [55]) have studied the topic of learning view-invariant gait features. MGAN [52] and GaitGAN [53], and Makihara et.al [56] transform gait energy images (GEIs), period energy images (PEIs) or silhouettes from arbitrary views into a targeted view, which however is not feasible for skeleton-based gait recognition. Chai et.al. [54] and Vi-GaitGL [55] propose to

learn view-specific embedding or projection parameters for the fully-connected layers. In contrast, the proposed viewadaptive topology learning (VATL) aims to generate viewadaptive topologies for GCNs.

## Visual Content

### Page Preview

![Page 6](/projects/llms/images/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_6.png)
