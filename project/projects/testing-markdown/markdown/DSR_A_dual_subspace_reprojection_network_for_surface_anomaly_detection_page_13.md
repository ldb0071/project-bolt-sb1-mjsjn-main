Page 13

## 4.3 Experimental results on MVTec

We also perform experiments on the MVTec anomaly detection dataset [3], which contains 15 different texture and object classes, and has been established as the standard surface anomaly evaluation benchmark [11,7,21,17]. The training set

Fig. 8. Qualitative results on the MVTec dataset: the input images, outputs of the reconstruction network, input images with overlaid output masks, the output masks and the ground truth masks are shown in individual rows.

<!-- image -->

consists only of anomaly-free images, while the test set is comprised of anomalous as well as anomaly-free images. The widely used AUROC metric is applied for image-level anomaly detection. Because only a fraction of the pixels in the test set are anomalous, the pixel-wise average-precision metric AP [21] is used to evaluate the anomaly localization performance. It is more robust to class imbalance and better suited for anomaly localization evaluation than the commonly used pixelwise AUROC.

Table 3. Results of anomaly detection on MVTec dataset (AUROC) with the average score over all classes ( avg ) in the last column.

|      |   Method bottle capsule grid leather pill |      |       |       |               |       |      |       |       |      |      |       | tile trans. zipper cable carpet hazelnut m. nut screw toothbrush wood average   |      |
|------|-------------------------------------------|------|-------|-------|---------------|-------|------|-------|-------|------|------|-------|---------------------------------------------------------------------------------|------|
| [4]  |                                      99   | 86.1 |  81   |  88.2 | 87.9 99.1     |  91.9 | 86.2 |  91.6 |  93.1 | 82   | 54.9 |  95.3 | 81.8 97.7                                                                       | 87.7 |
| [22] |                                      99.9 | 88.4 |  99.6 | 100   | 83.8 98.7     |  98.1 | 81.9 |  84.2 |  83.3 | 88.5 | 84.5 | 100   | 90.9 93.0                                                                       | 91.7 |
| [17] |                                     100   | 92.3 |  92.9 | 100   | 83.3 97.4     |  97.9 | 94   |  95.5 |  98.7 | 93.1 | 81.2 |  95.8 | 95.9 97.6                                                                       | 94.4 |
| [7]  |                                      99.8 | 91.5 |  95.7 | 100   | 94.4 97.4     |  90.9 | 92.2 |  99.9 |  93.3 | 99.2 | 84.4 |  97.2 | 97.8 98.8                                                                       | 95.5 |
| [11] |                                      98.2 | 98.2 | 100   | 100   | 94.9 94.6     |  99.9 | 81.2 |  93.9 |  98.3 | 99.9 | 88.7 |  99.4 | 96.1 99.1                                                                       | 96.1 |
| [21] |                                      99.2 | 98.5 |  99.9 | 100   | 98.9 99.6     | 100   | 91.8 |  97   | 100   | 98.7 | 93.9 | 100   | 93.1 99.1                                                                       | 98   |
| DSR  |                                     100   | 98.1 | 100   | 100   | 97.5 100 97.8 | 100   | 93.8 | 100   |  95.6 | 98.5 | 96.2 |  99.7 | 96.3                                                                            | 98.2 |