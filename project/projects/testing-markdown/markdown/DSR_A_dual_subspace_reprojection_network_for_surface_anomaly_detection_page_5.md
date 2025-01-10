Page 5

In particular, the quantized latent space encoder module in Figure 2 accepts the input image I and projects it into a feature space F using a Resnet-based encoder. A quantized feature representation Q of the input image is obtained by replacing each feature vector F ij with its nearest neighbor e l in K , i.e,

Q i,j = q ( F i,j ) = argmin e l ∈ K ( || F i,j -e l || ) . (1)

In the following, we refer to this operation as vector quantization (VQ). Note that the input image is encoded at two levels of detail using low- and high-resolution codebooks ( K lo , K hi ), producing Q lo and Q hi . The two-level VQ has recently

been reported to produce superior reconstructions [16]. The architecture of the quantized latent space encoder is shown in Figure 3. The quantized feature maps Q hi and Q low produced by the quantized latent space encoder are 4 × and 8 × smaller than the original input image, respectively.

Fig. 3. The quantized latent space encoder architecture. Two residual blocks extract image features at different spatial resolutions. The low-resolution features F lo are quantized by the codebook K lo into a feature representation Q lo . The high-resolution features are concatenated by upsampled Q lo , followed by a convolutional block and quantized by the codebook K hi into a high-resolution representation Q hi .

<!-- image -->

## 3.2 General object appearance decoder