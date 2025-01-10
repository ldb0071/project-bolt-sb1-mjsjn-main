Page 11

The crux of training with σ ( ℓ ) lies in pinpointing the minimal anomaly magnitude that still allows our model f to reliably differentiate anomalous from normal. This threshold is the 'sweet spot' where σ ( ℓ ) is neither too insubstantial to be deemed noise nor too dominant to mask the underlying structure of the data. It's at this juncture that our model f is optimally trained to flag deviations from normalcy, while remaining anchored enough to not be swayed by random perturbations or outliers.

In essence, the evolution of σ ( ℓ ) during the training is a barometer of the model's growing intelligence in anomaly detection. By carefully calibrating this parameter, we empower our model f to identify the minimum anomaly required to discern abnormalities, a testament to its analytical prowess and the culmination of a successful training regimen.

## 7.1.1 Visualizing the Effects of Training

To further illustrate the success of our training process and the dynamic adjustment of the anomaly weight σ ( ℓ ) , Figure 4 presents a visual comparison. These images encapsulate various aspects of our model's performance, including the original middle frame X t , the reconstruction from the

normal input f ( X ) , the pseudo-anomalous middle frame X t A , the reconstruction from the pseudo-anomalous input f ( X A ) , and the respective reconstruction errors ∥ X t -f ( X ) ∥ , ∥ X t A -f ( X A ) ∥ , and ∥ X t -f ( X A ) ∥ .

This visual representation demonstrates the impact of our training methodology. Particularly, the comparison between ∥ X t A -f ( X A ) ∥ and ∥ X t -f ( X A ) ∥ reveals a critical insight: the discrepancy between the reconstruction of the pseudo-anomalous frame and the normal frame is significantly less than that between the reconstruction of the pseudo-anomalous frame and its corresponding anomalous input. This outcome underscores the model's capability to more closely align the reconstructed output with the normal frame rather than perpetuating the anomalies present in the pseudo-anomalous input.

## 7.2. Rationale Behind Weighted Noise for Simulating Anomalies (Methodology Supplementary)

The efficacy of employing weighted noise to simulate a range of human-defined anomalies - such as skipped frames, duplicate frames, random patches, and the insertion of foreign shapes or objects - is rooted in the fundamental operating principles of convolutional neural networks (CNNs) employed in reconstruction-based anomaly detection methods. These networks are adept at learning and reconstructing patterns observed in the training data, which predominantly consists of normal behavioral patterns within video sequences.

When confronted with anomalies, the convolutional kernels of a CNN do not perceive these as distinct types of irregularities per se, but rather as inputs lacking the regular patterns or structures they have been trained to recognize and reconstruct. From the perspective of these kernels, anomalies disrupt the spatial and temporal consistency of the input data, rendering them as pattern-less examples essentially, noise. This perception is crucial for understanding why weighted noise can serve as a universal proxy for various anomalies in training anomaly detection models.

The concept of weighted noise as a universal anomaly proxy is further justified by the intrinsic adaptability and learning mechanisms of CNNs. These networks, through their deep architecture, are designed to capture and encode complex patterns in the data they process. The introduction of weighted noise challenges these networks in a unique way, compelling them to discern between the 'normal' patterns they've learned to reconstruct and the 'abnormal' patterns represented by the noise. This challenge is akin to

Figure 4. Visual Comparison of Model Training Effects: This figure provides a comprehensive visualization of the model's performance across different frames and stages of reconstruction. It features the original middle frame X t , the reconstructed frame from normal input f ( Xt , the pseudo-anomalous middle frame X t A , the reconstructed frame from the pseudo-anomalous input f ( X A ) , and the reconstruction errors ∥ X t -f ( X ) ∥ , ∥ X t A -f ( X A ) ∥ , and ∥ X t -f ( X A ) ∥ .

<!-- image -->