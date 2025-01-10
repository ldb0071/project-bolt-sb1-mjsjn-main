Page 63

Pinaya et al. [5] used ROC , AUCPRC , FPR 95, FPR 99, and FPR 999 evaluation indexes to measure the performance of near OOD tasks and far OOD tasks. Wang et al. [55] used FAR , Missing Alarm Rate ( MAR ) evaluation indexes. Similar to the calculation method of evaluation indexes such as TPR , FPR , FAR , MAR is calculated as follows:

MAR = FN FN + TP (59)

Mishra et al. [45] used different evaluation indexes based on different datasets. They used PRO on MVTec and BTAD datasets and AUC on MNIST datasets. Wang et al. [136] additionally used Overall Accuracy ( OA ) and Intersection over Union ( IoU ) evaluation indexes. IoU is originally used as an evaluation index for semantic segmentation tasks, and its calculation equation is as follows:

IoU = target ∧ precision target ⋃ precision (60)

However, the calculation method of OA is not much different from general ACC , which simply measures the overall accuracy under the multiple categories' fine granularity. Ma et al. [140] additionally used the AUC -PR evaluation index based on the