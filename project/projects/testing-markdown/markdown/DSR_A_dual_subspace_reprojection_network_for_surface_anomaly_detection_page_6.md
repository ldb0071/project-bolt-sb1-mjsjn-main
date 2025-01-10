Page 6

The subspace of VQ encoded natural images is captured by specific spatial configurations of quantized feature vectors. We apply a general object appearance decoder to learn decoding of these configurations into image reconstructions. The decoder first upsamples the low resolution Q lo and concatenates it with the Q hi , which is followed by two ResNet blocks and two transposed convolution upsampling blocks that map into the reconstructed image I gen .

## 3.3 Object-specific appearance decoder

The tasks of the second decoder, the object-specific appearance decoder (see Figure 4) is to restore local visual anomalies into feasible normal appearances of the object instances observed during training. In particular, we would like to restrict the appearance subspace, i.e., the allowed spatial VQ feature configurations, into configurations that agree with normal appearances. This is achieved by a subspace restriction module (Figure 4), which transforms both high- and lowresolution general input VQ representations ( Q = { Q hi , Q lo } ) into non-quantized object-specific subspace configurations ( ˜ F = { ˜ F lo , ˜ F hi } ). This is followed by a VQ projection (with codebooks K = { K hi , K lo } ) into object subspace-restricted quantized feature configurations ( ˜ Q = { ˜ Q hi , ˜ Q lo } ). The quantized representations are concatenated (the low-resolution representation is upsampled first) and decoded into reconstructed anomaly-free image I spc using a convolutional decoder. The subspace restriction modules (Figure 4) are encoder-decoder convolutional networks with three downsampling and corresponding upsampling blocks. The image reconstruction network consists of two downsampling convolutional blocks,

followed by four transposed convolution upsampling blocks. Examples of images with anomalies present and their anomaly-free reconstructions are shown in Figure 5.

Fig. 4. The object-specific appearance decoder architecture. The features in the quantized features maps Q are reduced by a subspace restriction module into non-quantized features ˜ F that are then vector-quantized (VQ) by the codebooks K into ˜ Q , which are then decoded into an anomaly-free image I spc .

<!-- image -->

<!-- image -->