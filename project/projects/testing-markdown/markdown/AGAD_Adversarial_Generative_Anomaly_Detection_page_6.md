Page 6

## 4.2. Results

Several benchmarks are performed in this section with a common metric of AUROC (Area Under the Curve of Receiver Operating Characteristics), shown in % format. The experiments were performed on a Nvidia A40 GPU under PyTorch v1.10.1, Python 3.9.7, and CUDA 11.4, with 𝑏𝑎𝑡𝑐ℎ𝑠𝑖𝑧𝑒 = 256 , 𝑙𝑒𝑎𝑟𝑛𝑖𝑛𝑔𝑟𝑎𝑡𝑒 = 0 . 0002 with Adam optimizers and hyperparameter settings as 𝜆 𝑎𝑑𝑣 = 1 , 𝜆 𝑐𝑜𝑛 = 50 , 𝜆 𝑎𝑑𝑐𝑜𝑛 = 15 , 𝜆 𝑙𝑎𝑡 = 5 . To solely test the proposed method, no data augmentation is performed apart from image normalization. Notably, this section presented the common one-class anomaly detection performance, which means each model is trained on one single class, and tested against all other classes.

## 4.2.1. Semi-supervised Anomaly Detection

We compared our method with several influential and performant reconstruction-based semi-supervised deep anomaly detection models, including AnoGAN Schlegl et al. (2017b), OCGAN Perera et al. (2019), GeoTrans Golan and El-Yaniv (2018), ARNet Ye et al. (2022), and ADGAN Cheng et al. (2020). Table 1 illustrated the results across those models and the benchmarking datasets. The 0-9 headers represent the corresponding 10 classes for MNIST, Fashion-MNIST and CIFAR10 datasets, while the 0-19 headers represent the 20 coarse classes of CIFAR100. "SD" means standard deviation among classes. Detailed index-class mapping refers to Appendix A.1. As shown in Table 1, the average AUC show significant improvement against other methods with 0.8% better in MNIST, 6.0% better in Fashion MNIST, 4.5% better in CIFAR10, and 12.8% better in CIFAR100.

## 4.2.2. Anomaly Detection with Limited Supervision

Table 2 shows the benchmarking results when limited anomaly supervision brought in. Here, we compared with several supervised anomaly detection methods like Deep SAD Ruff et al. (2020), TLSAD Feng et al. (2021), and ESAD Huang et al. (2021). In this experiment, we gradually increased the involvement percentage 𝛾 of anomaly data. Here, anomaly percentage 𝛾 represented 𝛾 = 𝑎 𝑛 + 𝑎 where 𝑛 and 𝑎 are the number of normal and abnormal images respectively. Also, an average of three runs is recorded for each class and each dataset to mitigate the selection bias whilst data sampling. As we observed, our method can significantly improve the model performances with 𝛾 increased. Specifically, our method showed significant improvement

Table 2

