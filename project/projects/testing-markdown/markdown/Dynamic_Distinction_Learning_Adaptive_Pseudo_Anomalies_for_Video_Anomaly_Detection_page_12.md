Page 12

exposing the network to a wide variety of anomalies without the need for explicit enumeration or replication of each possible anomalous event, which in real-world applications is infeasible due to the vast and unpredictable nature of such events.

## 7.3. C3DSU Architecture (Results Supplementary)

The design of our Conv3DSkipUNet (C3DSU) model incorporates a Conv2D UNet structure, enhanced with custom ConvBlocks for both the Encoder and Decoder components, and augmented by the integration of Conv3D layers within the skip connections for handling the temporal dimension.

A ConvBlock in this context is engineered to facilitate multi-headed convolution. Specifically, it comprises four Conv2D layers, each employing 'same' padding to maintain dimensional consistency and a kernel size of 3 for capturing spatial details. These layers are executed in paral-

Figure 5. Evolution of the anomaly weight σ ( ℓ ) during the training of the C3DSU model on the Ped2 Dataset for 10 epochs.

<!-- image -->

Figure 6. Schematic illustration of an Encoder ConvBlock within the C3DSU architecture, highlighting the multi-headed convolution process. This diagram details the structure and flow through the ConvBlock, including the initial parallel Conv2D layers, concatenation, batch normalisation, ReLU activation, dimension reduction, and final Conv2D layer, followed by another round of batch normalisation and ReLU activation.

<!-- image -->

lel and their outputs are concatenated along the channel dimension, ensuring a rich feature representation. Following the concatenation, the process involves batch normalisation and activation through the ReLU function, aiming to stabilize learning and introduce non-linearity, respectively. The output is then restructured to reduce the Height and Width dimensions, the output is then passed through an additional Conv2D layer with 'same' padding, followed by another round of batch normalisation and ReLU activation. The Encoder ConvBlock's operational flow is depicted in Figure 6

for visual clarification.

f (X) without DDL

<!-- image -->