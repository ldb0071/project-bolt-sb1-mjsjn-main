Page 72

Model decision boundary should be equivalent to the ideal distribution boundary under ideal circumstances. However, the deviation and distortion of the model will lead to ambiguity between abnormal samples, normal samples, and new samples. (Note that the boundary ambiguity here does not mean that the model decision boundary is uncertain, but that too close sample spatial distances will make it difficult for the model to determine a clear decision boundary.) Model needs to widen the distance between normal and anomalous samples during learning representation to adaptively use appropriate decision boundaries for different anomaly detection tasks. Currently, many scholars have used adaptive methods such as Peak Over Threshold (POT) [160] to dynamically adjust the anomaly threshold and decision boundary. In

conclusion, solving this problem requires more accurate model estimation with stronger representation learning ability.

## 7.2.2 Challenges of Transformer-based models

## The application of Transformer in OOD tasks

From the previous part, the current studies have only made some early attempts on the OOD task, and have not put forward substantially innovative methods/models. Although these studies have demonstrated that Transformer is more effective than other NLP models (i.e., LSTM/Bag-of-words model) through different experimental protocols, they have also indicated that Transformer still has many limitations and deficiencies, which need further research and development.