| Dataset --   | Method      | 0      | 1      | 2      | 3 -       | 4      | 5         | 6      | 7         | 8      | 9      | avg    | SD      |
|--------------|-------------|--------|--------|--------|-----------|--------|-----------|--------|-----------|--------|--------|--------|---------|
| Dataset --   | -- AnoGAN   | - 99.0 | - 99.8 | - 88.8 | 91.3      | - 94.4 | - 91.2    | - 92.5 | - 96.4    | - 88.3 | - 95.8 | - 93.7 | - 4.00  |
| Dataset --   | OCGAN       | 99.8   | 99.9   | 94.2   | 96.3      | 97.5   | 98.0      | 99.1   | 98.1      | 93.9   | 98.1   | 97.5   | 2.10    |
| Dataset --   | GeoTrans    | 98.2   | 91.6   | 99.4   | 99.0      | 99.1   | 99.6      | 99.9   | 96.3      | 97.2   | 99.2   | 98.0   | 2.50    |
| Dataset --   | ARNet       | 98.6   | 99.9   | 99.0   | 99.1      | 98.1   | 98.1      | 99.7   | 99.0      | 93.6   | 97.8   | 98.3   | 1.78    |
| Dataset --   | *ADGAN --   | 92.9 - | 99.9 - | 80.0 - | 65.0 -    | 84.6 - | 82.5 -    | 68.1 - | 85.3 -    | 77.2 - | 74.4 - | 81.0 - | 10.07 - |
| Dataset --   | Ours 4      | 100.   | 100.   | 99.0   | 98.6      | 99.5   | 97.2      | 99.6   | 99.8      | 95.8   | 99.2   | 99.1   | 0.86    |
|              | Method      | 0      | 1      | 2      | 3         | 4      | 5         | 6      | 7         | 8      | 9      | avg    | SD      |
|              | -- GeoTrans | - 99.4 | - 97.6 | - 91.1 | - 89.9    | - 92.1 | - 93.4    | - 83.3 | - 98.9    | - 90.8 | - 99.2 | - 93.5 | - 5.22  |
|              | ARNet       | 92.7   | 99.3   | 89.1   | 93.6      | 90.8   | 93.1      | 85.0   | 98.4      | 97.8   | 98.4   | 93.9   | 4.70    |
|              | *ADGAN --   | 99.3 - | 100.   | 100.   | 97.5      | 100.   | 100.      | 97.7   | 100.      | 100.   | 100.   | 99.5   | 0.95    |
|              | Ours        | 99.9   | - 100. | - 100. | - 99.4    | - 100. | - 100.    | - 100. | - 100.    | - 100. | - 100. | - 99.9 | - 0.18  |
|              | Method      | 0      | 1      | 2      | 3         | 4      | 5         | 6      | 7         | 8      | 9      | avg    | SD      |
|              | -- AnoGAN   | - 64.0 | - 56.5 | - 64.8 | - 52.8    | - 67.0 | - 59.2    | - 62.5 | - 57.6    | - 72.3 | - 58.2 | - 61.2 | - 5.68  |
|              | OCGAN       | 75.7   | 53.0   | 64.0   | 62.0      | 72.3   | 62.0      | 72.3   | 57.5      | 82.0   | 55.4   | 65.6   | 9.52    |
|              | GeoTrans    | 74.7   | 95.7   | 78.1   | 72.4 77.4 | 87.8   | 87.8      | 83.4   | 95.5 92.9 | 93.3   | 91.3   | 86.0   | 8.52    |
|              | ARNet       | 78.5   | 89.8   | 86.1   |           | 90.5   | -         | 89.2   | -         | 92.0   | 85.5   | 93.8 - | 5.25 -  |
|              | ADGAN --    | 99.9 - | 91.5 - | 90.9 - | 91.7 -    | 99.5 - | 84.5 86.1 | 99.7 - | 86.3      | 99.9 - | 93.1 - | 86.6   | 5.35    |
|              | Method      | 0      | 1      | 2      | 3         |        | 4         | 5      | 6         | 7      | 8      | 9      | 10      |
|              | -- DAGMM    | - 43.4 | - 49.5 | - 66.1 | - 52.6    |        | - 56.9    | - 52.4 | - 55.0    | - 52.8 | - 53.2 | - 42.5 | - 52.7  |
|              | GeoTrans    | 74.7   | 68.5   | 74.0   | 81.0      |        | 78.4      | 59.1   | 81.8      | 65.0   | 85.5   | 90.6   | 87.6    |
|              | ARNet       | 77.5   | 70.0   | 62.4   | 76.2      |        | 77.7      | 64.0   | 86.9      | 65.6   | 82.7   | 90.2   | 85.9    |
|              | ADGAN --    | 89.1   | 69.4   | 96.5   | 90.6      |        | 89.5      | 83.7   | 78.9      | 57.2   | 90.2   | 94.8   | 83.0    |
|              | Ours        | - 99.9 | - 99.6 | - 99.8 | - 99.8    |        | - 99.9    | - 99.7 | - 99.9    | - 99.9 | - 99.4 | - 99.8 | - 99.9  |
|              | Method      | 11     | 12     | 13     | 14        | 15     |           | 16     | 17        | 18     | 19     | avg    | SD      |
|              | -- DAGMM    | - 46.4 | - 42.7 | - 45.4 | - 57.2    |        | - 48.8    | -      | - 36.4    | - 52.4 | - 50.3 | - 50.5 | - 6.55  |
|              | GeoTrans    | 83.9   | 83.2   | 58.0   | 92.1      |        | 68.3      | 54.4   | 93.8      | 90.7   | 85.0   | 78.7   | 10.76   |
|              | ARNet       | 83.5   | 84.6   |        |           | 74.1   | 80.3      | 73.5   | 91.0      | 85.3   | 85.4   |        |         |
|              | --          | 86.8 - | -      | 67.6   | 84.2      |        | 71.4      | 79.1 - | 94.7 -    |        |        | 78.8   | 8.82    |
|              | ADGAN       |        | 96.2   | 71.7 - | 94.1 -    |        | -         |        |           | 80.7 - | 72.4 - | 83.5 - | 10.53 - |

## Table 1

