Page 2

One-class classification models are discriminative approaches for anomaly detection, which aim to learn a decision boundary based on normal samples. One-class support vector machine (OC-SVM) as a classical one-class classification model is widely used for anomaly detection. Similarly, deep one-class classifiers such as Deep SVDD are developed recently to identify anomalies from complex data. Deep SVDD trains a neural network to map normal samples enclosed to a center of the hypersphere in the embedding space and derives a sample's anomaly score based on its distance to the center.

Reconstruction models are trained to minimize reconstruction errors on the normal samples so that anomalies can be detected with large reconstruction errors. Reconstructionbased anomaly detection models include traditional PCA, which aims to find an orthogonal projection in a lowdimensional space with the minimum reconstruction error when mapping back to the original space, and recent deep autoencoder, which is parameterized by a deep neural network for encoding and decoding data.

Other miscellaneous techniques , which do not fall in the above three categories, are also developed for anomaly detection. Isolation forest [Liu et al. , 2008] builds trees from unlabeled samples and label anomalies those samples close to the root of trees. Local outlier factor (LOF), as another unsupervised anomaly detection approach, computes the local density deviation of a given data point with respect to its neighbors, and labels points having a lower density than their neighbors as anomalies [Breunig et al. , 2000]. As normal samples are usually easy to obtain, [Sipple, 2020] adopts negative sampling approaches to generate anomalies and then leverages the classification models to achieve anomaly detection. Meanwhile, anomaly detection can be modeled as a special scenario of few-shot learning when a

few anomalies are available for training [Pang et al. , 2021; Shuhan et al. , 2020].

## 3 Trustworthy Anomaly Detection

From the trustworthy perspective, anomaly detection models should meet the following key properties.

Performant: Effectively detecting anomalies is the basic requirement for all anomaly detection models. Targeting on precisely identifying anomalies, anomaly detection models aim to reduce the rate of misclassifying normal samples as anomalies, or the rate of missing anomalies, or both. Meanwhile, due to the scarcity of anomalies, the classical classification evaluation metrics, such as accuracy, are not suitable to quantify the performance of anomaly detection. Commonlyused evaluation metrics for anomaly detection include area under the receiver operating characteristics (AUROC), area under the precision-recall curve (PRROC), and the false-alert rate when achieving 95% of the true positive rate.

Interpretable: When deploying black-box anomaly detection models to make critical predictions, there is an increasing demand for interpretability from various stakeholders [Preece et al. , 2018]. For example, if a bank account is automatically suspended by algorithms due to potentially fraudulent activities, both its user and the bank would like to know explanation, e.g., what activities lead to the suspension. Therefore, interpretable anomaly detection requires the models be able to provide interpretations to the detection results while maintaining the detection performance.

Fair: Ensuring the decisions free from discrimination against certain groups is critical when deploying anomaly detection models for high-stake tasks, e.g., predicting recidivism risk [Dressel and Farid, 2018]. Any algorithmic bias against some groups in anomaly detection models should be avoided, which is a basic ethical requirement from the public.

Robust: Large pieces of work have demonstrated that machine learning models including anomaly detection models are vulnerable to various adversarial attacks. Model robustness is key to ensuring the reliability of models when deployed to real-world scenarios, like detecting outliers in roadways for intelligent transportation systems. Robustness in anomaly detection requires the detection model has consistent outputs in face of attacking samples.

Privacy-preserving: Anomaly detection models require a large number of samples for training. As a result, massive data collection for model training raises privacy concerns. Properly protecting users' sensitive data is important and also required by government regulations. Privacy-preservation in anomaly detection should be able to protect the privacy of data in three aspects: data for training a model (input), the model itself, and the model's predictions (output). User private information should not be leaked in the whole pipeline of training and deploying an anomaly detection model.

