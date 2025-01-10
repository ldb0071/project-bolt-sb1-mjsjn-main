Page 9

We used 70% of the non-anomalous instances and ten inexact anomaly sets for training, 15% of the non-anomalous instances and five inexact anomaly sets for validation, and the remaining instances

Table 2: Statistics of datasets used in our experiments. |A| is the number of anomalous instances, |N| is the number of non-anomalous instances, and D is the number of attributes.

| Data             |   |A| |   |N| |   |A| |N| |    D |
|------------------|-------|-------|-----------|------|
| Annthyroid       |   350 |  6666 |     0.053 |   21 |
| Cardiotocography |   413 |  1655 |     0.25  |   21 |
| InternetAds      |   177 |  1598 |     0.111 | 1555 |
| KDDCup99         |   246 | 60593 |     0.004 |   79 |
| PageBlocks       |   258 |  4913 |     0.053 |   10 |
| Pima             |   125 |   500 |     0.25  |    8 |
| SpamBase         |   697 |  2788 |     0.25  |   57 |
| Waveform         |   100 |  3343 |     0.03  |   21 |
| Wilt             |    93 |  4578 |     0.02  |    5 |

for testing. The number of instances in an inexact anomaly set was five with training and validation data, and one with test data; the test data contained only exact anomaly labels. For each inexact anomaly set, we included an anomalous instance, and the other instances were non-anomalous. For the evaluation measurement, we used AUC on test data. For each dataset, we randomly generated ten sets of training, validation and test data, and calculated the average AUC over the ten sets.

## 5.2 Comparing methods

We compared our proposed method with the following 11 methods: LOF, OSVM, IF, AE, KNN, SVM, RF, NN, MIL, SIF and SAE. LOF, OSVM, IF and AE are unsupervised anomaly detection methods, where attribute x is used for calculating the anomaly score, but the label information is not used for training. KNN, SVM, RF, NN, MIL, SIF, SAE and our proposed method are supervised anomaly detection methods, where both the attribute x and the label information are used. Since KNN, SVM, RF, NN, SIF and SAE cannot handle inexact labels, they assume that all the instances in the inexact anomaly sets are anomalous. For hyperparameter tuning, we used the AUC scores on the validation data with LOF, OSVM, IF, AE, KNN, SVM, RF, NN, SIF and SAE, and inexact AUC with MIL and our proposed method. We used the scikit-learn implementation (Pedregosa et al., 2011) with LOF, OSVM, IF, KNN, SVM, RF and NN.

LOF , which is the local outlier factor method (Breunig et al., 2000), unsupervisedly detects anomalies based on the degree of isolation from the surrounding neighborhood. The number of neighbors was tuned from { 1 , 3 , 5 , 15 , 35 } using the validation data.

OSVM is the one-class support vector machine (Scholkopf et al., 2001), which is an extension of the support vector machine (SVM) for unlabeled data. OSVM finds the maximal margin hyperplane, which separates the given non-anomalous data from the origin by embedding them in a high-dimensional space by a kernel function. We used the RBF kernel, its kernel hyperparameter was tuned from { 10 -3 , 10 -2 , 10 -1 , 1 } , and hyperparameter ν was tuned from { 10 -3 , 5 × 10 -3 , 10 -2 , 5 × 10 -2 , 10 -1 , 0 . 5 , 1 } .