# Page 8

## Page Information

- **Type**: main_content
- **Word Count**: 428
- **Has Tables**: False
- **Has Figures**: False

## Content

# Page 8

## 3 Motivations

Despite the abundance of researches on adversarial attack methods described in Section 2, existing approaches still suffer from several inherent drawbacks-in particular from the perspective of practical deployment.

Long Generation Time Iteration-based approaches predominate among current state-of-the-art methods, including PGDandC&W.Consequently, generating adversarial examples using iteration is time-expensive and requires extensive computational resources, especially for the targeted attack. For example, to achieve a high ASR, C&W method takes hours to generate 100 large-size adversarial examples on a GPU. Such long generation time makes launching the adversarial attack in real-time setting infeasible.

High Memory Cost Using an iteration-free generative model-based attack promises to avoid long generation time (Xiao et al. 2018; Poursaeed et al. 2018; Baluja and Fischer 2017). However, in these existing works if the attackers wants to achieve targeted attack to a specific class, they have to train different generator models for different targeted classes. For example, to prepare for the targeted attack to 1000 classes in the ImageNet dataset, in total 1000 different generator models have to be trained and stored, thereby causing massive memory cost.

Insufficient Robustness To date, most adversarial example generation is based on the search over the entire input size instead of focusing on the critical part of legitimate object content. Noticing this phenomenon, many defense methods have been developed to improve defense performance via integrating this information into the defense scheme. For

instance, Luo et al. propose to mask out the background regions with little transformation performed on the critical areas (Luo et al. 2015). Similarly, Prakash et al. propose to use pixel deflection to denoise and reconstruct the input by locally redistributing pixels under the guidance of the object position (2018). Consequently, such well-designed defense schemes make the existing adversarial attack exhibit insufficient robustness.

Low Transferability Most adversarial attack methods can achieve high ASR in the white-box attack scenario. However, in real-world applications, black-box attack is a more common environment setting. In such cases, the transferability of the generated adversarial examples is important to ensure a successful attack. However, to date on large-scale datasets and large DNN models, the existing adversarial attack approaches exhibit low transferability, thereby impeding the feasibility of launching real-life black-box attack.

Our Motivation Motivated to redress the above challenges plaguing the existing adversarial attack methods, we aim to develop an adversarial attack method that can 1) generate each adversarial example in a real-time manner; 2) require only one model for different targeted classes; 3) exhibit strong robustness against the-state-of-the-art defense techniques; and 4) exhibit high transferability in the blackbox attack scenario. To fulfill those requirements, we develop CAG, an attack method with fast generation speed, low memory cost, improved robustness and high transferability. Next, we describe the model training and attack generation schemes of CAG in detail.

## Visual Content

### Page Preview

![Page 8](/projects/llms/images/CAG_A_Realtime_Lowcost_Enhancedrobustness_Hightransferability_Contentaware_Adversarial_Attack_Genera_page_8.png)
