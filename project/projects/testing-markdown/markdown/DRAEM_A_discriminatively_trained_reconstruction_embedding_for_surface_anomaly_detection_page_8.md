Page 8

increases the performance error. These annotation ambiguities also impact the AP score of the evaluated methods.

Table 2. Results for the task of anomaly localization on the MVTec dataset (AUROC / AP).

| Class      | US[4]       | RIAD[31]    | PaDim[11]   | DRÆM        |
|------------|-------------|-------------|-------------|-------------|
| bottle     | 97.8 / 74.2 | 98.4 / 76.4 | 98.2 / 77.3 | 99.1 / 86.5 |
| capsule    | 96.8 / 25.9 | 92.8 / 38.2 | 98.6 / 46.7 | 94.3 / 49.4 |
| grid       | 89.9 / 10.1 | 98.8 / 36.4 | 97.1 / 35.7 | 99.7 / 65.7 |
| leather    | 97.8 / 40.9 | 99.4 / 49.1 | 99.0 / 53.5 | 98.6 / 75.3 |
| pill       | 96.5 / 62.0 | 95.7 / 51.6 | 95.7 / 61.2 | 97.6 / 48.5 |
| tile       | 92.5 / 65.3 | 89.1 / 52.6 | 94.1 / 52.4 | 99.2 / 92.3 |
| transistor | 73.7 / 27.1 | 87.7 / 39.2 | 97.6 / 72.0 | 90.9 / 50.7 |
| zipper     | 95.6 / 36.1 | 97.8 / 63.4 | 98.4 / 58.2 | 98.8 / 81.5 |
| cable      | 91.9 / 48.2 | 84.2 / 24.4 | 96.7 / 45.4 | 94.7 / 52.4 |
| carpet     | 93.5 / 52.2 | 96.3 / 61.4 | 99.0 / 60.7 | 95.5 / 53.5 |
| hazelnut   | 98.2 / 57.8 | 96.1 / 33.8 | 98.1 / 61.1 | 99.7 / 92.9 |
| metal nut  | 97.2 / 83.5 | 92.5 / 64.3 | 97.3 / 77.4 | 99.5 / 96.3 |
| screw      | 97.4 / 7.8  | 98.8 / 43.9 | 98.4 / 21.7 | 97.6 / 58.2 |
| toothbrush | 97.9 / 37.7 | 98.9 / 50.6 | 98.8 / 54.7 | 98.1 / 44.7 |
| wood       | 92.1 / 53.3 | 85.8 / 38.2 | 94.1 / 46.3 | 96.4 / 77.7 |
| avg        | 93.9 / 45.5 | 94.2 / 48.2 | 97.4 / 55.0 | 97.3 / 68.4 |

## 4.2. Ablation Study

The DRÆM design choices are analyzed by groups of experiments evaluating (i) the method architecture, (ii) the choice of anomaly appearance patterns and (iii) low perturbation example generation. Results are visually grouped by shades of gray in Table 3.

Architecture. The DRÆM reconstructive sub-network impact on the downstream surface anomaly detection performance is evaluated by removing it from the pipeline and training the discriminative sub-network alone. The results are shown in Table 3, experiment Disc. Note a reduction in performance in comparison to the full DRÆM architecture (Table 3, experiment DRÆM). The performance drop is due to overfitting of the discriminative sub-network to the simulated anomalies, which are not a faithful representation of the real ones.

Next, the discriminative power of the reconstructive subnetwork alone is analyzed by evaluating it as an autoencoder-based surface anomaly detector. The reconstructed image output of the sub-network is compared to the input image using the SSIM function [27] to generate the anomaly map. The results of this approach are shown in Table 3, experiment Recon.-AE. Recon.-AE outperforms the recent auto-encoder-based surface anomaly detection method AESSIM[5] (see results in Table 2) This suggests that simulated anomaly training introduces additional information into the auto-encoder-based training, but judging by the performance gap to DRÆM, the SSIM similarity function may not be optimal for extraction of the anomaly information. Indeed, using the recently proposed similarity function MSGMS[31] (Recon.-AE MSGMS ) improves the performance, but the results are still significantly worse than when using the entire DRÆM architecture, which indicates that both reconstructive and discriminative parts are required for optimal results.

To further emphasize the contribution of the DRÆM backbone, we replace it entirely by the recent state-of-theart supervised discriminative surface anomaly detection network [6] and re-train with the simulated anomalies (Table 3, Boˇziˇc et al .). Performance substantially drops, which further supports the power of learning the anomaly deviation extent from normality rather than the anomaly or normality appearance .

Anomaly appearance patterns. DRÆM is re-trained using ImageNet [12] as the texture source in the anomaly simulator to study the influence of the anomaly generation dataset (DRÆM ImageNet in Table 3). Results are comparable to using the much smaller DTD [9] dataset. Figure 9 shows the performance at various anomaly source dataset sizes. Results suggest that the augmentation and opacity randomization substantially contribute to performance allowing remarkably small number of texture images (less than 10). As an extreme case, the anomaly textures are

Figure 8. Qualitative examples. The original image, the anomaly map overlay, the anomaly map and the ground truth map are shown.

<!-- image -->