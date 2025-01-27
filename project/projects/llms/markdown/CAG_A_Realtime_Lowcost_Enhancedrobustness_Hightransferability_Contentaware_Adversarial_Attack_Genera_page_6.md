# Page 6

## Page Information

- **Type**: table_page
- **Word Count**: 533
- **Has Tables**: True
- **Has Figures**: False

## Content

# Page 6

## 2.1 Adversarial Attacks

To define an adversarial attack, let X = { x 1 , ..., x m } be a set of the valid inputs from the dataset, y ∈ { 1 , ..., L } be the valid class label, and F ( · ) be the well-trained DNN classifier. Let ( x i , y i ) denote the i -th benign instance and the

glyph[negationslash]

corresponding true label. The goal of an adversarial attack is to create the x ' i = x i + δ , where δ is imperceptible adversarial perturbation. A nontargeted attack requires F ( x i ) = y i and a targeted attack specifies t = i such that F ( x ' i ) = y t .

FGSM Fast gradient sign method (FGSM) is a one-step fast-adversarial-example-generation approach (Goodfellow, Shlens, and Szegedy 2014). It aims to linearize loss function in L ∞ neighborhood of a legitimate input and to find the exact maximum of the linearized loss function. Correspondingly, its adversarial example generation formula is as follows:

x ' = x + glyph[epsilon1] · sign (∆ J ( x, y true )) ,

where y true denotes the true label, ∆ J ( ., . ) computes the gradient of the loss function, and sign denotes the sign function. Notice that here glyph[epsilon1] is the attack strength parameter to control the balance between the attack performance and the norm of the perturbations.

I-FGSM & PGD Although FGSM is fast, its attack performance is relatively weak. Researchers have proposed various approaches to achieve stronger attack by improving the vanilla FGSM method. Kurakin et al. (2016) propose to take multiple steps of FGSM (I-FGSM) with smaller attack strength α in an iterative way:

x ' N +1 = Clip glyph[epsilon1] { x ' N + α · sign (∆ J ( x ' N , y true ) } ,

where x ' N is the adversarial image at the N -th iteration, and Clip {·} clips the overall attack strength back to glyph[epsilon1] at the end of the iteration. Notice that in the case of using L ∞ norm, I-FGSM is equivalent to another popular iteration-based attack method (PGD) (Madry et al. 2017).

C&W C&W (Carlini and Wagner 2017) is an optimization-based attack method. It aims to optimize the loss function as follows:

‖ x ' -x ‖ p + c · max(max i = t f ( x ' ) i -f ( x ' ) t , -κ ) ,

glyph[negationslash]

where t is the targeted class, f ( · ) denotes the softmax function, c is a constant set by binary search, and κ is an adjustable parameter that encourages the attacker to find an adversarial example being classified as class t with high confidence. By minimizing the above loss function using Adam optimizer in an iterative way, C&W can achieve high ASR with low perturbation norm.

Generative Model-based One drawback of the iterative methods mentioned above is long generating time. Hence another method to generate adversarial examples is to use a generative model, such as GAN, Autoencoder (Goodfellow et al. 2014) or U-Net. For instance, Xiao et al. (2018) apply AdvGAN to craft perceptually realistic adversarial examples. Moreover, Baluja et al. (2017) develop an adversarial transformation network to convert inputs into adversarial examples. Poursaeed et al. (2018) propose a method they name Generative Adversarial Perturbations (GAP) that uses a ResNet-based generative model (Johnson, Alahi, and FeiFei 2016) to perform adversarial attack.

glyph[negationslash]

## Visual Content

### Page Preview

![Page 6](/projects/llms/images/CAG_A_Realtime_Lowcost_Enhancedrobustness_Hightransferability_Contentaware_Adversarial_Attack_Genera_page_6.png)

## Tables

### Table 1

|  | ASR | Acc. | L
2 | Time |
| --- | --- | --- | --- | --- |
| I-FGSM | 99.53% | 0.05% | 0.106 | 13m24s |
| PGD | 99.56% | 0.22% | 0.106 | 12m56s |
| C&W | 99.85% | 0.14% | 0.009 | >10h |
| CAG | 97.29% | 1.4% | 0.100 | 1.44s |
