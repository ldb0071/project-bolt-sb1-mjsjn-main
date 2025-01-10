Page 69

AUROC , FAR 95, and other evaluation indexes of 4 datasets. Koner et al. [37] showed experimentally that the performance of Mahalanobis distance is similar to cos distance, the former holds only a weak performance advantage. They attributed this to the smaller dependence of the higher norm between the two features of the Mahalanobis distance and the utilization of mean and covariance. Podolskiy et al. [121] tested different combinations of models and distance functions through a large number of experiments, and finally concluded that the combination of fine-tuned Transformer and Mahalanobis distance could achieve the best performance. They believed that Mahalanobis distance can easily capture the geometric differences between the homogeneous representations of utterances inside and outside the domain. Xu et al. [58] argued that Mahalanobis distance could effectively extract the features of all layers in the BERT model.

Combined with the above conclusions, this paper argues that there is still a certain performance advantage of Mahalanobis distance in Transformer-based OOD detection tasks, but it is not in the absolute lead. More research results are needed to support this conclusion in the future.

## 7.2 Challenges

## 7.2.1 Challenges of anomaly detection tasks

Currently, various neural network models, including Transformer, are very prone to model distribution bias and model estimation errors, which is because the vast majority of samples in the task of anomaly detection are normal samples. This paper summarizes several main challenges faced by the current anomaly detection task, as shown in Figure 10.