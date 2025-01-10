Page 6

Figure 4. Simulated anomaly generation process. The binary anomaly mask M a is generated from Perlin noise P . The anomalous regions are sampled from A according to M a and placed on the anomaly free image I to generate the anomalous image I a .

<!-- image -->

<!-- image -->

<!-- image -->

Figure 5. The original anomaly source image (left) can be augmented several times (center) to generate a wide variety of simulated anomalous regions (right).

<!-- image -->

## 4. Experiments

DRÆM is extensively evaluated and compared with the recent state-of-the-art on unsupervised surface anomaly detection and localization. Additionally, individual components of the proposed method and the effectiveness of training on simulated anomalies are evaluated by an ablation study. Finally, the results are placed in a broader perspective by comparing DRÆM with state-of-the-art weaklysupervised and fully-supervised surface-defect detection methods.

## 4.1. Comparison with unsupervised methods

DRÆM is evaluated on the recent challenging MVTec anomaly detection dataset [3], which has been established as a standard benchmark dataset for evaluating unsupervised surface anomaly detection methods. We evaluate DRÆM on the tasks of surface anomaly detection and localisation. The MVTec dataset contains 15 object classes with a diverse set anomalies which enables a general evaluation of surface anomaly detection methods. Anomalous examples of the MVTec dataset are shown in Figure 8. For evaluation, the standard metric in anomaly detection, AUROC, is used. Image-level AUROC is used for anomaly detection and a pixel-based AUROC for evaluating anomaly localization [5, 24, 17, 26]. The AUROC, however, does not reflect the localization accuracy well in surface anomaly detection setups, where only a small fraction of pixels are anomalous. The reason is that false positive rate is dominated by the a-priori very high number of non-anomalous pixels and is thus kept low despite of false positive detections. We thus additionally report the pixel-wise average precision metric (AP), which is more appropriate for highly imbalanced classes and in particular for surface anomaly detection, where the precision plays an important role.

In our experiments, the network is trained for 700 epochs on the MVTec anomaly detection dataset [3]. The learning rate is set to 10 -4 and is multiplied by 0 . 1 after 400 and 600 epochs. Image rotation in the range of ( -45 , 45) degrees is used as a data augmentation method on anomaly free images during training to alleviate overfitting due to the relatively small anomaly-free training set size. The Describable Textures Dataset [9] is used as the anomaly source dataset.