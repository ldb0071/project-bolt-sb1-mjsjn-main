Page 15

the results. Since KDAD is unsupervised, it is trained with normal data only, but it is evaluated on exactly the same test data as DRA.

DevNet [35, 37] is a supervised deep anomaly detector based on a prior-based deviation. The results we report are based on the implementation provided by its authors 2 .

FLOS [28] is a deep imbalanced classifier that learns a binary classification model using the class-imbalancesensitive loss - focal loss. The implementation of FLOS is also taken from [35], which replaces the loss function of DevNet with the focal loss.

SAOE is a deep out-of-distribution detector that utilizes pseudo anomalies from both data augmentation-based and outlier exposure-based methods. Motivated by the success of using pseudo anomalies to improve anomaly detection in recent studies [26, 54], SAOE is implemented by learning both seen and pseudo abnormalities through a multiclass ( i.e ., normal class, seen anomaly class, and pseudo anomaly class) classification head using the plain feature learning method as in DRA. In addition to this multi-class classification, the outlier exposure module [18] in SAOE is implemented according to its authors 3 , in which the MVTec AD [3] or LAG [27] dataset is used as external data. In all our experiments we removed the related data from the outlier data that has any overlapping with the target data to avoid data leakage.

MLEP [30] is a deep open set anomaly detector based on margin learning embedded prediction. The original MLEP 4 is designed for open set video anomaly detection, and we adapt it to image tasks by modifying the backbone network and training settings to be consistent with DRA.

Deep SAD [45] is a supervised deep anomaly detector that extends Deep SVDD [44] by using a few labeled anomalies and normal samples to learn more compact one-class descriptors. Particularly, it adds a new marginal constraint to the original Deep SVDD that enforces a large margin between labeled anomalies and the one-class center in latent space. The implementation of DeepSAD is taken from the original authors 5 .

MINNS [62] is a deep multiple instance classification model, which is implemented based on [35].

## C. Additional Empirical Results

## C.1. Additional Comparison Results

General Setting. We report the results of DRA and two additional competing methods under general setting in Tab 7. Our method achieves the best AUC performance in eight of the nine datasets and the close-to-best AUC performance

Table 7. AUC results (mean±std) of DRA and two additional competing methods under the general setting. All methods are trained using ten random anomaly examples, with the best results are highlighted .