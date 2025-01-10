Page 8

generate pseudo-anomalies during the training phase, the core functionality of our model during inference strictly adheres to the principles of reconstruction-based anomaly detection. Though object detection methods have shown superior performance on the datasets described in Section 4, they are limited in practical application due to their incapability of detecting non-object related anomalies, such as explosions or debris falling off of buildings. Therefore, we strictly compare our methodology to other reconstructionbased methods. This strategic choice differentiates our work from methods reliant on object detection or frame prediction techniques for anomaly identification.

To quantitatively assess the performance of our model in video anomaly detection tasks, we employ a detailed anomaly scoring mechanism. Each frame's anomaly score is derived by computing the Euclidean distance at the pixel level between the frame and its reconstructed counterpart. To refine this evaluation, the calculated distances are segmented into patches sized 16 × 16 , with the frame score determined by the highest mean value among these patch scores.

Table 1. Comparative AUC Scores across Ped2, Avenue, and ShanghaiTech datasets. The table presents the AUC performance of our DDL model against a range of competing methodologies, highlighting the best performing results in bold.

| Method           | Year   |   Ped2 |   Avenue | SHT   |
|------------------|--------|--------|----------|-------|
| AE-Conv2D [15]   | 2016   |  90    |    70.2  | 60.85 |
| AE-Conv3D [42]   | 2017   |  91.2  |    71.1  | -     |
| AE-ConvLSTM [27] | 2017   |  88.1  |    77    | -     |
| TSC [26]         | 2017   |  91.03 |    80.56 | 67.94 |
| StackRNN [26]    | 2017   |  92.21 |    81.71 | 68.00 |
| MemAE [14]       | 2019   |  94.1  |    83.3  | 71.20 |
| MNAD [30]        | 2020   |  90.2  |    82.8  | 69.80 |
| PseudoBound [3]  | 2023   |  98.44 |    87.1  | 73.66 |
| MAMC[29]         | 2024   |  96.7  |    87.6  | 71.50 |
| C 2 Net [20]     | 2024   |  98    |    87.5  | -     |
| C3DSU with DDL   | Ours   |  98.46 |    90.35 | 74.25 |

The performance of our proposed methodology, as quantified through the Area Under the Curve (AUC) scores across three benchmark datasets, demonstrates its superior capability in detecting anomalies within video sequences. Table 1 showcases a comparative analysis of our model, denoted as C3DSU with DDL, against a variety of established methods in the field.

On the Ped2 dataset [25], our approach achieves an AUC score of 98.46 %, surpassing the previous state-of-the-art, PseudoBound [3], by a slight margin. This indicates an improvement in the model's ability to detect anomalies, illustrating the effectiveness of the dynamic anomaly weighting and distinction loss mechanism implemented in our methodology.

In the context of the Avenue dataset [32], our DDL model demonstrates a notable leap in performance, registering an AUC score of 90.35 %. This represents not only an improvement over the PseudoBound method [3] but also a substantial advancement compared to other reconstructionbased approaches such as MemAE [14] and MNADReconstruction [30]. The results underscore our method's adeptness at handling the dataset's complex anomaly scenarios, further establishing the efficacy of incorporating pseudo-anomalies in training to enhance anomaly detection accuracy.

For the ShanghaiTech (SHT) dataset [21], our model achieves an AUC of 74.25% , representing the best performing model amongst those compared. It is important to note that, in addressing the SHT dataset's diverse and dynamic anomaly instances, we trained a unique model for each scene, acknowledging that each scene warrants a different anomaly weight, σ ( ℓ ) . This scene-specific approach allows for a more tailored anomaly detection mechanism, catering to the unique characteristics and challenges of each scene. The median score of all scenes is then taken to represent the overall performance on the SHT dataset. This methodological nuance underscores the adaptability of our approach, demonstrating its robustness across varied surveillance contexts despite the inherent challenges of the SHT dataset.

## 6. Ablation Studies

To elucidate the impact of Dynamic Distinction Learning (DDL) on video anomaly detection, we conducted ablation studies comparing the performance of two models, UNet and Conv3DSkipUNet (C3DSU), on the Ped2 and Avenue datasets, both with and without the implementation of DDL. The UNet model serves as a baseline, employing a traditional architecture without the convolutional 3D (Conv3D) layers between skip connections, and processes single frames independently. In contrast, the C3DSU model, designed for temporal data analysis, incorporates Conv3D layers between skip connections to capture temporal dynamics between frames.

The terminology used to describe the training configurations of the models-specifically, 'without DDL', 'with SDL', and 'with DDL'-reflects the incorporation of our Dynamic Distinction Learning (DDL) framework at different levels. The 'without DDL' configuration represents the standard reconstruction training process where the models, UNet and Conv3DSkipUNet (C3DSU), are trained purely on the task of reconstructing normal frames, leveraging only the reconstruction loss and omitting the introduction of pseudo anomalies. In contrast, the 'with SDL' (Static Distinction Learning) setup incorporates both the reconstruction loss and a static version of the distinction loss, where the anomaly weight, σ ( ℓ ) , is fixed at 0.5 and not subject to training adjustments. This static distinction approach aims

to introduce a consistent level of challenge in distinguishing anomalies but lacks the adaptability of dynamic weighting. Finally, 'with DDL' employs our proposed methodology, integrating the dynamic anomaly weighting mechanism alongside the distinction loss into the training of the models.