Page 1

## Catching Both Gray and Black Swans: Open-set Supervised Anomaly Detection *

Choubo Ding , Guansong Pang , Chunhua Shen Zhejiang University

1 †

2 † 3

1 The University of Adelaide 2 Singapore Management University 3

## Abstract

Despite most existing anomaly detection studies assume the availability of normal training samples only, a few labeled anomaly examples are often available in many realworld applications, such as defect samples identified during random quality inspection, lesion images confirmed by radiologists in daily medical screening, etc. These anomaly examples provide valuable knowledge about the applicationspecific abnormality, enabling significantly improved detection of similar anomalies in some recent models. However, those anomalies seen during training often do not illustrate every possible class of anomaly, rendering these models ineffective in generalizing to unseen anomaly classes. This paper tackles open-set supervised anomaly detection, in which we learn detection models using the anomaly examples with the objective to detect both seen anomalies ('gray swans') and unseen anomalies ('black swans'). We propose a novel approach that learns disentangled representations of abnormalities illustrated by seen anomalies, pseudo anomalies, and latent residual anomalies (i.e., samples that have unusual residuals compared to the normal data in a latent space), with the last two abnormalities designed to detect unseen anomalies. Extensive experiments on nine real-world anomaly detection datasets show superior performance of our model in detecting seen and unseen anomalies under diverse settings. Code and data are available at: https://github.com/choubo/DRA

## 1. Introduction

Anomaly detection (AD) aims at identifying exceptional samples that do not conform to expected patterns [36]. It has broad applications in diverse domains, e.g ., lesion detection in medical image analysis [49, 57, 71], inspecting micro-cracks/defects in industrial inspection [3,4], crime/accident detection in video surveillance [11, 21, 52, 70], and unknown object detection in autonomous driving [10, 56]. Most of existing anomaly detection methods

Figure 1. t-SNE visualization of features learned by SotA unsupervised (KDAD [47]) and supervised (DevNet [35, 37]) models, and our open-set supervised model (DRA) on the test data of two MVTec AD datasets, Leather and Tile. KDAD is trained with normal data only, learning less discriminative features than DevNet and DRA that are trained using ten samples from the seen anomaly classes, in addition to the normal data. DevNet is prone to overfitting the seen anomalies, failing to distinguish unseen anomalies from the normal data, while DRA effectively mitigates this issue.

<!-- image -->