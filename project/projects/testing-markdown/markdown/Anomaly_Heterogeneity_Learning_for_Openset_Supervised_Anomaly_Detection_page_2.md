Page 2

Open-set supervised AD (OSAD) is a recently emerging area that aims at utilizing those limited training anomaly data to learn generalized models for detecting unseen anomalies ( i.e ., samples from open-set anomaly classes), while effectively identifying those seen anomalies ( i.e ., anomalies that are similar to training anomaly examples). A number of methods have been introduced for this OSAD problem [1, 15, 24, 32, 68]. Benefiting from the prior knowledge illustrated by the seen anomalies, current OSAD

methods can often largely reduce false positive errors.

One issue with the current OSAD methods is that they treat the anomaly examples as from a homogeneous distribution, as shown in Fig. 1(a), which can largely restrict their performance in detecting unseen anomalies. This is because anomalies can arise from a wide range of conditions and are inherently unbounded, resulting in heterogeneous anomaly distributions ( i.e ., anomalies can be drawn from very different distributions). For instance, tumor images can demonstrate different features in terms of appearance, shape, size, and position, etc., depending on the nature of the tumors. The current OSAD methods ignore those anomaly heterogeneity and often fail to detect anomalies if they are drawn from data distributions dissimilar to the seen anomalies.

To address this issue, we propose to learn heterogeneous anomaly distributions with the limited training anomaly examples. These anomalies are examples of seen anomaly classes only, which do not illustrate the distribution of every possible anomaly classes, e.g ., those unseen ones, making it challenging to learn the underlying heterogeneous anomaly distributions with the limited anomaly information. This work introduces a novel framework, namely Anomaly Heterogeneity Learning ( AHL ), to tackle this challenge. As illustrated in Fig. 1(b), it first simulates a variety of heterogeneous anomaly distributions by associating fine-grained distributions of normal examples with randomly selected anomaly examples. AHL then performs a collaborative differentiable learning that synthesizes all these anomaly distributions to learn a heterogeneous abnormality model. Further, the generated anomaly data enables the training of our model in surrogate open environments, in which part of anomaly distributions are used for model training while the others are used as unseen data to validate and tune the model, resulting in better generalized models than the current methods that are trained in a closed-set setting.

Additionally, the simulated anomaly distributions are typically of different quality. Thus, a self-supervised generalizability estimation is devised in AHL to adaptively adjust the importance of each learned anomaly distribution during our model training.

Astraightforward alternative approach to AHL is to build an ensemble model based on a simple integration of homogeneous/heterogeneous OSAD models on the simulated heterogeneous data distributions. However, such ensembles fail to consider the commonalities and differences in the anomaly heterogeneity captured in the base models, leading to a suboptimal learning of the heterogeneity (Sec. 4.5.2).

Accordingly, this paper makes four main contributions.

- · Framework. We propose Anomaly Heterogeneity Learning ( AHL ), a novel framework for OSAD. Unlike current methods that treat the training anomaly examples as a homogeneous distribution, AHL learns heterogeneous anomaly distributions with these limited examples, en-

- ling more generalized detection on unseen anomalies.
- · Novel Model. We further instantiate the AHL framework to a novel OSAD model. The model performs a collaborative differentiable learning of the anomaly heterogeneity using a diverse set of simulated heterogeneous anomaly distributions, facilitating an iterative validating and tuning of the model in surrogate open-set environments. This enables a more optimal anomaly heterogeneity learning than simple ensemble methods.
- · Generic. Our model is generic, in which features and loss functions from different OSAD models can plug-and-play and gain substantially improved detection performance.
- · Strong Generalization Ability. Experiments on nine real-world AD datasets show that AHL substantially outperforms state-of-the-art models in detecting unseen anomalies in the same-domain and cross-domain settings.

## 2. Related Work