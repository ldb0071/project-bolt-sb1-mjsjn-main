Page 9

es

Scor

es

Scor

Figure 4: Class-wise box plot. Up: box plot for CIFAR10 dataset. Bottom: box plot for CIFAR100 dataset. Blue boxes represent the model trained with 5% anomaly data, while red boxes represent the model trained with 20% anomaly data. We randomly picked 10 classes out of the CIFAR100 dataset for demonstration purpose.

<!-- image -->

detection tasks when detecting significant anomaly features in such highly structured medical imaging data.

## 6. Ablation Study

This section performs a series of ablation studies to understand how our proposed method worked. Specifically, we explore the effectiveness of our proposed Contextual Adversarial Information , as well as the value of the anomaly distributions. Then we further conduct statistical analysis to explore the effectiveness of the increasing amount of anomaly data. In this section, we use UNet Ronneberger, Fischer and Brox (2015) as the backbone generator, and all experiment settings are as same as in Section 4.

## 6.1. Contextual Adversarial Information

This subsection demonstrates the effectiveness of the proposed contextual adversarial information . As aforementioned, we expect to improve the data-efficiency by generating pseudo-anomaly data when none or small number of anomaly data available. Table 4 shows the our method improved model performances under limited anomaly data environment ( 𝛾 < 0 . 05 ), while the effect dimmed when sufficient supervision provided, indicating the proposed contextual adversarial information mitigated the lack of anomaly data as expected.

## 6.2. Batch Normalization for Anomaly data

As stated in Section 3.3.2, we believe batch normalization layers are critical for learning discriminative features.

Table 4

| Dataset   | C.A.     | Anomaly percentage 𝛾   | Anomaly percentage 𝛾   | Anomaly percentage 𝛾   | Anomaly percentage 𝛾   | Anomaly percentage 𝛾               |
|-----------|----------|------------------------|------------------------|------------------------|------------------------|------------------------------------|
|           |          | .00                    | .01                    | .03                    | .05                    | .10                                |
| F-MNIST   | w/o      | 98.2 ± 2.37            | 99.9±0.03              | 100. ±                 | 0.00 100. ±            | 0.00 100. ±0.05                    |
| F-MNIST   | w/       | 98.3 ± 2.21            | 100. ±                 | 0.00 100. ±            | 0.00 100. ±            | 0.00 100. ± 0.00                   |
| CIFAR10   | w/o 88.9 | ±                      | 10.43 93.8 ±           |                        |                        | 5.30 98.0±2.74 98.8±2.16 99.3±1.09 |
| CIFAR10   | w/       | 92.6 ± 7.76            | 94.8 ±                 | 6.17 98.3 ±            | 2.38 99.3 ±            | 1.15 99.9 ± 0.15                   |
| CIFAR100  | w/o      | 90.4 ± 11.5            | 95.9 ± 7.76            | 96.7 ± 7.58            | 98.8 ± 3.09            | 99.5 ± 1.65                        |
| CIFAR100  | w/       | 92.8 ± 11.5            | 97.1 ± 6.20            | 97.8 ± 4.90            | 98.8 ± 3.63            | 99.7 ± 0.80                        |