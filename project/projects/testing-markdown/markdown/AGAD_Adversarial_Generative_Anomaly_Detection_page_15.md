Page 15

1

2

Figure 6: Training curve of each class in CIFAR100. Red color represents UNet++, while blue color represents UNet, and x and y-axis denotes epoch and AUC respectively.

<!-- image -->

Table 9

| Dataset --     | Generator -- Naive   | 0 - 100.   | 1 - 100.   | 2 - 99.0   | 3 - 98.6   | 4 - 99.5   | 5 - 97.2   | 6 - 99.6   | 7 - 99.8   | 8 - 95.8   | 9 - 99.2   | avg - 99.1   | SD - 0.86   |
|----------------|----------------------|------------|------------|------------|------------|------------|------------|------------|------------|------------|------------|--------------|-------------|
| MNIST          | UNet                 | 76.0       | 58.6       | 81.3       | 93.3       | 41.9       | 46.8       | 98.9       | 45.2       | 89.1       | 42.8       | 67.4         | 21.6        |
| MNIST          | UNet++               | 95.5       | 100.       | 85.4       | 78.5       | 91.4       | 92.5       | 73.6       | 90.2       | 89.6       | 89.4       | 89.4         | 7.46        |
| Fashion- MNIST | Generator            | 0          | 1          | 2          | 3          | 4          | 5          | 6          | 7          | 8          | 9          | avg          | SD          |
| Fashion- MNIST | -- Naive             | - 98.2     | - 100.     | - 99.1     | - 99.7     | - 99.0     | - 100.     | - 97.7     | - 100.     | - 99.1     | - 100.     | - 99.2       | - 0.75      |
| Fashion- MNIST | UNet                 | 95.5       | 99.8       | 99.6       | 97.1       | 99.9       | 99.9       | 93.2       | 100.       | 99.4       | 99.0       | 98.3         | 2.21        |
| Fashion- MNIST | UNet++               | 99.9       | 100.       | 100.       | 99.4       | 100.       | 100.       | 100.       | 100.       | 100.       | 100.       | 99.9         | 0.18        |
| CIFAR10        | Generator --         | 0          | 1 -        | 2          | 3          | 4          | 5          | 6          | 7 -        | 8 -        | 9          | avg          | SD          |
| CIFAR10        | Naive                | - 79.9     | 59.1       | - 64.9     | - 60.1     | - 68.9     | - 69.8     | - 88.2     | 61.3       | 83.0       | - 74.3     | - 71.0       | - 9.63      |
| CIFAR10        | UNet                 | 99.9       | 88.3       | 89.8       | 94.1       | 99.3       | 87.7       | 99.8       | 73.8       | 99.9       | 92.3       | 92.5         | 7.81        |
| CIFAR10        | UNet++               | 99.9       | 99.5       | 98.8       | 98.4       | 99.7       | 94.7       | 100.       | 93.2       | 99.9       | 98.8       | 98.3         | 2.26        |
| CIFAR100       | Generator            | 0          | 1          | 2          | 3          | 4          |            | 5          | 6          | 7          | 8          | 9            | 10          |
| CIFAR100       | -- Naive             | - 64.3     | - 90.2     | - 77.8     | - 82.0     | - 67.3     |            | - 62.7     | - 71.4     | - 77.1     | - 68.5     | - 82.8       | - 89.3      |
|                | UNet                 | 99.9       | 99.4       | 99.7       | 99.3       | 98.9       |            | 97.5       | 99.8       | 96.0       | 99.4       | 99.3         | 99.3        |
|                | UNet++               | 99.9       | 99.6       | 99.8       | 99.8       | 99.9       |            | 99.7       | 99.9       | 99.9       | 99.4       | 99.8         | 99.9        |
|                | Generator --         | 11 -       | 12         | 13         | 14         | 15         |            | 16         | 17 -       | 18         | 19         | avg          | SD          |
|                | Naive                | 56.7       | - 69.5     | - 73.3     | - 63.7     | - 65.0     | - 67.4     |            | 81.2       | - 61.0     | - 70.7     | - 71.6       | - 8.87      |
|                | UNet                 | 96.3       | 99.8       | 74.7       | 78.9       | 62.6       | 95.6       |            | 95.5       | 66.8       | 96.9       | 92.8         | 11.5        |
|                | UNet++               | 99.1       | 99.9       | 86.4       | 96.9       | 61.7       |            | 99.0       | 99.8       | 86.5       | 99.7       | 96.3         | 8.88        |

One-class semi-supervised anomaly detection benchmark performances. We reported the average AUC in % that is computed over 3 runs. Bold numbers represent the best results.

## B. Additional Experiments

This section briefly discussed some considerations on different backbones of generators.

## B.1. Choices of generator backbones

As shown in Table 9, the UNet Ronneberger et al. (2015) structure performed worst for Fashion-MNIST, and even failed for MNIST dataset with 31.7% performance drop against the naive generator. As stated by Zhou et al. (2020), the straight-away skip-connection of UNet causes semantic gaps between the feature maps of the encoder and decoder sub-networks. We suspect that the semantic gaps would highly ease the feature representation learning when reconstructing simple data like MNIST. Since both normal and abnormal of simple data can be reconstructed easily, the model fails to detect anomalies based on reconstruction errors. UNet++ Zhou et al. (2020) addressed this problem by introducing dense skip pathways for better feature learning , thus retaining discriminative reconstruction capability for normal and abnormal data. Presumably, by alleviating the semantic gaps , UNet++ demonstrated smoother training curves compared to UNet as shown in Figure 6.

We compared different backbone architectures of generators across the benchmark datasets. An overview of the chosen architectures is presented in Appendix A.2, and the experiment results are shown in Table 9. Surprisingly, the naive generator significantly outperformed advanced frameworks like UNet or UNet++ for MNIST. We hereby replaced our UNet++ backbone generator with the naive encoderdecoder for MNIST dataset in the Section 4.2.

As a result, for the simple datasets without complex patterns, the naive generator might be a yet best solution for relatively good performances as well as its smaller parameter size and faster inferencing speed, While UNet++ may fit more complex scenarios that need more advanced feature extraction.

## References

Ronneberger, O., Fischer, P., Brox, T., 2015. U-net: Convolutional networks for biomedical image segmentation, in: Navab, N., Hornegger, J., Wells, W.M., Frangi, A.F. (Eds.), Medical Image Computing and ComputerAssisted Intervention - MICCAI 2015, Springer International Publishing, Cham. pp. 234-241.

Zhou, Z., Siddiquee, M.M.R., Tajbakhsh, N., Liang, J., 2020. UNet++: Redesigning skip connections to exploit multiscale features in image segmentation. IEEE Transactions on Medical Imaging 39, 1856-1867. doi: 10.1109/tmi.2019.2959609 .