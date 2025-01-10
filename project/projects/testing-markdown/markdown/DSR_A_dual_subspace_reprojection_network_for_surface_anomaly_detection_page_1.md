Page 1

## DSR - A dual subspace re-projection network for surface anomaly detection

Vitjan Zavrtanik, Matej Kristan, and Danijel Skoˇcaj

University of Ljubljana, Faculty of Computer and Information Science { vitjan.zavrtanik, matej.kristan, danijel.skocaj } @fri.uni-lj.si

Abstract. The state-of-the-art in discriminative unsupervised surface anomaly detection relies on external datasets for synthesizing anomalyaugmented training images. Such approaches are prone to failure on nearin-distribution anomalies since these are difficult to be synthesized realistically due to their similarity to anomaly-free regions. We propose an architecture based on quantized feature space representation with dual decoders, DSR, that avoids the image-level anomaly synthesis requirement. Without making any assumptions about the visual properties of anomalies, DSR generates the anomalies at the feature level by sampling the learned quantized feature space, which allows a controlled generation of near-in-distribution anomalies. DSR achieves state-of-the-art results on the KSDD2 and MVTec anomaly detection datasets. The experiments on the challenging real-world KSDD2 dataset show that DSR significantly outperforms other unsupervised surface anomaly detection methods, improving the previous top-performing methods by 10% AP in anomaly detection and 35% AP in anomaly localization. Code is available at: https://github.com/VitjanZ/DSR anomaly detection.

Keywords: Surface anomaly detection, discrete feature space, simulated anomaly generation

## 1 Introduction

Surface anomaly detection addresses localization of image regions that deviate from normal object appearance. This is a fundamental problem in industrial inspection, in which the anomalies are defects on production line objects. In the most challenging situations, the distribution of the normal appearance of the inspected objects is very close to the distribution of anomaly appearances, while anomalies often occupy only a small portion of the object. Furthermore, the anomalies are rare in practical production lines, making the acquisition of a suitable data set for training supervised methods infeasible. The methods thus focus on leveraging only anomaly-free images, since these can be abundantly obtained.