Table 1 summarizes existing approaches towards trustworthy anomaly detection based on the above desideratum. Among them, the approach, Robust AD vis DP, addresses both robustness and privacy-preservation. Note that we skip the performance in this brief survey as several surveys in literature well cover this perspective [Ruff et al. , 2021;

Table 1: Summary of Published Research in Trustworthy Anomaly Detection. (I-Interpretable; F-Fair; R-Robust; P-Privacy-preserving)Pang et al. , 2020]. Figure 1 further summarizes the existing approaches towards trustworthy anomaly detection from the perspective of using deep or shallow models. Note that OCDTD and AE-1SVM combine the shallow and deep models for interpretation.

| Approach                                  | I   | F   | P   | Structure   | Data                     | Key features                                     |
|-------------------------------------------|-----|-----|-----|-------------|--------------------------|--------------------------------------------------|
| GEE [Nguyen et al. , 2019]                | ·   |     |     | VAE         | Multivariate             | Post-hoc gradient-based interpretation           |
| OmniAnomaly [Su et al. , 2019]            | ·   |     |     | GRU+VAE     | Multivariate Time Series | Post-hoc interpretation                          |
| CAVGA [Venkataramanan et al. , 2020]      | ·   |     |     | VAE         | Image                    | Intrinsic interpretation                         |
| PPAD-CPS [Keshk et al. , 2019]            |     |     | ·   | GMM         | Multivariate             | Anonymization-based approach                     |
| FCDD [Liznerski et al. , 2021]            | ·   |     |     | CNN         | Image                    | Intrinsic interpretation                         |
| EM-attention [Brown et al. , 2018]        | ·   |     |     | RNN         | Sequence                 | Intrinsic interpretation                         |
| AE-1SVM [Nguyen and Vien, 2018]           | ·   |     |     | AE-OCSVM    | Multivariate/Image       | Post-hoc gradient-based interpretation           |
| OC-DTD [Kauffmann et al. , 2020]          | ·   |     |     | OCSVM       | Image                    | Post-hoc gradient-based interpretation           |
| CutPaste [Li et al. , 2021]               | ·   |     |     | CNN         | Image                    | Post-hoc gradient-based interpretation           |
| Deep Fair SVDD [Zhang and Davidson, 2021] |     | ·   |     | CNN/MLP     | Multivariate/Image       | Adversarial representation learning              |
| Attack online AD [Kloft and Laskov, 2010] |     |     |     | SVDD        | Multivariate             | Poisoning attack                                 |
| AE Shapley [Takeishi and Kawahara, 2020]  | ·   |     |     | AE          | Multivariate             | Post-hoc perturbation-based interpretation       |
| DCFOD [Song et al. , 2021]                |     | ·   |     | MLP         | Multivariate             | Adversarial representation learning              |
| FairOD [Shekhar et al. , 2021]            |     | ·   |     | MLP         | Multivariate             | Fair regularizer                                 |
| APAE [Goodge et al. , 2020]               |     |     |     | AE          | Multivariate             | Adversarial defense                              |
| AE+PLS [Lo et al. , 2021]                 |     |     |     | AE          | Multivariate             | Adversarial defense                              |
| NGIG [Sipple, 2020]                       | ·   |     |     | MLP         | Multivariate             | Post-hoc gradient-based interpretation           |
| DevNet [Pang et al. , 2021]               | ·   |     |     | CNN         | Image                    | Few-shot; post-hoc gradient-based interpretation |
| FairLOF [P and Abraham, 2020]             |     | ·   |     | LOF         | Multivariate             | Heuristic principles                             |
| PPLOF [P and Abraham, 2020]               |     |     | ·   | LOF         | Multivariate             | Cryptographic-based approach                     |
| Attack RNN-based AD [Xu et al. , 2020]    |     |     |     | RNN         | Sequence                 | Poisoning attack                                 |
| Robust AD via DP [Du et al. , 2020]       |     |     | ·   | AE/RNN      | Image/Sequence           | Improve robustness via differential privacy      |
| DPSGD [Abadi et al. , 2016]               |     |     | ·   | DNN         | General                  | General approach to achieve differential privacy |

Figure 1: Summary of published research in trustworthy anomaly detection by using deep or shallow models.

<!-- image -->

## 4 Interpretable Anomaly Detection