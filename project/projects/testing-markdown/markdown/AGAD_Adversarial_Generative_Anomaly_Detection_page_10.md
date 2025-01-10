Page 10

Ablation study on contextual adversarial information . We experimented on Fashion-MNIST, CIFAR10, and CIFAR100 datasets with different levels of anomaly involvement. Bold numbers represent the best results.

As AdvProp Xie et al. (2020) assumes different underlying data distributions between actual data and generated examples, so that separating normal and adversarial data distributions could effectively improve the recognition performances, we hereby deploy auxiliary batch norms for the generated pseudo-anomaly data. Similarly, for the actual anomaly examples, we further trail on the effects of isolating anomaly data distributions from actual normalities, by switching off batch norm layers for true anomaly data. As shown in Table 5, the awareness of anomaly data distribution is critical under low-shot anomaly scenarios ( 𝛾 = . 01 , 𝛾 = . 03 ). Meanwhile, the affect of AdvProp and Freeze BN turns to be smaller if increasing the amount of anomaly data.

## 6.3. Effectiveness of Anomalous Data

Since our model achieves good AUCs if trained with more than 5% anomaly data, we further investigat the benefits of increasing the anomaly data. Here, we evaluate

Table 5

| Dataset Adv Freeze   | BN   |                               | Anomaly percentage 𝛾 .01   | Anomaly percentage 𝛾 .01   | Anomaly percentage 𝛾 .01      | Anomaly percentage 𝛾 .01   |
|----------------------|------|-------------------------------|----------------------------|----------------------------|-------------------------------|----------------------------|
|                      | Prop |                               | .00                        | .03                        | .05                           | .10                        |
| ✓                    | ✓    | -                             | 100. ±                     | 0.00 100. ±                | 0.00 100. ±                   | 0.00 100. ± 0.00           |
| ✓                    |      | 98.2±2.45                     | 100. ±                     | 0.00 100. ±                | 0.00 100. ±                   | 0.00 100. ± 0.00           |
|                      | ✓    | -                             | 98.2 ±                     | 2.34 99.9±0.03             | 100. ±                        | 0.00 100. ± 0.00           |
| F-MNIST              |      | 98.3 ±                        | 2.21 100. ±                | 0.00 100. ±                | 0.00 100. ± 0.00 100.         | ± 0.00                     |
| ✓                    | ✓    | -                             | 93.8± 5.50                 |                            | 95.4±5.87 99.2±1.55 99.8±0.22 |                            |
| AR10 ✓               |      | 89.6±10.0 93.2±7.20 97.6±3.40 |                            |                            | 99.4 ± 1.08                   | 99.7±0.69                  |
| CIF                  | ✓    | -                             | 94.3±7.90                  | 98.3                       | ±2.58 98.6±2.58               | 99.9 ± 0.05                |
|                      | ✓    | ±6.17 -                       | 92.6 ± 7.76 94.8           | 98.3 ± 2.38                | 99.3±1.15                     | 99.9 ±0.15                 |
| ✓                    |      |                               | 96.0 ± 7.38                | 92.6 ±                     | 11.3 95.6±9.24 98.8±3.27      |                            |
| AR100                |      |                               |                            |                            |                               |                            |
| ✓                    |      | 92.4± 11.4                    | 95.7 ± 7.72                | 97.5 ±                     |                               | ± 3.08                     |
|                      | ✓    |                               | 96.0 ± 7.56                | 97.3 ± 5.94                | 98.8 ± 2.82 3.63              | 99.6 ± 1.09                |
| CIF                  |      | - ±11.5 ± 6.20                | 92.8 97.1                  | 97.8 ± 4.90                | 5.59 98.1±5.47 99.1 98.8 ±    | 99.7 ± 0.80                |

Ablation study on different batch normalization strategy. We experimented on Fashion-MNIST, CIFAR10, and CIFAR100 datasets with different levels of anomaly involvement. Bold numbers represent the best results.

the class-wise prediction anomaly score for two relatively complex datasets, CIFAR10 and CIFAR100, to examine the discrimination abilities between the models trained with 5% and 20% anomaly data respectively with box plots. To mitigate the side-effects of extreme values, Tukey's method is adopted to remove the potential outlier scores outside of the interval [ 𝑄 1 -1 . 5 𝐼𝑄𝑅,𝑄 3 +1 . 5 𝐼𝑄𝑅 ] , where 𝑄 1 and 𝑄 3 are the first and third quartiles of the distribution and 𝐼𝑄𝑅 is the interquartiale range. As Figure 4 shows, with more anomaly data, the model tends to have better discrimination on normal and anomaly data, as expected. Thus, though the marginal benefit might be low, we believe the increasing of anomaly data could contribute and potentially improve the model robustness.

## 7. Discussion

