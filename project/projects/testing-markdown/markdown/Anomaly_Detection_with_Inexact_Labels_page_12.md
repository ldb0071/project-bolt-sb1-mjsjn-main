Page 12

Figure 4 shows test AUCs averaged over the nine anomaly detection datasets by changing the number of training inexact anomaly sets (a), and by changing the number of instances per inexact anomaly set (b). The proposed method achieved the best performance in all cases. As the number of training inexact anomaly sets increased, the performance with supervised methods was improved. As the number of instances per inexact anomaly set increased, AUC was decreased since the rate of non-anomalous instances in an inexact anomaly set increased. AUC with unsupervised methods also decreased since they used inexact anomaly sets in the validation data.

Figure 5 shows test AUC on the nine anomaly detection datasets by the proposed method with different hyperparameters λ . The best hyperparameters were different across datasets. For example, a high λ was better with the Pima dataset, a low λ was better with the PageBlocks and Wilt datasets, and an intermediate λ was better with the Annthyroid and Waveform datasets. The proposed method achieved high performance with various datasets by automatically adapting λ using the validation data to control the balance of the anomaly score minimization for non-anomalous instances and inexact AUC maximization.

Figure 4: AUC averaged over the nine anomaly detection datasets (a) with different numbers of training inexact anomaly sets and five instances per inexact anomaly set, and (b) with different numbers of instances per inexact anomaly set and ten training inexact anomaly sets.

<!-- image -->

<!-- image -->

<!-- image -->

Figure 3: ROC curve and AUC on the test synthetic dataset by (a) AE, (b) SAE, (c) MIL, and (d) the proposed method. X-axis is the false positive rate, and y-axis is the true positive rate.

<!-- image -->