Page 1

## DRÆM-Adiscriminatively trained reconstruction embedding for surface anomaly detection

Vitjan Zavrtanik Matej Kristan Danijel Skoˇcaj

University of Ljubljana, Faculty of Computer and Information Science { vitjan.zavrtanik, matej.kristan, danijel.skocaj } @fri.uni-lj.si

## Abstract

Visual surface anomaly detection aims to detect local image regions that significantly deviate from normal appearance. Recent surface anomaly detection methods rely on generative models to accurately reconstruct the normal areas and to fail on anomalies. These methods are trained only on anomaly-free images, and often require hand-crafted post-processing steps to localize the anomalies, which prohibits optimizing the feature extraction for maximal detection capability. In addition to reconstructive approach, we cast surface anomaly detection primarily as a discriminative problem and propose a discriminatively trained reconstruction anomaly embedding model (DRÆM). The proposed method learns a joint representation of an anomalous image and its anomaly-free reconstruction, while simultaneously learning a decision boundary between normal and anomalous examples. The method enables direct anomaly localization without the need for additional complicated post-processing of the network output and can be trained using simple and general anomaly simulations. On the challenging MVTec anomaly detection dataset, DRÆM outperforms the current state-of-theart unsupervised methods by a large margin and even delivers detection performance close to the fully-supervised methods on the widely used DAGM surface-defect detection dataset, while substantially outperforming them in localization accuracy.

## 1. Introduction

Surface anomaly detection addresses localization of image regions that deviate from a normal appearance (Figure 1). A closely related general anomaly detection problem considers anomalies as entire images that significantly differ from the non-anomalous training set images. In contrast, in surface anomaly detection problems, the anomalies occupy only a small fraction of image pixels and are typically close to the training set distribution. This is a particu-

Figure 1. DRÆM estimates the decision boundary between the normal an anomalous pixels solely by training on synthetic anomalies automatically generated on anomaly-free images (left) and generalizes to a variety of real-world anomalies (right). The result ( M o ) closely matches the ground truth (GT).

<!-- image -->

larly challenging task, which is common in quality control and surface defect localization applications.

In practice, anomaly appearances may significantly vary, and in applications like quality control, images with anomalies present are rare and manual annotation may be overly time consuming. This leads to highly imbalanced training sets, often containing only anomaly-free images. Significant effort has thus been recently invested in designing robust surface anomaly detection methods that preferably require minimal supervision from manual annotation.