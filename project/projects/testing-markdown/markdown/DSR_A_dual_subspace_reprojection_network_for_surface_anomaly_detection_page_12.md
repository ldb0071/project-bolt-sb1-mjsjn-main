Page 12

Comparison with the state-of-the-art The results of unsupervised surface anomaly detection methods are shown in Table 1. DSR significantly outperforms other state-of-the-art unsupervised methods such as MAD [17], PaDim [7] and DRAEM[21], achieving higher AP scores for anomaly detection and localization. It outperforms the previous best image-level AP score by 7 . 9 p.p. Qualitative examples of the unsupervised DSR are presented in Figure 7 and show that despite a quite heterogeneous normal appearance, that can also be observed in Figure 6, the visual defects are successfully detected and localized.

Extension to supervised learning In contrast to most of the unsupervised visual anomaly detection methods, DSR can also utilise pixel-level anotations, if they are available, making it applicable in low-shot anomaly detection scenarios. We evaluated the proposed approach in the supervised setting. Table 2 shows the comparison with the method from [6] that is specifically designed for supervised defect detection and can operate with various levels of supervision. In KSDD2, there are 246 anomalous samples available, and if image-level labels are available but none of them is segmented, the method [6] operates in the weakly supervised mode ( N = 0).

Table 1. Anomaly detection ( AP det ) and localization ( AP loc ) on the KSDD2 dataset.

|        |      |      |   Method US [4] MAD [17] DRÆM [21] PaDim [7] DSR |      |      |
|--------|------|------|--------------------------------------------------|------|------|
| AP det | 65.3 | 79.3 |                                             77.8 | 55.6 | 87.2 |
| AP loc | -    | -    |                                             42.4 | 45.3 | 61.4 |

The completely unsupervised DSR, without taking these additional positive training samples into account, outperforms the weakly supervised method [6] for 13.9 p.p. in AP det and achieves a good localization result, whereas [6] is unable to produce meaningful segmentation maps. When a number of anomalous training images are also segmented ( N > 0), the results improve even further, and significantly outperform the results of [6]. When using the full annotated training set of 246 segmented examples, DSR achieves anomaly detection performance near that of the fully supervised method [6] and outperforms the recent fully supervised method presented in [10]. Furthermore, DSR achieves the highest localization performance AP loc under all training settings, significantly outperforming [6]. These results demonstrate that DSR can efficiently work in supervised settings as well, utilising all information available.

Table 2. Anomaly detection and localization on the KSDD2 dataset in a supervised settings w.r.t. number of used anomalous training images N with ground truth masks.

|        | Method N :   | 0         | 16                  | 53             | 246   |
|--------|--------------|-----------|---------------------|----------------|-------|
|        | [6]          | 73.3 83.2 |                     | 89.1           | 95.4  |
|        | DSR          |           |                     | 87.2 91.4 94.6 | 95.2  |
|        | [10]         | -         | -                   | -              | 93.3  |
| AP loc | [6]          | 1.0       | 45.1                | 52.2           | 67.6  |
| AP loc | DSR          |           | 61.4 71.2 81.6 85.5 |                |       |