# Page 7

## Page Information

- **Type**: table_page
- **Word Count**: 394
- **Has Tables**: True
- **Has Figures**: False

## Content

# Page 7

## 2.2 Adversarial Defenses

Pixel Deflection The key idea of pixel deflection defense is to randomly replace pixels with nearby pixels (Prakash et al. 2018). To achieve the replacement, this method uses CAMs of the top-5 predictions to guide the update of the pixels (Zhou et al. 2016). In this scenario, the probability of a pixel being updated is inversely proportional to the likelihood that the area contains the object. After the pixel replacement, a denoising operation is applied to recover the classification accuracy.

Randomization The mitigation of adversarial attack effects can also be achieved by using randomization. For instance, Xie et al. proposes to first resize the input to random size (2017). After that, a random padding operation is performed to pad zeros around the resized image. Though it may seem simple, this method can significantly improve the robustness of DNN models against adversarial attack.

Input Transformation Another type of popular defense methods is input transformation. Its key idea is to perform various transformations, such as bit-depth reduction, lossy compression and variance minimization on adversarial examples to mitigate the attack effects (Guo et al. 2017; Xu, Evans, and Qi 2017). The reported experimental results show that these methods can achieve balance between robustness against attack and computation overhead.

## Visual Content

### Page Preview

![Page 7](/projects/llms/images/CAG_A_Realtime_Lowcost_Enhancedrobustness_Hightransferability_Contentaware_Adversarial_Attack_Genera_page_7.png)

## Tables

### Table 1

| Attacks/Classifiers | RN-34 | VGG-11 | VGG-13 | DN-121 | DN-169 | Average |
| --- | --- | --- | --- | --- | --- | --- |
| I-FGSM | 30.45% | 21.39% | 23.88% | 29.01% | 28.70% | 26.69% |
| PGD | 45.38% | 28.46% | 34.90% | 41.15% | 40.05% | 37.99% |
| C&W | 7.57% | 8.88% | 8.40% | 6.61% | 7.70% | 7.85% |
| CAGp=0.0 | 86.47% | 66.46% | 94.09% | 83.64% | 85.74% | 83.78% |
| CAGp=0.1 | 89.02% | 70.51% | 95.10% | 87.01% | 88.52% | 85.92% |
| CAGp=0.2 | 90.83% | 74.31% | 94.93% | 88.93% | 90.37% | 87.85% |
| CAGp=0.3 | 91.83% | 77.81% | 94.89% | 90.49% | 91.31% | 89.24% |

### Table 2

|  | Storage | White-box | None | None | None | Black-box | None | None | None |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Attacks/Classifiers |  | RN-18 | VGG-11 | DN-121 | Average | RN-34 | VGG-13 | DN-169 | Average |
| GAPUnet(5T) | 30MB×5 | 97.98% | 98.45% | 97.85% | 98.09% | 82.97% | 85.69% | 88.31% | 85.66% |
| GAPResNet(5T) | 30MB×5 | 91.02% | 94.25% | 90.58% | 91.95% | 76.40% | 86.27% | 78.33% | 80.33% |
| GAP(1000T) | 30MB×1000 | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A |
| CAG(5T) | 222MB | 98.52% | 97.71% | 96.91% | 97.71% | 95.45% | 94.34% | 94.06% | 94.62% |
| CAG(1000T) | 222MB | 97.79% | 97.01% | 96.62% | 97.14% | 93.38% | 94.28% | 92.61% | 93.42% |

### Table 3

|  | White-box | None | None | None | None | Black-box | None | None | None | None |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DefenseMethods | RN-18 | VGG-11 | DN-121 | Average | Average
I-FGSM | RN-34 | VGG-13 | DN-169 | Average | Average
I-FGSM |
| None | 0.59% | 1.03% | 1.50% | 1.04% | 4.58% | 2.10% | 1.51% | 3.85% | 2.49% | 42.17% |
| PixelDeflection | 24.75% | 26.39% | 31.76% | 27.63% | 14.76% | 33.83% | 23.44% | 43.45% | 33.57% | 57.25% |
| Randomization | 3.06% | 3.07% | 6.80% | 4.31% | 22.19% | 5.26% | 2.77% | 10.23% | 6.09% | 43.90% |
| BitDepthReduction | 4.80% | 7.33% | 10.41% | 7.51% | 10.22% | 11.12% | 10.18% | 17.85% | 12.96% | 50.08% |
| JPEGCompression | 5.81% | 7.63% | 11.05% | 8.16% | 12.62% | 12.17% | 10.48% | 17.78% | 13.48% | 49.36% |
