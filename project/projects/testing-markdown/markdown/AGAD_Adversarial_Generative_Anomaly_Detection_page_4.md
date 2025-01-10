Page 4

 𝑎𝑑𝑐𝑜𝑛 = -𝔼 𝑥 ∼ 𝑝 𝑥 | ̂ 𝑥 -𝐺 ( ̂ 𝑥 ) | 1 . (8)

Normality Loss. Normality loss considers improving the reconstruction quality for normal data, as well as failing the reconstruction of the generated counterparts. The final formula is a weighted sum of the losses above, where 𝜆 𝑎𝑑𝑣 , 𝜆 𝑐𝑜𝑛 , 𝜆 𝑎𝑑𝑐𝑜𝑛 , 𝜆 𝑙𝑎𝑡 are the weighting parameters. It is formulated as:

 𝑛 = 𝜆 𝑎𝑑𝑣  𝑎𝑑𝑣 + 𝜆 𝑐𝑜𝑛  𝑐𝑜𝑛 + 𝜆 𝑎𝑑𝑐𝑜𝑛  𝑎𝑑𝑐𝑜𝑛 + 𝜆 𝑙𝑎𝑡  𝑙𝑎𝑡 . (9)

AnomalyLoss. Opposite to the normality loss, anomaly loss solely considers deteriorating the reconstruction of anomaly data with greater errors, Compared to minimizing the negative loss, we found using reciprocal can lead to a smooth training curve. It is formulated as:

 𝑎 = 𝜆 𝑎𝑑𝑣  𝑎𝑑𝑣 + 𝜆 𝑎𝑑𝑐𝑜𝑛 - 𝑎𝑑𝑐𝑜𝑛 + 𝜆 𝑙𝑎𝑡  𝑙𝑎𝑡 . (10)

Final Loss. Our final loss function is formulated as:

 = 𝑦  𝑎 +(1 𝑦 )  𝑛 , 𝑦 ∈ 0 , 1 , (11)

where 𝑦 is the groudtruth that indicates if the input data is abnormal or not. We followed 0-normal, 1-abnormal convention here.

## 3.3. AGAD Model Pipeline

Next, we dive into the details of the training procedures for our proposed AGAD model. We firstly introduced the naive network architectures we adopted as our backbone models. Then further discussed the effect of the involvement of anomaly data and presented our training algorithm.

## 3.3.1. Network Details

The proposed AGAD model is designed with a generator and a discriminator. The generator takes images as input and outputs generated images, while the discriminator takes images as inputs and outputs corresponding latent embeddings

as well as discriminate results (e.g. real/fake). We adopted a UNet++ Zhou, Siddiquee, Tajbakhsh and Liang (2020) as generator and a naive VGG-like Simonyan and Zisserman (2015) classifier as discriminator. The discriminator consists two 𝐶𝑜𝑛𝑣 -𝐵𝑁 -𝐿𝑒𝑎𝑘𝑦𝑅𝑒𝐿𝑈 3 blocks and a fully convolution classifier.

## 3.3.2. Learning with Limited Anomaly Data

As indicated by many studies Bottou (2010); Ge, Huang, Jin and Yuan (2015), mini-batch is a compromise that injects enough noise to each gradient update, while achieving a relative speedy convergence with less computational resources. Thus, whilst sampling mini-batches for training, we would guarantee there are at least 32 anomaly data sampled to avoid noisy gradient estimations by a small batched training when there is limited anomaly data sampled within the mini-batch. Meanwhile, batch normalization Ioffe and Szegedy (2015) is an essential component in neural networks that normalizes the input features by the learnt feature mean/variance within mini-batches. A previous research Xie, Tan, Gong, Wang, Yuille and Le (2020) stated the joint learning on the shared batch normalization layers for original and adversarial examples would lead to a worse performance since the adversarial distribution differs from the original. However, in this context, we speculate that the distribution differences are the critical discriminative features for network to learn. The corresponding ablation study refers to Section 6.2.