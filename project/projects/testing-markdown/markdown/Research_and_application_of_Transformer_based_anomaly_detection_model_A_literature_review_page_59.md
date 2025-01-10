Page 59

MCC coefficients can be classified as a measure of binary quality. Wu et al. [56] used AUC evaluation index for image-level fine-grained anomalies and per-regionoverlap ( PRO ) [155] evaluation index for pixel-level fine-grained anomalies. The PRO

index is employed to construct a performance curve by varying thresholds and calculating the area under the curve as a comprehensive evaluation metric. It quantifies PRO values at different thresholds, assessing the model's classification performance for each threshold by measuring the relative overlap between the binarized connected domain and the ground truth graph. Zhang et al. [129] additionally adopted Visual Information Fidelity ( V IF ) [156] and Equal Error Rate ( EER ). Podolskiy et al. [121] adopted ROC , AUPRooD , FPR @ X , etc. AUPRooD is essentially not significantly different from the calculation method of AUPR , while FPR @ X is calculated according to the difference of X . if X is ID , then ID is considered positive. If X is OOD , then OOD is considered positive. Li et al. [65] used AUC and Average Precision ( AP ) evaluation indexes. AP is the average value of Precision . Li et al. [40] proposed a new evaluation index ParsingAccuracy . The calculation method is as follows:

PA = count ( correct event ID group ) count ( all event ID group ) (54)

It is used to measure the ratio of correctly parsed log messages to the total number of log messages.

Doshi et al. [91] systematically specified the shortcomings of existing evaluation indexes and proposed a series of evaluation indexes for time series anomaly detection, as shown below: