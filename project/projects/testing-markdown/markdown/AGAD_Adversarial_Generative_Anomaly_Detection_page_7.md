Page 7

Ours (supervised)

Figure 2: Reconstruction results for Fashion-MNIST, CIFAR10, and CIFAR100. For each dataset, 16 images are randomly chosen for visualization, including 8 anomaly images (upper) and 8 normal images (lower). Here, "ankle boot", "airplane", and "vehicle 2" are the anomalous classes for Fashion-MNIST, CIFAR10, and CIFAR100 respectively. The supervised models used here are trained with 10% anomaly data.

<!-- image -->

<!-- image -->

<!-- image -->

Fashin-MNIST

CIFAR10

CIFAR100

with around 0.2% better in MNIST, 4% better in FashionMNIST, and 15% better in CIFAR10 at each 𝛾 scale. Model performances turn to be robust with only 5% anomaly data affixed.

## 4.3. Qualitative Analysis

This section presents a qualitative analysis of our proposed AGADmethodregarding the reconstruction of anomalous and non-anomalous data. This subsection compares our reconstruction quality against GANomaly Akcay et al. (2019a). As shown in Figure 2, GANomaly reconstructs both normality and abnormality data with minor reconstruction error, while our method is designed to discriminate the reconstruction of normality and abnormality data for better anomaly detection performance. Particularly, our supervised approach identifies the expected anomalous patterns that reconstructed well for normal examples while messed up reconstructions for anomalous data.

## 5. Experiments

We further evaluate our method on real-world medical datasets. Different from the benchmark datasets, real-world anomaly features might be less significant. Images have been resized to 128x128 for retaining more information.

## 5.1. Real-world Datasets

Weexperiment on real-world medical datasets including X-ray, Brain MRI, histopathology and retinal OCT images.