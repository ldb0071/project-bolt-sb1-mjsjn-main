Page 9

The DSR is trained in three stages. In the first stage , the quantized latent space encoder (Section 3.1), along with the VQ codebook and the general object appearance decoder are trained on ImageNet [8] to learn the subspace of natural images, which allows a high-fidelity reconstruction of general images. We use the procedure from [13] that minimizes the image reconstruction loss as well as the difference between the feature space projection F computed in the quantized latent space encoder (Figures 2 and 3) and its quantized version Q , i.e,

L st1 = L 2 ( I , I gen ) + L 2 ( sg [ F ] , Q ) + λ 1 L 2 ( F , sg [ Q ]) , (2)

where L 2 ( · ) is the Euclidean distance and sg [ · ] is the stop gradient operator constraining the operand to be a non-updated constant [13]. After training, the discrete latent space encoder, the codebook and the general object appearance decoder (coloured in magenta in Figure 2) are fixed.

In the second, anomaly detection training stage , the detection parts of DSR are trained on images of the selected object type. Anomaly-free training images are projected through the quantized latent space encoder into their

quantized feature representation Q . The surface anomaly generation method presented in Section 3.6 then generates the anomalies at the feature level, Q a , along with their ground truth masks M gt . The representation Q a (that replaces Q in Figure 2) is then forward passed and decoded into the anomaly mask M .

The anomaly detection module and the object-specific appearance decoder are trained by minimizing the focal loss between the ground truth M gt and predicted anomaly mask M , the L 2 distance between the subspace-restricted configurations ˜ F computed in the object-specific appearance decoder (Figure 4) and the non-anomalous input image quantized representation Q , and the L 2 distance between the non-anomalous input image I and its object-specific reconstruction I spc , i.e.,

L st2 = L foc ( M gt , M ) + λ 2 L 2 ( ˜ F , Q ) + λ 3 L 2 ( I , I spc ) . (3)