Page 7

- · With σ ( ℓ ) approaching zero, the noise's influence on X A is minimized, leading to a scenario where X A is almost identical to X . This presents a challenge in distinguishing between normal and anomalous frames, as P and N become similar, pushing L dist ≈ 1 . This can be visualized in Figure 3 (a).
- · On the other hand, as σ ( ℓ ) tends towards one, the anomalous region is replaced with something which almost entirely resembles noise. The model then faces the nearly impossible challenge of reconstructing the anomalous regions, thus rendering the distinction loss redundant, as shown in Figure 3 (b).

However, striking the right balance for σ ( ℓ ) is essential: it should be low enough so that the model, f , is able to reconstruct normality from a pseudo anomalous frame, but not so low where the pseudo-anomalous frame is too similar to the normal frame; causing L dist ≈ 1 . The adjustment of σ ( ℓ ) is carried out through backpropagation during training, allowing the model to iteratively find the optimal balance to maximize its proficiency in anomaly detection, aiming to pinpoint the smallest discernible anomaly from normalcy.

## 3.4. Inference

During the inference phase, the components involved in training, specifically the anomaly weight, object detection

and tracking, and the Pseudo Anomaly Creator, are not utilized. The inference stage is streamlined to function through a conventional reconstruction approach. This process entails imposing a sliding window across each video, then submitting a sequence of video frames directly into the reconstruction model, which then processes these frames to output a reconstructed version of the middle frame.

## 4. Datasets

Our investigation utilizes a suite of video datasets to evaluate the adaptability and effectiveness of our proposed pseudo-anomalous loss approach in more complex scenarios. Specifically, we focus on three prominent video datasets: Ped2, CUHK Avenue, and ShanghaiTech. These datasets, with their varied and intricate anomaly instances, offer a robust testing ground to assess the performance of our model under diverse conditions.

The Ped2 dataset [25], sourced from pedestrian area surveillance footage, is notable for its range of anomalous events such as biking, skating, or irregular movement patterns. This dataset provides video clips with a frame resolution of 360 × 240 , enabling a diverse sampling environment for anomaly detection research.

The CUHK Avenue dataset [32], originating from surveillance systems at the Chinese University of Hong Kong's Avenue, documents typical anomalies like running, loitering, and object throwing. These activities are unusual for the setting, making it an ideal dataset for testing anomaly detection models. Videos in this dataset are presented at a resolution of 640 × 360 , offering a detailed view for analysis.

Comprising surveillance footage from a variety of indoor and outdoor scenes, the ShanghaiTech dataset [21] introduces a wide range of anomalies, including burglary, climbing, and fighting. The dataset's videos feature a resolution of 856 × 480 , with variable frame numbers across clips. This diversity makes the ShanghaiTech dataset a comprehensive platform for challenging and evaluating the capabilities of anomaly detection systems.

## 5. Results

Our experimental setup and performance evaluation, aligning with established benchmarks in anomaly detection, leverages FastRCNN [13] for object detection and OCSort [6] for object tracking during the training phase. Notably, our Conv3DSkipUNet (C3DSU) model processes sequences of 3 frames. We benchmark our model against leading competitors identified in the comprehensive review by Astrid et al. [3], implementing a median window filtering approach with a window size of 17, as effectively demonstrated by Liu et al. [22]. It is crucial to note that, while our innovative approach leverages object detection to