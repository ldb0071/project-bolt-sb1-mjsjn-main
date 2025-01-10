Page 3

Instead of the commonly used image space reconstruction, the reconstruction of pretrained network features can also be used for surface anomaly detection [4, 25]. Anomalies are detected based on the assumption that features of a pre-trained network will not be faithfully reconstructued by another network trained only on anomaly-free images. Alternatively [20, 11] propose surface anomaly detection as identifying significant deviations from a Gaussian fitted to

anomaly-free features of a pre-trained network. This requires a unimodal distribution of the anomaly-free visual features which is problematic on diverse datasets. [16] propose a one-class variational auto-encoder gradient-based attention maps as output anomaly maps. However the method is sensitive to subtle anomalies close to the normal sample distribution.

Recently Patch-based one-class classification methods have been considered for surface anomaly detection [30]. These are based on one-class methods [22, 7] which attempt to estimate a decision boundary around anomaly-free data that separates it from anomalous samples by assuming a unimodal distribution of the anomaly-free data. This assumption is often violated in surface anomaly data.

## 3. DRÆM

The proposed discriminative joint reconstructionanomaly embedding method (DRÆM) is composed from a reconstructive and a discriminative sub-networks (see Figure 3). The reconstructive sub-network is trained to implicitly detect and reconstruct the anomalies with semantically plausible anomaly-free content, while keeping the non-anomalous regions of the input image unchanged. Simultaneously, the discriminative sub-network learns a joint reconstruction-anomaly embedding and produces accurate anomaly segmentation maps from the concatenated reconstructed and original appearance. Anomalous training examples are created by a conceptually simple process that simulates anomalies on anomaly-free images. This anomaly generation method provides an arbitrary amount of anomalous samples as well as pixel-perfect anomaly segmentation maps which can be used for training the proposed method without real anomalous samples.

## 3.1. Reconstructive sub-network

The reconstructive sub-network is formulated as an encoder-decoder architecture that converts the local patterns of an input image into patterns closer to the distribution of normal samples. The network is trained to reconstruct the original image I from an artificially corrupted version I a obtained by a simulator (see Section 3.3).

An l 2 loss is often used in reconstruction based anomaly detection methods [1, 2], however this assumes an independence between neighboring pixels, therefore a patch based SSIM [27] loss is additionally used as in [5, 31]:

L SSIM ( I, I r ) = 1 N p H ∑ i =1 W ∑ j =1 1 -SSIM ( I, I r ) ( i,j ) , (1)

where H and W are the height and width of image I , respectively. N p is equal to the number of pixels in I . I r is the reconstructed image output by the network. SSIM ( I, I r ) ( i,j ) is the SSIM value for patches of I and

I r , centered at image coordinates ( i, j ) . The reconstruction loss is therefore: