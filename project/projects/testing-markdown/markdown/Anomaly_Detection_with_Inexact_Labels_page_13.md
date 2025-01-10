Page 13

<!-- image -->

<!-- image -->

- (a) number of inexact anomaly sets
- (b) number of instances per inexact anomaly set

## 6 Conclusion

We proposed an extension of the AUC for inexact labels, and developed a supervised anomaly detection method for data with inexact labels. With our proposed method, we trained a neural network-based anomaly score function by maximizing the inexact AUC while minimizing the anomaly scores for nonanomalous instances. We experimentally confirmed its effectiveness using various datasets. For future work, we would like to extend our framework for semi-supervised settings (Blanchard et al., 2010), where unlabeled instances, labeled anomalous and labeled non-anomalous instances are given for training.

Table 3: AUC on nine anomaly detection datasets with ten inexact anomaly sets and five instances per set. Values in bold typeface are not statistically different (at 5% level) from the best performing method in each dataset according to a paired t-test. The Average column shows the average AUC over all datasets, and the value in bold indicates the best average AUC.

|      |   Annthyroid |   Cardiotocography |   InternetAds |   KDDCup99 |   PageBlocks |
|------|--------------|--------------------|---------------|------------|--------------|
| LOF  |        0.652 |              0.544 |         0.728 |      0.576 |        0.754 |
| OSVM |        0.525 |              0.845 |         0.814 |      0.974 |        0.877 |
| IF   |        0.768 |              0.809 |         0.549 |      0.973 |        0.924 |
| AE   |        0.754 |              0.768 |         0.839 |      0.995 |        0.915 |
| KNN  |        0.546 |              0.639 |         0.602 |      0.804 |        0.672 |
| SVM  |        0.751 |              0.725 |         0.864 |      0.708 |        0.599 |
| RF   |        0.868 |              0.806 |         0.622 |      0.895 |        0.862 |
| NN   |        0.622 |              0.702 |         0.783 |      0.975 |        0.462 |
| MIL  |        0.59  |              0.801 |         0.824 |      0.714 |        0.609 |
| SIF  |        0.829 |              0.843 |         0.622 |      0.992 |        0.932 |
| SAE  |        0.836 |              0.768 |         0.832 |      0.924 |        0.926 |
| Ours |        0.867 |              0.846 |         0.828 |      0.992 |        0.914 |

|      |   Pima |   SpamBase |   Waveform |   Wilt |   Average |
|------|--------|------------|------------|--------|-----------|
| LOF  |  0.601 |      0.546 |      0.68  |  0.709 |     0.643 |
| OSVM |  0.686 |      0.639 |      0.622 |  0.571 |     0.728 |
| IF   |  0.714 |      0.703 |      0.66  |  0.617 |     0.746 |
| AE   |  0.678 |      0.757 |      0.671 |  0.895 |     0.808 |
| KNN  |  0.536 |      0.617 |      0.627 |  0.557 |     0.622 |
| SVM  |  0.495 |      0.573 |      0.729 |  0.665 |     0.679 |
| RF   |  0.649 |      0.751 |      0.711 |  0.774 |     0.771 |
| NN   |  0.396 |      0.782 |      0.724 |  0.619 |     0.674 |
| MIL  |  0.67  |      0.66  |      0.64  |  0.474 |     0.665 |
| SIF  |  0.706 |      0.808 |      0.723 |  0.703 |     0.795 |
| SAE  |  0.662 |      0.765 |      0.728 |  0.863 |     0.812 |
| Ours |  0.713 |      0.791 |      0.746 |  0.895 |     0.844 |