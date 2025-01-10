Page 14

Comparison with the state-of-the-art We evaluate DSR against recent state-of-the-art surface anomaly detection methods. The experimental results are presented in Tables 3 and 4 for image-level anomaly detection and for pixel-level anomaly localization, respectively, and show that DSR outperforms the recent state-of-the-art approaches. It achieves an average AUROC of 98 . 2%, while maintaining a strong anomaly localization performance with an AP score of 70 . 2%. DSR outperforms the previous top performer in anomaly detection DR AE M[21] on the mean AUROC score by 0 . 2 percentage points (p.p.) and achieves superior performance on classes such as transistor, cable, carpet and screw, where near-distribution anomalies such as deformations are more prevalent. Qualitative results on the MVTec dataset are shown in Figure 8 and demonstrate that

the detected anomalous regions resemble the ground truth anomaly maps to a high degree.

Table 4. Results (AP) of anomaly localization on MVTec dataset.

|          | Method bottle capsule grid leather pill   |      |      |      | tile      |      |   trans. zipper cable carpet hazelnut m. nut screw toothbrush wood average |           |      |      |      |      |      |      |
|----------|-------------------------------------------|------|------|------|-----------|------|----------------------------------------------------------------------------|-----------|------|------|------|------|------|------|
| [4]      | 74.2                                      | 25.9 | 10.1 | 40.9 | 62.0 65.3 | 27.1 |                                                                       36.1 | 48.2      | 52.2 | 83.5 |  7.8 | 37.7 | 53.3 | 45.5 |
| [22]     | 76.4                                      | 38.2 | 36.4 | 49.1 | 51.6 52.6 | 39.2 |                                                                       63.4 | 24.4      | 61.4 | 64.3 | 43.9 | 50.6 | 38.2 | 48.2 |
| [7]      | 77.3                                      | 46.7 | 35.7 | 53.5 | 61.2 52.4 | 72   |                                                                       58.2 | 45.4      | 60.7 | 77.4 | 21.7 | 54.7 | 46.3 | 55   |
| [21]     | 86.5                                      | 49.4 | 65.7 | 75.3 | 48.5 92.3 | 50.7 |                                                                       81.5 | 52.4      | 53.5 | 96.3 | 58.2 | 44.7 | 77.7 | 68.4 |
| DSR 91.5 |                                           | 53.3 | 68   | 62.5 | 65.7 93.9 | 41.1 |                                                                       78.5 | 70.4 78.2 |      | 67.5 | 52.5 | 74.2 | 68.4 | 70.2 |

Fig. 9. Qualitative reconstruction results. DSR far better reconstructs the anomalies by their corresponding in-distribution appearance than the state-of-the-art DRÆM [21].

<!-- image -->

Further qualitative comparison is shown in Figure 9. Both DSR and DRÆM [21] are trained to restore the normality of images corrupted by simulated anomalies. However, DRÆM [21] generates the anomalies in the image space from an outof-distribution dataset, while DSR generates the anomalies within the quantized feature space, making it more difficult for the reconstruction network to overfit to the simulated anomaly appearance. This results in DSR having a more robust image normality restoration capability that is insensitive to near-in-distribution anomalies such as deformations. Figure 9 compares the reconstruction results of both methods. Note that DSR produces a more realistic reconstruction. Due to the reconstruction network not overfitting to the synthetic anomaly appearance, DSR can recognize deformations as deviations from normality and reconstruct them accordingly.