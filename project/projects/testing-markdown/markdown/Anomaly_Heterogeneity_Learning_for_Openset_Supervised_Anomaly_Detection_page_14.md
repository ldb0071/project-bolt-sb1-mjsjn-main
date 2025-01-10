Page 14

The overall objective of our AHL framework is to achieve a unified and robust AD model via synthesizing anomaly heterogeneities learned from various heterogeneous anomaly distributions. We summarize the Anomaly Heterogeneity Learning ( AHL ) procedure in Algorithm 1. Specifically, our framework first generates T heterogeneous anomaly datasets, with each subset is sampled from the training set and contains a mixture of normal samples and (pseudo) anomaly samples, denoted as {D i } T i =1 . In doing so, each subset is characterized by different set of normality/abnormality patterns,embodying heterogeneous anomaly distributions. We then employ a set of base models, denoted as { ϕ i } T i =1 , to learn the underlying anomalous heterogeneity from these heterogeneous anomaly dis-

ributions. Moreover, a self-supervised sequential modeling approach is introduced to estimate the generalization errors r i and importance scores w i for each base model. Finally, we incorporate knowledge learned from heterogeneous anomaly distributions into a unified heterogeneous abnormality detection model g to capture richer anomaly heterogeneity.

AHL is a generic framework, in which off-the-shelf openset anomaly detectors can be easily plugged and gain significantly improved generalization and accuracy in detecting both seen and unseen anomalies. Once we choose a base anomaly detector, the training strategy and objective function should be consistent with it. Following the proposed loss of base models ( i.e ., DRA and DevNet), we adopt the deviation loss [32] to evaluate the loss between predicted anomaly scores and ground truths in the whole training phase:

ℓ dev ( x , y ; h ) = I ( y = 0) | ( dev ( x ; h )) | + I ( y = 1) max(0 , m -dev ( x ; h )) ,

where I ( . ) is an indicator function that is equal to one when the condition is true, and zero otherwise; h ( · ) denotes the anomaly detection model. dev ( x ) = h ( x ) -µ r σ r with µ r and σ r representing the mean and standard deviation of a set of sampled anomaly scores from the Gaussian prior distribution N (0 , 1) . m is a confidence margin which defines a radius around the deviation.

## C. Detailed Empirical Results

## C.1. Full Results under General Setting

Table 7 shows the detailed comparison results of AHL and SOTA competing methods under the general setting. It includes the performance metrics of each category of MVTec AD dataset. Overall, our proposed AHL model consistently outperforms the baseline methods in both ten-shot and oneshot settings across all three application scenarios. AHL (DRA) achieves the best performance in terms of AUC. On average, AHL improves the AUC of DRA and DevNet by up to 4% and 9% , respectively.

## C.2. Full Results under Hard Setting

To investigate the detection performance of AHL framework on novel anomaly classes, we evaluate its performance under the hard setting, and present the detailed results for six multi-subset datasets, including each anomaly class-level performance, in Table 8. Overall, our models AHL (DRA) and AHL (DevNet) - achieve the best AUC results in both M = 1 and M = 10 setting protocols. Specifically, AHL improves the performances of DRA and DevNet by up to 3 . 2% and 3% AUC, respectively. The results here are consistent with the superiority performance of AHL in the general setting.