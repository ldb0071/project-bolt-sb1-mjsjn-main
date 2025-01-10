Page 8

With the proposed method, parameters θ are trained by minimizing the anomaly scores for nonanomalous instances while maximizing the empirical inexact AUC (8). To make the empirical inexact AUC differentiable with respect to the parameters, we use sigmoid function σ ( A -B ) = 1 1+exp( -( A -B )) instead of step function I ( A > B ), which is often used for a smooth approximation of the step function. Then the objective function to be minimized is given:

E = 1 |N| ∑ x N j ∈N a ( x N j ) -λ 1 |S||N| ∑ B k ∈S ∑ x N j ∈N σ ( max x B ki ∈B k a ( x B ki ) -a ( x N j ) ) , (10)

where λ ≥ 0 is a hyperparameter that can be tuned using the inexact AUC on the validation data. When there are no inexact anomaly sets or λ = 0, the second term becomes zero, and the first term on the non-anomalous instances remains with the objective function, which is the same objective function with a standard autoencoder. By the unsupervised anomaly detection mechanism of the first term in (10), the proposed method can detect anomalous instances even when there are few inexact anomaly sets. The computational complexity of calculating the objective function (10) is O ( |S||B| + |S||N| ), where |B| is the average number of instances in an inexact anomaly set, the first term is for finding the maximum of anomaly scores in every inexact anomaly set, and the second term is for calculating the difference of scores between inexact anomalous instances and non-anomalous instances in the second term in (10).

## 5 Experiments

## 5.1 Data

We evaluated our proposed supervised anomaly detection method with a synthetic dataset and nine datasets used for unsupervised anomaly detection (Campos et al., 2016) 1 .

The synthetic dataset was generated from a two-dimensional Gaussian mixture model shown in Figure 2(a,b). The non-anomalous instances were generated from two unit-variance Gaussian distributions with mean at (-2,0) and (2,0), as shown by blue triangles in Figure 2(a). The anomalous instances were generated from a Gaussian distribution with mean (0,-1.5) with a small variance and a Gaussian distribution with mean (0,3) with a wide variance as shown by red circles in Figure 2(a). The latter anomalous Gaussian was only used for test data, and it was not used for training and validation data as shown in Figure 2(b). We generated 500 instances from the non-anomalous Gaussians, and 200 instances from the anomalous Gaussians.

Table 2 shows the following values of the nine anomaly detection datasets: the number of anomalous instances |A| , the number of non-anomalous instances |N| , anomaly ratio |A| |N| , and the number of attributes D . Each attribute was linearly normalized to range [0 , 1], and duplicate instances were removed. The original datasets contained only exact anomaly labels (Campos et al., 2016). We constructed inexact anomaly sets by randomly sampling non-anomalous instances and an anomalous instance for each set.