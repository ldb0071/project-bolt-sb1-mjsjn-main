Page 1

## Trustworthy Anomaly Detection: A Survey

## Shuhan Yuan 1 , Xintao Wu 2

1 Utah State University 2 University of Arkansas

shuhan.yuan@usu.edu, xintaowu@uark.edu

## Abstract

potential victim of the algorithms due to intentional or unintentional misuse.

Anomaly detection has a wide range of real-world applications, such as bank fraud detection and cyber intrusion detection. In the past decade, a variety of anomaly detection models have been developed, which lead to big progress towards accurately detecting various anomalies. Despite the successes, anomaly detection models still face many limitations. The most significant one is whether we can trust the detection results from the models. In recent years, the research community has spent a great effort to design trustworthy machine learning models, such as developing trustworthy classification models. However, the attention to anomaly detection tasks is far from sufficient. Considering that many anomaly detection tasks are life-changing tasks involving human beings, labeling someone as anomalies or fraudsters should be extremely cautious. Hence, ensuring the anomaly detection models conducted in a trustworthy fashion is an essential requirement to deploy the models to conduct automatic decisions in the real world. In this brief survey, we summarize the existing efforts and discuss open problems towards trustworthy anomaly detection from the perspectives of interpretability, fairness, robustness, and privacy-preservation.

## 1 Introduction

Anomaly detection aims to find instances that are deviated from normal ones. As a fundamental problem in machine learning with a wide spectrum of applications, anomaly detection has gained a lot of attention in recent years [Ruff et al. , 2021; Pang et al. , 2020]. Although advanced anomaly detection techniques significantly improve the performance of identifying anomalies, there are still high risks to simply count upon the models in sensitive applications for automatic decision makings, such as health care or financial systems. Meanwhile, many anomaly detection tasks involve human beings, such as bank fraud detection, online troll detection, and malicious insider detection. Therefore, it is natural to ask whether we should trust algorithms for the task of labeling a person as an anomaly because every human being can be a

Trustworthy AI, which emphasizes human value as principles in AI algorithms, such as fairness, transparency, accountability, reliability, privacy, and security, has become an urgent task for AI researchers [Liu et al. , 2021a]. The main objective is to design trustworthy AI algorithms that address the social expectations of enhancing both AI ability and benefits to society without threat or risk of harm [Cheng et al. , 2021; Liu et al. , 2021a].

In the context of anomaly detection, besides the effectiveness in detecting anomalies, trustworthy anomaly detection algorithms should also follow the typical social norms just like all the expectations to AI algorithms. In this brief survey, we focus on four important dimensions of trustworthy anomaly detection, including interpretability, fairness, robustness, and privacy-preservation.

## 2 Brief Review to Anomaly Detection

An anomaly is usually considered as an instance that deviates considerably from normality [Ruff et al. , 2021]. The anomaly detection model trained on a given dataset usually aims at deriving an anomaly score for an input test sample to distinguish anomalies from normal ones.

Due to the scarcity of anomalies in the training dataset, anomaly detection is usually conducted in unsupervised and semi-supervised settings. The unsupervised anomaly detection setting usually assumes unlabeled data in the training set with rare anomalies, which follows the intrinsic property of data distributions in real-world situations. As anomalies are rare in real cases, one special case of the unsupervised setting, called one-class setting, further assumes all those unlabeled training data are normal samples. On the other hand, the semi-supervised anomaly detection setting typically assumes a small number of labeled normal and abnormal samples and a large number of unlabeled samples in the training dataset. Recent studies have demonstrated that using a few anomalies for training can significantly improve anomaly detection performance [Ruff et al. , 2020]. Because collecting anomalies is usually challenging, a special semi-supervised setting is positive-unlabeled learning, i.e., achieving anomaly detection based on labeled normal and unlabeled samples.

Based on whether the complex deep neural networks (DNNs) are deployed, the anomaly detection models can be

categorized into shallow and deep models. As anomaly detection has been studied for decades, many traditional machine learning models, i.e., shallow models, have been applied for detecting anomalies, such as support vector data description (SVDD) and principal component analysis (PCA). The shallow models are usually effective for detecting anomalies on tabular data, but hard for handling complex data types, such as text, image, or graph, due to lack of capability to capture non-linear relationships among features. In recent years, many deep learning models are proposed for anomaly detection because of their capability to automatically learn representations or patterns from a variety of data. Both deep and shallow anomaly detection approaches can be mainly categorized into four groups, density estimation and probabilistic models, one-class classification models, reconstruction models, and other miscellaneous techniques [Ruff et al. , 2021].

Density estimation and probabilistic models detect anomalies by estimating the normal data distribution. The anomalies are detected with low likelihood in the normal data distribution. Generative models, including shallow models like Gaussian mixture models (GMMs) and deep models like variational autoencoder (VAE) and generative adversarial networks (GAN), have been applied for anomaly detection. Generative models approximate the data distribution given a dataset and deep generative models are further able to model complex and high-dimensional data.