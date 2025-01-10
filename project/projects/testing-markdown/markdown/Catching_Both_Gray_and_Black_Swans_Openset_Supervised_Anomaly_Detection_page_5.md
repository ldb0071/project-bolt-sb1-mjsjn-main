Page 5

Abnormality Learning with Latent Residual Anomalies . Some anomalies, such as previously unknown anomalies that share no common abnormal features with the seen anomalies and have only small difference to the normal samples, are difficult to detect by using only the features of the anomalies themselves, but they can be easily detected in a high-order composite feature space provided that the

composite features are more discriminative. As anomalies are characterized by their difference from normal data, we utilize the difference between the features of the anomalies and normal feature representations to learn such discriminative composite features. More specifically, we propose the latent residual abnormality learning that learns anomaly scores of samples based on their feature residuals comparing to the features of some reference images (normal images) in a learned feature space. As shown in Fig. 2c, to obtain the latent feature residuals, we first use a small set of images randomly drawn from the normal data as the reference data, and compute the mean of their feature maps to obtain the reference normal feature map:

M r = 1 N r N r ∑ i =1 f ( x r i ; Θ f ) , (6)

where x r i is a reference normal image, and N r is a hyperparameter that represents the size of the reference set. For a given training image x , we perform element-wise subtraction between its feature map M x and the reference normal feature map M r that is fixed for all training and testing samples, resulting in a residual feature map M r ⊖ x for x :

M r ⊖ x = M r ⊖ M x , (7)

where ⊖ denotes element-wise subtraction. We then perform an anomaly classification upon these residual features:

ℓ r ( x , y x ) = ℓ ( g r ( M r ⊖ x ; Θ r ) , y x ) , (8)

where y x = 1 if x is a seen/pseudo anomaly, and y x = 0 if x is a normal sample otherwise. Again, g r uses exactly the same method to obtain the anomaly score as g s in Eq. 3, but it is trained in a separate head with the parameters Θ r using different training inputs, i.e ., residual feature map M r ⊖ x .

Since the g s , g p and g r heads focus on learning the abnormality representations, the jointly learned feature map in f does not well model the normal features. To address this issue, we add a separate normality learning head as follows:

ℓ n ( x , y x ) = ℓ ( g n ( 1 h ' × w ' h ' × w ' ∑ i =1 d i ; Θ n ) , y x ) , (9)

where g n : D → R is a fully-connected binary anomaly classifier that discriminates normal samples from all seen and pseudo anomalies. Unlike abnormal features that are often fine-grained local features, normal features are holistic global features. Hence, g n does not use the topK MILbased anomaly scoring as in other heads and learns holistic normal scores instead.