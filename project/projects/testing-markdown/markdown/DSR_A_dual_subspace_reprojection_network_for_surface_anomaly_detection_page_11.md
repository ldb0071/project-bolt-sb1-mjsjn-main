Page 11

<!-- image -->

Fig. 6. Normal (left) and anomalous (right) images from KSDD2. The anomalies (marked with white arrows) are very similar to the normal appearance in this dataset.

<!-- image -->

used. The test set contains 894 anomaly-free and 110 anomalous images. We follow the evaluation procedure defined in [6], with the AP metric for imagelevel anomaly detection ( AP det ), and present also anomaly localization results in terms of pixel-level AP ( AP loc ).

Additional anomalous training samples available in KSDD2 [6] enable comparison of DSR with the supervised defect detection methods. Note that, although the acquisition of anomalous examples is difficult in practice, in many cases these are available, albeit in small quantities. Most of unsupervised anomaly detection methods, however, do not, or even can not, make use of this additional information, if available. The proposed DSR method can be easily adapted to take such annotations of anomalous images into account. In addition to the generated synthetic anomalies, the real-world anomalies with known ground truth can be utilised to train the anomaly detection module.

Fig. 7. Qualitative results of the unsupervised DSR on the KSDD2 dataset: the input image, the overlaid predicted mask and the ground truth.

<!-- image -->