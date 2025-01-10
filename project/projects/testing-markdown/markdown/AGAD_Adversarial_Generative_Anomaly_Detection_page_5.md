Page 5

## Algorithm 1 Training of AGAD

Ensure: Anomaly detection model 𝑓 𝜃

Require: 𝑆 : a set of images with normal 𝑆 𝑛 and abnormal 𝑆 𝑎 . 𝑓 𝜃 : a model parametrized by 𝜃 . 𝛿 : threshold to reset 𝜃 𝑑 . 𝜂 : learning rate.

- 1: repeat
- 3: ̂ 𝑥 = 𝐺 ( 𝑥 ) , 𝑦, 𝑧 = 𝐷 ( 𝑥 ) {Reconstruct input}
- 2: Read mini-batch 𝐵 = { 𝑥 1 , 𝑥 2 , ..., 𝑥 𝑚 }
- 4: ̂ 𝑥 ' = 𝐺 ( ̂ 𝑥 ) , ̂ 𝑦, ̂𝑧 = 𝐷 ( ̂ 𝑥 ) {Reconstruct reconstructed input}
- 6: 𝐿 𝑔 = 𝜆 𝑎𝑑𝑣 𝑙 𝑎𝑑𝑣 ( ̂ 𝑦, 1) + 𝜆 𝑐𝑜𝑛 𝑙 𝑐𝑜𝑛 ( 𝑥, ̂𝑥 ) + 𝜆 𝑎𝑑𝑐𝑜𝑛 𝑙 𝑎𝑑𝑐𝑜𝑛 ( ̂ 𝑥, ̂𝑥 ' ) + 𝜆 𝑙𝑎𝑡 𝑙 𝑙𝑎𝑡 ( 𝑧, ̂𝑧 ) 7: 𝐿 𝑑 = 𝑙 𝑎𝑑𝑣 ( ̂ 𝑦, 0) + 𝑙 𝑎𝑑𝑣 ( 𝑦, 1)
- 5: if 𝑥 ∈ 𝑆 𝑛 then
- 8: else if 𝑥 ∈ 𝑆 𝑎 then
- 10: 𝐿 𝑑 = 𝑙 𝑎𝑑𝑣 ( 𝑦, 0)
- 9: 𝐿 𝑔 = 𝜆 𝑎𝑑𝑣 / 𝑙 𝑎𝑑𝑣 ( ̂ 𝑦, 0) 𝜆 𝑎𝑑𝑐𝑜𝑛 / 𝑙 𝑎𝑑𝑐𝑜𝑛 ( ̂ 𝑥, ̂𝑥 ' ) + 𝜆 𝑙𝑎𝑡 / 𝑙 𝑙𝑎𝑡 ( 𝑧, ̂𝑧 )
- 11: end if
- 13: 𝜃 𝑑 ⇐ 𝜃 𝑑 -𝜂 Δ 𝜃 𝑑 𝐿 𝑑 {Update NetD by stochastic gradient}
- 12: 𝜃 𝑔 ⇐ 𝜃 𝑔 -𝜂 Δ 𝜃 𝑑 𝐿 𝑔 {Update NetG by stochastic gradient}
- 14: until training finished

## 3.3.3. Anomaly Score

During the inference time, we used an intuitive scoring function based on the reconstruction quality under image domain to pick out anomaly data. The scoring function is defined as 𝐴 ( 𝑥 ) = || 𝑥 -̂ 𝑥 || 2 , where || · || 2 represents the 𝐿 2 norm, 𝑥 and ̂ 𝑥 represent the input data and the reconstructed data 𝐺 ( 𝑥 ) respectively.

## 3.4. Relation to Other Algorithms

GANomaly Akcay et al. (2019a) and Skip-GANomaly Akcay et al. (2019b) are semi-supervised anomaly detection methods that not only reconstruct input images, but also try to regularize the latent features between the input images and reconstructed images. Specifically, Skip-GANomaly extended GANomaly by replacing the generator with a UNet model, resulting in performance gain. Our proposed method extends the GANomaly framework and makes use of the generated pseudo-anomaly as contextual adversarial information to improve anomaly detection performance.

GAN-based supervised anomaly detection Kim et al. (2020); Mishra (2017); Gonzalez et al. (2002) considers supervised anomaly detection in an imbalanced dataset scenario using reconstruction-based anomaly detection methods. Our method had similar ideas to improve the reconstruction performance for normalities while impair the reconstruction performance for abnormalities. Our strength is to fit both supervised and semi-supervised scenarios, and can leverage generated pseudo-anomaly together with the existence of true anomaly data to improve anomaly detection performance.

## 4. Benchmarks

In this section, we present major experiment results to demonstrate the effectiveness of our proposed AGAD model. We elaborate the public datasets we adopted, then compare our models with several semi-supervised and supervised anomaly detection benchmark methods respectively. Finally, we further evaluate the qualitative results of our method.

## 4.1. Benchmark Datasets

Weexperiment on benchmark datasets including MNIST, Fashion-MNIST, CIFAR-10 and CIFAR-100. A short briefing of each dataset and preprocessing methods are presented as following.

- · MNIST is a handwritten digits with 10 equally distributed classes that has a training set of 60,000 examples, and a test set of 10,000 examples. We resized the images to 32x32 in all experiments.
- · Fashion-MNIST is a dataset of Zalando's article images - consisting of a training set of 60,000 examples and a test set of 10,000 examples. Each example is a 28x28 grayscale image, associated with a label from 10 classes. We resized the images to 32x32 in all experiments.

- · CIFAR-10 consists of 60,000 32x32 color images in 10 equally distributed classes with 6,000 images per class, including 5,000 training images and 1,000 test images.
- · CIFAR-100 similar to CIFAR-10, except with 100 classes containing 600 images each. There are 500 training images and 100 testing images per class. The 100 classes in the CIFAR-100 are grouped into 20 superclasses. Each image comes with a "fine" label (the class to which it belongs) and a "coarse" label (the superclass to which it belongs), which we use in the experiments.