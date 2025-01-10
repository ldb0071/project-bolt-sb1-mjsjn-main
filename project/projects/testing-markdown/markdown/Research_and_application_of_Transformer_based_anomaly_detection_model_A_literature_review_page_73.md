Page 73

## Multi-modal anomaly detection

In anomaly detection tasks, the misclassification of anomalous samples is usually much more costly than the misclassification of normal instances. However, current approaches are mainly targeted at anomaly detection tasks with a single data source, even MTS data tasks are also aimed at detecting multiple data dimensions of the same system. In contrast, many anomalies exist in multi-modal data, such as combining two or more audio, video, graphics, image, and text data simultaneously. The multi-modal task requires models to consider the correlation and complementarity of different feature distributions over the potential space, which is more difficult to implement, so designing multi-modal anomaly detection systems with practical applications is one of the challenges in this area.

## Transformer model optimization

Although many methods have been devoted to optimizing the performance overhead of Transformer since it was proposed, such as sparse attention mechanism, Informer, etc., these methods also have their drawbacks, such as restricted application scenarios and no significant time complexity improvement compared with Vanilla Transformer in certain cases. Therefore, how to reduce the resource consumption model is an issue that all Transformer-based anomaly detection models have to consider. Otherwise, these models will be difficult to deploy to edge computing platforms with constrained computability. For example, Ullah et al. [161] employed filter pruning via geometric median (FPGM) to compress and reduce the size of the original anomaly detection model. In addition, although Transformer has many variants, there is no universal variant model when dealing with the problem of overly long input data with corresponding position encoding [162]. Therefore, Transformer itself still needs continuous iterative updates.

## 7.3 Future research trends and development directions