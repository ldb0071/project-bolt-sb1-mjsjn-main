Page 8

- · Alzheimer's Dataset Dubey (2019) contains 6,412 brain magnetic resonance imaging (MRI) scans with 4 categories (normal, very mild demented, mild demented, and moderate demented). Training set contains 2,560 normal, 1,792 very mild demented, 717 mild demented, and 52 moderate demented images. Testing set contains 640 normal, 448 very mild demented, 179 mild demented, and 12 moderate demented images.
- · ChestXray Kermany, Goldbaum, Cai, Valentim, Liang, Baxter, McKeown, Yang, Wu, Yan, Dong, Prasadha, Pei,

Ting, Zhu, Li, Hewett, Dong, Ziyar, Shi, Zhang, Zheng, Hou, Shi, Fu, Duan, Huu, Wen, Zhang, Zhang, Li, Wang, Singer, Sun, Xu, Tafreshi, Lewis, Xia and Zhang (2018) contains 5,863 X-Ray images and 2 categories (pneumonia/normal), with a training set of 1,341 normal and 3,875 pneumonia images, and a testing set (from the merge of original test and val sets) of 242 normal and 398 pneumonia images.

- · Retinal OCT Kermany et al. (2018) consists 84,495 retinal optical coherence tomography (OCT) images with 4 categories of choroidal neovascularization (CNV), diabetic macular edema (DME), drusen and normal. The training set contains 37,205 CNV, 11,348 DME, 8,616 drusen, 26,315 normal images, while the testing set (from the merge of original test and val sets) contains 250 images for each category.
- · Lung Histopathology is the lung histopathology subset of LC25000 dataset Borkowski, Bui, Thomas, Wilson, Deland and Mastorides (2019) that contains 5,000 lung adenocarcinoma (ACA) images, 5,000 lung squamous cell carcinomas (SCC) images and 5,000 benign lung images. As the training/testing sets are not splitted, we selected the last 500 images in each class as testing set alphabetically.

## 5.1.1. Results

Section 4.2 proved the effectiveness of our proposed method with a comprehensive benchmarking against several benchmark datasets and models. In this section, we further evaluated our model on several real-world medical datasets. The results demonstrated robustness over those datasets, especially with the proposed Contextual adversarial information . Interestingly, network training would be failed without Contextual adversarial information for Retinal OCT dataset when more supervision provided ( 𝛾 = 0 . 03 , 0 . 05 , 0 . 10 ). Due to the similarities between normal and abnormal data in Retinal OCT dataset, we suspect the similar normal and abnormal data confuses the network, resulting in failure.

<!-- image -->

Figure 3: Reconstruction results of the real-world datasets. From top to bottom, are the brain MRI, chest X-ray, lung histopathology, and retinal OCT data respectively. We randomly selected 6 normal images and 6 abnormal images for each dataset. Supervised models used for each datasets were trained with 10% anomaly.

<!-- image -->

Table 3

| 𝛾                   | .00   | .00   | .01   | .01   | .03   | .03   | .05   | .05   | .10   | .10   |
|---------------------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|
| Adversarial Context | w     | w/o   | w     | w/o   | w     | w/o   | w     | w/o   | w     | w/o   |
| Alzheimer's         | 99.1  | 93.9  | 99.0  | 94.7  | 99.3  | 89.7  | 99.8  | 99.5  | 99.7  | 100.  |
| *ChestXray          | 72.6  | 68.8  | -     | -     | 95.5  | 73.4  | 96.3  | 89.8  | 98.9  | 91.4  |
| Lung Histopathology | 82.4  | 80.0  | 91.4  | 91.0  | 94.0  | 89.0  | 96.6  | 97.0  | 97.7  | 92.3  |
| Retinal OCT         | 94.5  | 90.9  | 99.7  | 93.0  | 99.2  | 75.8  | 99.5  | 72.3  | 99.7  | 88.0  |

One-class anomaly detection performances on medical datasets. We report the average AUC in % that computed over 3 runs. Datasets marked with * got too few anomalies to experiment when 𝛾 = 0 . 01 . Bold numbers represent the best results.

Therefore, we would refer the Contextual adversarial information as a method that might accelerate learning on finegrained anomaly features.

## 5.1.2. Qualitative Analysis

In Figure 3, we further analysed the reconstruction results of those real-world datasets. The visual results got

insignificant reconstruction errors for the Alzheimer's MRI data, while chest X-Ray and histopathology data obtained more meaningful results that mostly with corrupted the lung and edema areas. Though retinal OCT reached a good AUC (0.997), the corrupted reconstruction areas are less meaningful that mostly lie in background. In summary, we believe our method can produce reasonable reconstructions for anomaly