One-class semi-supervised anomaly detection benchmark performances. We reported the average AUC in % that is computed over 3 runs. Results of AnoGAN Schlegl et al. (2017b), OCGAN Perera, Nallapati and Xiang (2019), GeoTrans Golan and El-Yaniv (2018), ADGAN Cheng et al. (2020), and DAGMM Zong, Song, Min, Cheng, Lumezanu, ki Cho and Chen (2018) are borrowed from Cheng et al. (2020), while the results of ARNet are borrowed from Ye et al. (2022). Results that marked with * are produced by us. Bold numbers represent the best results.

| Dataset        |    𝛾 | supervised classifier   | SS-DGM      | SSAD Hybrid   | Deep SAD   | TLSAD   | ESAD       | Ours        |
|----------------|------|-------------------------|-------------|---------------|------------|---------|------------|-------------|
| MNIST 4        | 0    | -                       | -           | 96.3 ± 2.5    | 92.8 ± 4.9 | -       | 98.5 ± 1.3 | 99.1 ± 0.86 |
| MNIST 4        | 0.01 | 83.6 ± 8.2              | 89.9 ± 9.2  | 96.8 ± 2.3    | 96.4 ± 2.7 | 94.1    | 99.2 ± 0.7 | 99.4 ± 0.85 |
| MNIST 4        | 0.05 | 90.3 ± 4.6              | 92.2 ± 5.6  | 97.4 ± 2.0    | 96.7 ± 2.3 | 96.9    | 99.4 ± 0.3 | 99.9 ± 0.29 |
| MNIST 4        | 0.1  | 93.9 ± 2.8              | 91.6 ± 5.5  | 97.6 ± 1.7    | 96.9 ± 2.3 | 97.7    | 99.5 ± 0.4 | 100. ± 0.04 |
| MNIST 4        | 0.2  | 96.9 ± 1.7              | 91.2 ± 5.6  | 97.8 ± 1.5    | 96.9 ± 2.4 | 98.3    | 99.6 ± 0.3 | 100. ± 0.02 |
| Fashion- MNIST | 0    | -                       | -           | 91.2 ± 4.7    | 89.2 ± 6.2 | -       | 94.0 ± 4.5 | 99.9 ± 0.18 |
| Fashion- MNIST | 0.01 | 74.4 ± 13.6             | 65.1 ± 16.3 | 89.4 ± 6.0    | 90.0 ± 6.4 | 88.4    | 95.3 ± 4.2 | 100. ± 0.00 |
| Fashion- MNIST | 0.05 | 76.8 ± 13.2             | 71.4 ± 12.7 | 90.5 ± 5.9    | 90.5 ± 6.5 | 91.4    | 95.6 ± 4.1 | 100. ± 0.00 |
| Fashion- MNIST | 0.1  | 79.0 ± 12.3             | 72.9 ± 12.2 | 91.0 ± 5.6    | 91.3 ± 6.0 | 92.0    | 95.8 ± 4.0 | 100. ± 0.00 |
| Fashion- MNIST | 0.2  | 81.4 ± 12.0             | 74.7 ± 13.5 | 89.7 ± 6.6    | 91.0 ± 5.5 | 93.2    | 95.9 ± 4.0 | 100. ± 0.00 |
| CIFAR10        | 0    | -                       | -           | 63.8 ± 9.0    | 60.9 ± 9.4 | -       | 78.8 ± 6.5 | 98.3 ± 2.26 |
| CIFAR10        | 0.01 | 55.6 ± 5.0              | 49.7 ± 1.7  | 70.5 ± 8.30   | 72.6 ± 7.4 | 74.4    | 83.7 ± 6.4 | 98.6 ± 1.27 |
| CIFAR10        | 0.05 | 63.5 ± 8.0              | 50.8 ± 4.7  | 73.3 ± 8.4    | 77.9 ± 7.2 | 80.0    | 86.9 ± 6.8 | 99.8 ± 0.25 |
| CIFAR10        | 0.1  | 67.7 ± 9.6              | 52.0 ± 5.5  | 74.0 ± 8.1    | 79.8 ± 7.1 | 84.8    | 87.8 ± 6.7 | 99.9 ± 0.03 |
| CIFAR10        | 0.2  | 80.5 ± 5.9              | 53.2 ± 6.7  | 74.5 ± 8.0    | 81.9 ± 7.0 | 86.3    | 88.5 ± 6.9 | 100. ± 0.00 |

One-class anomaly detection benchmark performances with increased supervision. Results of supervised classifier, SS-DGM, SSAD Hybrid, and Deep SAD are borrowed from Ruff et al. (2020), while the results of TLSAD, and ESAD are borrowed from Huang et al. (2021). Bold numbers represent the best results.

Source

GANomaly

Ours (unsupervised)