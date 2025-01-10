Page 74

We believe that the current development directions of Transformer are unsupervised binary anomaly detection with higher performance and model interpretability, and multi-class classification anomaly detection tasks based on semi-supervised and weak-supervised methods. Deeper theoretical research is worth studying. Therefore,

researchers should focus on interpretive learning and data-driven sustainability to meet the higher needs of anomaly detection tasks.

## 7.3.1 Zero-shot learning

The meaning of Zero-Shot Learning [163] (ZSL) is to enable models to classify categories they have never seen before, giving machines the ability to reason and achieve true intelligence. Therefore, the test set for ZSL can be divided into two categories: the first in which all the test sets are new categories; The second in which the test set includes both existing categories in the training set and new categories. Improperly trained models will conservatively tend to classify new categories as existing categories. To some extent, the binary classification anomaly detection task can be considered as a special case of ZSL. There are many benefits of using ZSL, such as the hierarchical representation structure of the ZSL method helps to eliminate the deviation caused by data imbalance. However, the application of ZSL must address the following issues:

- 1. The effect of ZSL depends on information about similar modalities;
- 2. ZSL still lacks an adequate amount of specialized definitions and descriptions.