This work presented AGAD, an adversarial generative anomaly detection framework that fits for both supervised and semi-supervised anomaly detection tasks. In general, we proposed a anomaly detection paradigm taking the advantages of contextual adversarial information , by learning discriminative features between normal and (pseudo-)abnormal data in a constrastive fashion. With extensive experiments, we found our method is performant with semi-supervised training protocol, while it gets more robust with a growing level of supervision. In such sense, we believe this proposed work fits towards most practical applications where anomaly data is collectable.

In general, our proposed method aims at addressing anomaly detection problems without or with limited anomaly data. Apart from the scarcity, the diversity of anomaly data is also worth being researched. Particularly, with only few types of anomalous data, how would it affect the anomaly detection performances? Also, other than assuming there is no anomaly data available, we believe the more practical problem is to know how many data need to be collected for real industrial applications. One future work direction can be to measure the sufficiency of anomalous data. Moreover, our initiative regarding developing a reconstruction-based

method is due to its nature of visual explainability for anomalous data. Though qualitative analysis demonstrated different reconstruction directions towards normal and abnormal data, the reconstructed images are less expressive for detailed anomaly features. Future works may target at improving the visual explainability to disclose more finegrained and critical anomaly features in a contrastive manner by taking the advantages contextual adversarial information . Meanwhile, as a general paradigm, we also believe that our method can extend to other anomaly tasks (e.g. audio, ECG data).

## References

Agrawal, S., Agrawal, J., 2015. Survey on anomaly detection using data mining techniques. Procedia Computer Science 60, 708-713. doi: 10. 1016/j.procs.2015.08.220 .

- Akcay, S., Atapour-Abarghouei, A., Breckon, T.P., 2019b. SkipGANomaly: Skip connected and adversarially trained encoder-decoder anomaly detection, in: 2019 International Joint Conference on Neural Networks (IJCNN), IEEE.
- Akcay, S., Atapour-Abarghouei, A., Breckon, T.P., 2019a. GANomaly: Semi-supervised anomaly detection via adversarial training, in: Computer Vision - ACCV 2018. Springer International Publishing, Cham. Lecture notes in computer science, pp. 622-637.
- Borkowski, A.A., Bui, M.M., Thomas, L.B., Wilson, C.P., Deland, L.A., Mastorides, S.M., 2019. Lung and colon cancer histopathological image dataset (lc25000). ArXiv abs/1912.12142.
- Caron, M., Misra, I., Mairal, J., Goyal, P., Bojanowski, P., Joulin, A., 2020. Unsupervised learning of visual features by contrasting cluster assignments, in: Proceedings of Advances in Neural Information Processing Systems (NeurIPS).
- Bottou, L., 2010. Large-scale machine learning with stochastic gradient descent, in: Proceedings of COMPSTAT'2010. Physica-Verlag HD, pp. 177-186. doi: 10.1007/978-3-7908-2604-3\_16 .
- Chen, T., Kornblith, S., Norouzi, M., Hinton, G., 2020a. A simple framework for contrastive learning of visual representations. arXiv preprint arXiv:2002.05709 .
- Chen, X., Fan, H., Girshick, R., He, K., 2020c. Improved baselines with momentum contrastive learning. arXiv preprint arXiv:2003.04297 .
- Chen, T., Kornblith, S., Swersky, K., Norouzi, M., Hinton, G., 2020b. Big self-supervised models are strong semi-supervised learners. arXiv preprint arXiv:2006.10029 .
- Chen, X., He, K., 2021. Exploring simple siamese representation learning, in: 2021 IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR), IEEE. URL: https://doi.org/10.1109/cvpr46437.2021. 01549 , doi: 10.1109/cvpr46437.2021.01549 .
- Cho, H., Seol, J., goo Lee, S., 2021. Masked contrastive learning for anomaly detection, in: Proceedings of the Thirtieth International Joint Conference on Artificial Intelligence, International Joint Conferences on Artificial Intelligence Organization. URL: https://doi.org/10.24963/ ijcai.2021/198 , doi: 10.24963/ijcai.2021/198 .
- Cheng, H., Liu, H., Gao, F., Chen, Z., 2020. ADGAN: A scalable GANbased architecture for image anomaly detection, in: 2020 IEEE 4th Information Technology, Networking, Electronic and Automation Control Conference (ITNEC), IEEE. doi: 10.1109/itnec48623.2020.9085163 .
- Daniel, T., Kurutach, T., Tamar, A., 2021. Deep variational semi-supervised novelty detection, in: Deep Generative Models and Downstream Applications Workshop of Proceedings of Advances in Neural Information Processing Systems (NeurIPS).
- Dosovitskiy, A., Springenberg, J.T., Riedmiller, M., Brox, T., 2014. Discriminative unsupervised feature learning with convolutional neural networks, in: Proceedings of the 27th International Conference on Neural Information Processing Systems - Volume 1, MIT Press, Cambridge, MA, USA. p. 766-774.