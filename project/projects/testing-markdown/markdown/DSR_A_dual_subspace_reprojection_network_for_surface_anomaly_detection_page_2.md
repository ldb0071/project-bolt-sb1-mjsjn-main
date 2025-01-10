Page 2

Most anomaly detection approaches are based on computing the difference between the inspected image and its image-level or feature-level reconstruction [1,2,18,5,22,3], with their reconstruction method trained only on anomaly-

Fig. 1. The dual decoder architecture with discrete feature space allows DSR robust object-specific reconstruction ( R DSR ) and accurate detection of near-in-distribution anomalies, which present a considerable challenge for the recent state-of-the-art ( M [22] ).

<!-- image -->

free images. These approaches assume that anomalies will be poorly reconstructed since they have never been observed during training and that the reconstruction failure on anomalies can be well detected by L 2 or SSIM [20] difference with the input image.

However, L 2 and SSIM measures can only detect anomalies that differ substantially from normal appearance. Subsequent works have addressed this problem by either learning the distance measure with a discriminative network [21] or by classifying the anomalies directly on the input image [11]. These methods require annotated anomalies at training time, and resort to simulation of anomalies from auxiliary datasets and copy-pasting and blending them with the anomaly-free training images. While these methods by far outperform the reconstruction-only methods, they rely substantially on the quality of the auxiliary dataset and the simulation process quality; their performance still degrades on near-in-distribution anomalies (Figure 1) since it is difficult to simulate these realistically.

In this paper we address two drawbacks of the surface anomaly detection state-of-the-art: the reliance on the auxiliary anomaly simulation datasets and poor near-in-distribution anomaly detection. We propose a dual subspace reprojection surface anomaly detection network (DSR). The network leverages the framework of discretized latent feature space image representation [16], and jointly learns a general and a normal-appearance-specific subspace re-projection to emphasize the anomaly detection capability.

The proposed architecture avoids reliance on auxiliary anomaly datasets in training anomaly discrimination. We propose a new anomaly simulation technique that generates the anomalies directly from the network's discretized latent space of natural images, leading to significant performance improvements on near-in-distribution anomaly detection (Figure 1).