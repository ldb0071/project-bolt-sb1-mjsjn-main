Page 4

## 3.2. Learning Disentangled Abnormalities

Abnormality Learning with Seen Anomalies . Most real-world anomalies have only some subtle differences from normal images, sharing most of the common features with normal images. Patch-wise anomaly learning [4, 35, 60, 65] that learns anomaly scores for each small image patch has shown impressive performance in tackling this issue. Motivated by this, DRA utilizes a topK multiple-instance-learning (MIL) -based method in [35] to effectively learn the seen abnormality. As shown in Fig. 2b, for the feature map M x of each input image x , we generate pixel-wise vector representations D = { d i } h ' × w ' i =1 , each of which corresponds to the feature vector of a small patch of the input image. These patch-wise representations are then mapped to learn the anomaly scores of the image patches by an anomaly classifier g s : D → R . Since only selective

image patches contain abnormal features, we utilize an optimization using topK MIL to learn an anomaly score for an image based on the K most anomalous image patches, with the loss function defined as follows:

ℓ s ( x , y x ) = ℓ ( g s ( M x ; Θ s ) , y x ) , (2)

where ℓ is a binary classification loss function; y x = 1 if x is a seen anomaly, and y x = 0 if x is a normal sample otherwise; and

g s ( M x ; Θ s ) = max Ψ K ( M x ) ⊂ D 1 K ∑ d i ∈ Ψ K ( M x ) g s ( d i ; Θ s ) (3)

where Ψ K ( M x ) is a set of K vectors that have the largest anomaly scores among all vectors in M x . Abnormality Learning with Pseudo Anomalies . We further design a separate head to learn abnormalities that are different from the seen anomalies and simulate some possible classes of unseen anomaly. There are two effective methods to create such pseudo anomalies, including data augmentation-based methods [26,54] and outlier exposure [18,42]. Particularly, for the data augmentation-based method, we adapt the popular method CutMix [67] to generate pseudo anomalies ˜ x from normal images x n for training, which is defined as follows:

˜ x = T · C ( R ⊙ x n ) + ( 1 -T ( R ) ) ⊙ x n (4)

where R ∈ { 0 , 1 } h × w denotes a binary mask of random rectangle, 1 is an all-ones matrix, ⊙ is element-wise multiplication, T ( · ) is a randomly translate transformation, and C ( · ) is a random color jitter. As shown in Fig. 2a, the pseudo abnormality learning uses the same architecture and anomaly scoring method as the seen abnormality learning to learn fine-grained pseudo abnormal features:

ℓ p ( x , y x ) = ℓ ( g p ( M x ; Θ p ) , y x ) , (5)

where y x = 1 if x is a pseudo anomaly, i.e ., x = ˜ x , and y x = 0 if x is a normal sample otherwise; and g p ( M x ; Θ p ) is exactly the same as g s in Eq. (3), but g p is trained in a separate head with different anomaly data and parameters from g s to learn the pseudo abnormality. As discussed in Secs. 4.1 and 4.6, the outlier exposure method [18] is used in anomaly detection on medical datasets. In such cases, the pseudo anomalies ˜ x are samples randomly drawn from external data instead of creating from Eq. (4).