Page 3

Learning Inand Out-of-distribution . Out-ofdistribution (OOD) detection [17, 18, 20, 29, 43, 68] and open-set recognition [1, 30, 48, 66, 73] are related tasks to ours. However, they aim at guaranteeing accurate multiclass inlier classification while detecting OOD/uncertain samples, whereas our task is focused on anomaly detection exclusively. Further, despite the use of pseudo anomalies

Figure 2. Overview of our proposed framework. (a) presents the high-level procedure of learning three disentangled abnormalities, (b) shows the abnormality feature learning in the plain (non-composite) feature space for the seen and pseudo abnormality learning heads, and (c) shows the framework of our proposed latent residual abnormality learning in a composite feature space.

<!-- image -->

like outlier exposure [18, 20] shows effective performance, the current models in these two tasks are also assumed to be inaccessible to any true anomalous samples.

## 3. Proposed Approach

Problem Statement The studied problem, open-set supervised AD, can be formally stated as follows. Given a set of training samples X = { x i } N + M i =1 , in which X n = { x 1 , x 2 , · · · , x N } is the normal sample set and X a = { x N +1 , x N +2 , · · · , x N + M } ( M ≪ N ) is a very small set of annotated anomalies that provide some knowledge about true anomalies, and the M anomalies belong to the seen anomaly classes S ⊂ C , where C = { c i } | C | i =1 denotes the set of all possible anomaly classes, and then the goal is to detect both seen and unseen anomaly classes by learning an anomaly scoring function g : X → R that assigns larger anomaly scores to both seen and unseen anomalies than normal samples.

## 3.1. Overview of Our Approach

Our proposed approach DRA is designed to learn disentangled representations of diverse abnormalities to effectively detect both seen and unseen anomalies. The learned abnormality representations include the seen abnormality illustrated by the limited given anomaly examples, and the unseen abnormalities illustrated by pseudo anomalies and latent residual anomalies ( i.e ., samples that have unusual residuals compared to normal examples in a learned feature space). In doing so, DRA mitigates the issue of biasing towards seen anomalies and learns generalized detection models. The high-level overview of our proposed framework is provided in Fig. 2a, which is composed of three main modules, including seen, pseudo, and latent residual abnormality learning heads. The first two heads learn abnormality representations in a plain (non-composite) feature space, as shown in Fig. 2b, while the last head learns

composite abnormality representations by looking into the deviation of the residual features of input samples to some reference ( i.e ., normal) images in a learned feature space, as shown in Fig. 2c. Particularly, given a feature extraction network f : X → M for extracting the intermediate feature map M ∈ M ⊂ R c ' × h ' × w ' from a training image x ∈ X ⊂ R c × h × w , and a set of abnormality learning heads G = { g i } | G | i =1 , where each head g : M → R learns an anomaly score for one type of abnormality, then the overall objective of DRA can be given as follows:

arg min Θ | G | ∑ i =1 ℓ i ( g i ( f ( x ; Θ f ); Θ i ) , y x ) , (1)

where Θ contains all weight parameters, y x denotes the supervision information of x , and ℓ i denotes a loss function for one head. The feature network f is jointly optimized by all the downstream abnormality learning heads, while these heads are independent from each other in learning the specific abnormality. Below we introduce each head in detail.