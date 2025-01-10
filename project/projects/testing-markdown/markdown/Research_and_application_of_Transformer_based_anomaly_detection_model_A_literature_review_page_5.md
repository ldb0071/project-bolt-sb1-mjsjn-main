Page 5

## 3 Relationship of different training methods

## 3.1 Supervised learning

Supervised method means that the training set of the model must be explicitly labeled with normal and abnormal samples to learn the decision boundary, probability distribution or determine the confidence interval from the annotated instances. Since the dataset contains more prior knowledge, supervised models can achieve better performance than semi-supervised or unsupervised models, but the premise is to obtain large, explicitly labeled training data. As a result, the challenge of data imbalance has emerged as the primary obstacle in supervised learning, making it arduous to effectively differentiate between normal and abnormal data characterized by highdimensional and intricate features. At present, there is very little research on applying Transformer to supervised anomaly detection tasks.

Li et al. [31] proposed GTF, an adaptive integration approach to anomaly detection for performance-constrained network edge computing devices by combining TabTransformer [32] and Gradient Boost Decision Tree (GBDT). They mitigated the imbalanced classification problem by FocusLoss ( FL ) and extended FL to multi-class classification tasks to achieve a total of 9 different types of network anomaly detection

Table 1 Definitions of anomalies in different research results