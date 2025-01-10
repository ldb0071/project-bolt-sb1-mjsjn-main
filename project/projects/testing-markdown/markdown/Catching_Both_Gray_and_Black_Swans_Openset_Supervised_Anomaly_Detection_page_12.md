Page 12

Optical [63] is a synthetic dataset for defect detection on industrial optical inspection. The artificially generated data is similar to real-world tasks.

Mastcam [22] is a novelty detection dataset constructed from geological image taken by a multispectral imaging system installed in Mars exploration rovers. It contains typical images and images of 11 novel geologic classes. Images including shorter wavelength (color) channel and longer wavelengths (grayscale) channel and we focus on shorter wavelength channel in this work.

BrainMRI [47] is a brain tumor detection dataset obtained by magnetic resonance imaging (MRI) of the brain.

HeadCT [47] is a brain hemorrhage detection dataset obtained by CT scan of head.

Hyper-Kvasir [5] is a large-scale open gastrointestinal dataset collected during real gastro- and colonoscopy procedures. It contains four main categories and 23 subcategories of gastro- and colonoscopy images. This work focuses on gastroscopy images with the anatomical landmark category as the normal samples and the pathological category as the anomalies.

To provide some intuitive understanding of what the anomalies and normal samples look like, we present some examples of normal and anomalous images for each dataset in Fig. 4.

Table 5. Key Statistics of Image Datasets. The first 15 datasets compose the MVTec AD dataset.Table 6. Download Link of Image Datasets.

| Dataset      | Original Training   | Original Test   | Original Test   | Anomaly Data   | Anomaly Data   |
|--------------|---------------------|-----------------|-----------------|----------------|----------------|
|              | Normal              | Normal          | Anomaly         | # Classes      | Type           |
| Carpet       | 280                 | 28              | 89              | 5              | Texture        |
| Grid         | 264                 | 21              | 57              | 5              | Texture        |
| Leather      | 245                 | 32              | 92              | 5              | Texture        |
| Tile         | 230                 | 33              | 84              | 5              | Texture        |
| Wood         | 247                 | 19              | 60              | 5              | Texture        |
| Bottle       | 209                 | 20              | 63              | 3              | Object         |
| Capsule      | 219                 | 23              | 109             | 5              | Object         |
| Pill         | 267                 | 26              | 141             | 7              | Object         |
| Transistor   | 213                 | 60              | 40              | 4              | Object         |
| Zipper       | 240                 | 32              | 119             | 7              | Object         |
| Cable        | 224                 | 58              | 92              | 8              | Object         |
| Hazelnut     | 391                 | 40              | 70              | 4              | Object         |
| Metal nut    | 220                 | 22              | 93              | 4              | Object         |
| Screw        | 320                 | 41              | 119             | 5              | Object         |
| Toothbrush   | 60                  | 12              | 30              | 1              | Object         |
| MVTec AD     | 3,629               | 467             | 1,258           | 73             | -              |
| AITEX        | 1,692               | 564             | 183             | 12             | Texture        |
| SDD          | 594                 | 286             | 54              | 1              | Texture        |
| ELPV         | 1,131               | 377             | 715             | 2              | Texture        |
| Optical      | 10,500              | 3,500           | 2,100           | 1              | Object         |
| Mastcam      | 9,302               | 426             | 451             | 11             | Object         |
| BrainMRI     | 73                  | 25              | 155             | 1              | Medical        |
| HeadCT       | 75                  | 25              | 100             | 1              | Medical        |
| Hyper-Kvasir | 2,021               | 674             | 757             | 4              | Medical        |

Tab. 5 summarizes the key statistics of these datasets. Below we introduce each dataset in detail. The normal samples in MVTec AD are split into training and test sets following the original settings. In other datasets, the normal samples are randomly split into training and test sets by a ratio of 3 / 1 .

| Dataset      | Link                               |
|--------------|------------------------------------|
| MVTec AD     | https://tinyurl.com/mvtecad        |
| AITEX        | https://tinyurl.com/aitex-defect   |
| SDD          | https://tinyurl.com/KolektorSDD    |
| ELPV         | https://tinyurl.com/elpv-crack     |
| Optical      | https://tinyurl.com/optical-defect |
| Mastcam      | https://tinyurl.com/mastcam        |
| BrainMRI     | https://tinyurl.com/brainMRI-tumor |
| HeadCT       | https://tinyurl.com/headCT-tumor   |
| Hyper-Kvasir | https://tinyurl.com/hyper-kvasir   |

## A.2. Dataset Split