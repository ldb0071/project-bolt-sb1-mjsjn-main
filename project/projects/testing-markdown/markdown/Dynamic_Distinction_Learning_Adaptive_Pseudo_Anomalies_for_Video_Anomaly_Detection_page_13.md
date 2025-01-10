Page 13

Figure 7 showcases a visual comparison of anomaly detection in a scenario involving a cyclist riding a bicycle, an anomalous event within the Ped2 dataset. The sequence displays the original frame, followed by reconstructions without and with DDL, and finally, the residual differences between the reconstructions and the original frame. Notably, the application of DDL results in a reconstruction where the bicycle is almost entirely erased, signifying the model's training to poorly reconstruct unfamiliar shapes. This illustrates DDL's effectiveness in forcing the model to focus on normal patterns, thereby making anomalies, such as the

<!-- image -->

<!-- image -->

<!-- image -->

f (X)II without DDL Ilxt

<!-- image -->

f (X)II Ilxt

Figure 7. Visual anomaly detection comparison in the Ped2 dataset featuring a cyclist riding a bicycle. From left to right: the original frame, reconstruction without Dynamic Distinction Learning (DDL), reconstruction with DDL, and beneath the residual difference highlighting the anomaly.

The overarching UNet architecture is assembled with eight such ConvBlocks, evenly split between the Encoder and Decoder. Each ConvBlock in the Encoder is paired with a corresponding ConvBlock in the Decoder via skip connections. These connections are uniquely designed to pass through Conv3D layers, thereby incorporating the temporal aspect into the spatial information flow. This mechanism ensures that while individual frames are initially processed as separate images by the Conv2D layers in the Encoder and Decoder, the Conv3D layers within the skip connections facilitate the integration of temporal information, essential for effective video analysis.

## 7.4. Qualitative Results (Ablations Supplementary)

To complement the quantitative analysis, qualitative assessments were conducted to visually inspect the model's performance in identifying anomalies within the Ped2 and Avenue datasets. These assessments provide insight into the model's ability to reconstruct scenes and highlight anomalous activities when DDL is applied versus when it is not.

f (X) with DDL

Figure 8. Visual anomaly detection comparison in the Avenue dataset illustrating a boy skipping. From left to right: the original frame, reconstruction without Dynamic Distinction Learning (DDL), reconstruction with DDL, and beneath the residual difference emphasizing the anomaly.

<!-- image -->

bicycle in this case, more pronounced.

Similarly, Figure 8 presents a visual analysis involving a boy skipping, an anomalous event in the Avenue dataset. The illustration includes the original frame along with reconstructions without and with DDL, supplemented by the residual differences highlighting the anomaly. The comparison clearly demonstrates that with DDL, the anomaly of the boy skipping is accentuated more effectively than without DDL. This enhancement is evident in the residual images, where DDL's reconstruction struggles more with the skipping motion, thereby amplifying the distinction from normal activity.