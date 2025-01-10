Page 1

## Anomaly Detection with Inexact Labels

Tomoharu Iwata 1

Machiko Toyoda 2

Shotaro Tora 2

Naonori Ueda 1

1 NTT Communication Science Laboratories 2 NTT Software Innovation Center

## Abstract

We propose a supervised anomaly detection method for data with inexact anomaly labels, where each label, which is assigned to a set of instances, indicates that at least one instance in the set is anomalous. Although many anomaly detection methods have been proposed, they cannot handle inexact anomaly labels. To measure the performance with inexact anomaly labels, we define the inexact AUC, which is our extension of the area under the ROC curve (AUC) for inexact labels. The proposed method trains an anomaly score function so that the smooth approximation of the inexact AUC increases while anomaly scores for non-anomalous instances become low. We model the anomaly score function by a neural network-based unsupervised anomaly detection method, e.g., autoencoders. The proposed method performs well even when only a small number of inexact labels are available by incorporating an unsupervised anomaly detection mechanism with inexact AUC maximization. Using various datasets, we experimentally demonstrate that our proposed method improves the anomaly detection performance with inexact anomaly labels, and outperforms existing unsupervised and supervised anomaly detection and multiple instance learning methods.