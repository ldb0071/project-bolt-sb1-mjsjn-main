Page 1

## Detecting Relative Anomaly

Richard Neuberg and Yixin Shi

Abstract -System states that are anomalous from the perspective of a domain expert occur frequently in some anomaly detection problems. The performance of commonly used unsupervised anomaly detection methods may suffer in that setting, because they use frequency as a proxy for anomaly. We propose a novel concept for anomaly detection, called relative anomaly detection . It is tailored to be robust towards anomalies that occur frequently, by taking into account their location relative to the most typical observations. The approaches we develop are computationally feasible even for large data sets, and they allow real-time detection. We illustrate using data sets of potential scraping attempts and Wi-Fi channel utilization, both from Google, Inc.

Index Terms -Anomaly detection, Process Control, Unsupervised Learning

## I. INTRODUCTION

Multivariate anomaly detection may be categorized broadly into supervised and unsupervised detection. In supervised anomaly detection, training data are labeled by domain experts as normal or anomalous, and a model is trained to classify future observations. In unsupervised anomaly detection, which is the focus of this article, labels are not known, because labeling is too difficult or costly. The goal is to approximately recover the missing expert judgements using empirical characteristics of the data. The data themselves typically first undergo a feature selection and feature engineering process to devise informative covariates. An unsupervised model can be evaluated by comparing its predictions with actual domain expert labels. Potential applications include intrusion detection, fraud detection and process control.

Frequency is commonly chosen as the target criterion for unsupervised anomaly detection. The population definition of anomalous observations then is { x : f ( x ) < λ } , where f is the data generating density, and λ is a user-selected threshold. Methods that exactly or approximately fall under this paradigm are density estimators and the closely related nearest neighbor approaches, besides many others; for a review on commonly used anomaly detection methods, see [1].

However, frequency may not align well with expert judgements in some applications. For example, scraping (the automated collection of information from websites) may occur frequently, but it nevertheless constitutes anomalous user behavior. The performance of common approaches to unsupervised anomaly detection may suffer in the presence of such frequently occurring anomalies.

We propose a framework which we call relative anomaly detection to better handle cases where anomalies may occur frequently. We use the term relative to emphasize that in this framework the anomaly of an observation is determined by taking into account not only its own location and that of neighboring observations, but also the location of the most typical system states. The underlying assumption in relative anomaly detection is that large clusters of high-density system states are indeed normal from an expert's perspective, and that observations that are far from these most typical system states are anomalous. Such anomalies may occur frequently.

The rest of this paper is organized as follows. In Section II, we discuss the approach to anomaly detection of [2], which is closely related to the PageRank algorithm [3]. We discuss the similarity graph of the observations in the training data set. We show connections with other approaches to anomaly detection, and discuss their shortcomings in the presence of anomalies that occur frequently. In Section III, we introduce two novel relative anomaly detection approaches. In Section IV, we compare our approaches with that of [2], using data sets of potential scraping attempts and Wi-Fi usage from Google, Inc. We conclude in Section V.

## II. MANY APPROACHES TO ANOMALY DETECTION TARGET FREQUENCY CRITERION

In this section we show that the anomaly detection approach of [2], which is similar to the PageRank method [3], approximately targets the frequency criterion. We show that it is also closely related to kernel density estimation and the nearest neighbor approach. We begin by introducing the similarity graph, which will also serve as a basis for the relative anomaly detection approaches we develop in Section III.

The relationship between unlabeled observations in a data set may be described through a weighted similarity graph. Observations form the nodes of the graph, and the weight of an edge expresses the similarity between two observations. Two observations x i and x j are typically considered similar when their distance is small. However, non-monotonic transformations can be useful with time series data, to take into account periodic behavior of the underlying system; for a reference on such transformations, see [4, Chapter 4]. A common monotonic transformation from distance d ( x i , x j ) to similarity s ( x i , x j ) uses the kernel function