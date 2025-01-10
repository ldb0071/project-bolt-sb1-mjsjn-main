Page 14

erated by each head have the same semantic, and so we calculate the sum of all the anomaly scores (and a negated normal score) as the final anomaly score. In addition, to solve the multi-scale problem, we use an image pyramid module with two-layer image pyramid, which obtains anomaly scores at different scales by inputting original images of various sizes, and calculates the mean value as the final anomaly score.

For the reference sets in Latent Residual Abnormality Learning, we found that mixing some generated pseudoanomaly samples into normal samples can further improve performance. We speculate that adding pseudo-anomaly samples can get more challenging residual samples to help the network adapt to extreme cases. Therefore, we use the dataset mixed with normal and pseudo-abnormal samples as the reference set in the final implementation.

## B.1.1 Loss Function

DRA can be optimized using different anomaly score loss functions. We use deviation loss [35] in our final implementation to optimize DRA, because it is generally more effective and stable than other popular loss functions, as shown in the experimental results in Section C.2. Particularly, a deviation loss optimizes the anomaly scoring network by a Gaussian prior score, with the deviation specified as a Zscore:

dev ( x i ; Θ) = g ( f ( x ; Θ f ); Θ g ) -µ R σ R , (10)

where µ R and σ R is the mean and standard deviation of the prior-based anomaly score set drawn from N ( µ, σ 2 ) . The deviation loss is specified using the contrastive loss [15] with the deviation plugged into:

ℓ ( x i , µ R , σ R ; Θ ) = (1 -y i ) | dev ( x i ; Θ) | + y i max ( 0 , a -dev ( x i ; Θ) ) , (11)

where y = 1 indicate an anomaly and y = 0 indicate a normal sample, and a is equivalent to a Z-Score confidence interval parameter.

## B.2. Implementation of Competing Methods

In the main text, we present five recent and closely related state-of-the-art (SOTA) competing methods. Here we introduce two additional competing methods. Following is the detailed description and implementation details of these seven methods:

KDAD [47] is an unsupervised deep anomaly detector based on multi-resolution knowledge distillation. We experiment with the code provided by its authors 1 and report