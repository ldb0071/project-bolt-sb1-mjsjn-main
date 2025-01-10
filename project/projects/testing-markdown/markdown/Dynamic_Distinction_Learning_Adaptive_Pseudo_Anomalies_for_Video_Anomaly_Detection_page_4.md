Page 4

Here, the element-wise multiplication ( · ) facilitates the precise control over the extent of noise addition, allowing for variable distortion levels that are directly influenced by the anomaly weight, which evolves during the training phase.

The subsequent phase involves the formulation of the pseudo-anomalous frames, X A . These frames emerge from overlaying the noise-infused frames, X ¯ A , onto the original input frames, X , strictly within the boundaries defined by the object masks M . The mathematical representation of this process is captured by:

X A = (1 -M ) · X + M · X ¯ A (2)

Through this method, we ensure that the noise, symbolizing potential anomalies, is selectively applied to the areas of interest - those being the detected objects within the frame. This approach not only maintains the contextual relevance of the introduced anomalies but also simulates a variety of anomalous patterns by leveraging the variability in noise composition; we elaborate on this in Section 7.2 within the Supplementary Material. By focusing on object regions, our method aims to create realistic and pertinent anomalies, enhancing the model's ability to detect and learn from these fabricated irregularities, which are designed to mimic a diverse spectrum of anomalous behaviors and appearances, including unseen shapes and uncommon motion blurs.

## 3.2. Reconstruction Model Definition

Wedefine a reconstruction model f = E·D , where E and D represent some encoder and decoder parts of a deep learning architecture, respectively. The choice of architecture is flexible and can include, but is not limited to, AutoEncoders,

Figure 1. The Dynamic Distinction Learning (DDL) Architecture: This diagram illustrates the DDL model's workflow, including object detection and tracking, random object masking, pseudo anomaly creation, our C3DSU model and the distinction loss calculation. The architecture depicts how the pseudo anomalies are created, then passed through the model along with their normal counter parts. The diagram also provides a visual depiction of the distinction loss calculation, showing how the model learns to minimize the numerator and maximize the denominator.

<!-- image -->

UNet structures, or other suitable convolutional neural networks designed for video reconstruction.

In practice we employ an adaptation of a 2D UNet model, tailored for the analysis of temporal data through the integration of 3D convolutional layers between skip connections. We call this architecture a Conv3DSkipUNet (C3DSU or f for the context of this work); more detail of our architecture can be found in Section 7.3 within the Supplementary Material. The model receives an input such as X and returns a reconstructed output f ( X ) ∈ R c × t × H × W , where t represents the middle frame in T ; that is, the model receives an odd sequence of frames as an input and returns the reconstructed middle frame.

## 3.3. Loss Function

We define a loss function, L , which integrates the standard reconstruction loss with our novel distinction loss to finetune the model's sensitivity to anomalies.