Page 3

max 𝜃 𝐺  𝑑𝑖𝑠𝑡 (  𝑎 , 𝐺 (  𝑎 )) , (3)

max 𝐷 [log (1 𝐷 (  𝑎 ; 𝜃 𝐷 )] . (4)

The corresponding structure is shown in Figure 1.

## 3.1.1. Contextual Adversarial Information

In general, our consideration is not to expect a strong generator that reconstructs normal data samples perfectly, but enlarges upon the differences between the normality and abnormality data. Essentially, the introduced contextual

adversarial information leverages pseudo-anomaly features that we generated against normality data, hereby the same generator reconstructs normalities while failed the reconstruction of pseudo-anomaly examples, and therefore, aware the anomaly features.

## 3.2. Objective Function Decomposition

Adversarial Loss. We utilized the common adversarial loss Equation (5) proposed in Goodfellow et al. (2014) to ensure that the network 𝐺 generates realistic reconstructions under the adversarial training with 𝐷 . It is formulated as:

Our method fits both supervised and semi-supervised scenarios and hereby includes a Normality Loss for normalities and a Anomaly Loss for abnormalities. The detailed composition will be discussed as following.

 𝑎𝑑𝑣 = 𝔼 𝑥 ∼ 𝑝 𝑥 [log 𝐷 ( 𝑥 )] + 𝔼 𝑥 ∼ 𝑝 𝑥 [log[1 𝐷 ( ̂ 𝑥 )]] . (5)

Contextual Loss. As illustrated by Akcay et al. (2019b), the adversarial loss will not guarantee to learn the contextual information with respect to the input. Specifically, the adversarial loss may produce realistic reconstructions to fool the 𝐷 sufficiently, but may lose the contextual information that contains original image details. Thus, a 𝐿 1 loss is used towards a better reconstruction. It is formulated as:

 𝑐𝑜𝑛 = 𝔼 𝑥 ∼ 𝑝 𝑥 | 𝑥 -̂ 𝑥 | 1 . (6)

Latent Loss. Equation (5) and Equation (6) minimize  𝑑𝑖𝑠𝑡 (  , ̂  ) for producing realistic reconstructions with respect to the input in the pixel-level. Meanwhile, a latentreconstruction loss Equation (7) is also used to ensure the solid reconstruction of latent representations. It is formulated as:

 𝑙𝑎𝑡 = 𝔼 𝑥 ∼ 𝑝 𝑥 | 𝐷  ( 𝑥 ) -𝐷  ( ̂ 𝑥 ) | 2 . (7)

Contextual Adversarial Loss 2 . In order to differentiate from the normalities, we intend to maximize the reconstruction error for anomaly data, including the true anomalies and the reconstructed pseudo-anomaly data. We formulated contextual adversarial loss based on an intuitive theorem that maximizing a function is equivalent to minimize its negative. It is formulated as: