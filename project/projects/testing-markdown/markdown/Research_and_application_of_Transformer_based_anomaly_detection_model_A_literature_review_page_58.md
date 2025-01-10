Page 58

FAR 95 is the probability that a negative example (OOD) is misclassified as a positive example (ID) at a TPR of 95%. In this case, a lower value indicates better performance. Manolache et al.[43] additionally used the AUPR evaluation index. The biggest difference between AUPR and AUC is that it is suitable for highly unbalanced datasets. GTF [31] additionally uses the IRLbl evaluation index to quantify the degree imbalance in the dataset and the Matthews Correlation Coefficient ( MCC ) evaluation index. The calculation method is as follows:

N = TN + TP + FN + FP (50)

S = TP + FN N (51)

P = TP + FP N (52)

MCC = TP/N -S × P √ P × S × (1 -S ) × (1 -P ) (53)