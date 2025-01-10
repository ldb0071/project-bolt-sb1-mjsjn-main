Page 6

<!-- image -->

L dist = P + ϵ N + ϵ (7)

Here, P serves to penalize the differences between the original normal frame X t and the model's reconstruction of the pseudo-anomalous frame X t A within the masked anomalous regions. The term N captures the reconstruction error when the model tries to reconstruct the pseudo-anomalous frame within these same regions. The parameter ϵ is a small constant to prevent division by zero, thus ensuring numerical stability.

The essence of this loss function is to compel the model to prefer transforming pseudo-anomalous frames back into their normal state. In simpler terms, when the model encounters an anomalous frame, the goal is for its reconstructed output to bear a closer resemblance to a normal frame rather than retaining the anomalous characteristics. Though this is a hopeful outcome for any standard reconstruction model, the distinction loss explicitly trains the model to target this outcome, evidence of this is shown in Supplmentary Material, Section 7.4 within Figures 7 and 8.

The underlying intuition of the distinction loss L dist is to foster a reconstruction process that pulls the pseudoanomalous frame towards the normal frame more than it does towards itself. This is achieved by aiming to reduce

Figure 3. Panel (a) depicts a scenario where σ ( ℓ ) approaches zero, leading to minimal deviation from the original frame and challenging the model's ability to distinguish between normal and anomalous regions due to the lack of significant noise. Panel (b) illustrates the opposite extreme, where σ ( ℓ ) is near one, resulting in an overly distorted anomalous region dominated by noise, which challenges the model's reconstruction capabilities and undermines the distinction loss's effectiveness.

<!-- image -->

P -the difference between the normal frame and its reconstruction from a pseudo-anomalous input-and to increase N -the difference between the pseudo-anomalous

frame and its reconstruction. By doing so, the model is incentivized to differentiate between normal and anomalous frames, thereby enhancing its anomaly detection capabilities. This approach contrasts with methodologies employed by our competitors [2, 3], who focus on maximizing the discrepancy between pseudo anomalous inputs and their reconstructions. Such a strategy often results in the emergence of unusual patches within the reconstructed images, a side effect not observed with our model. In contrast, the distinction loss aims to transform pseudo anomalies to resemble normalcy. A visual representation of the distinction loss can be seen in Figure 1.

For the model's reconstruction function f , the ideal scenario is to replicate the normal regions with high fidelity while transforming the anomalous regions towards normalcy. This ability is reflected in the dynamics of P and N :

- · A lower P indicates the model's proficiency in reconstructing the normal aspects of a frame, even when presented with a pseudo-anomalous input.
- · A higher N indicates that the model is not simply replicating the anomalous features present in the pseudoanomalous frames, but rather is challenged to reconstruct those features, reflecting a discrepancy between the input and the output.

The impact of σ ( ℓ ) , the anomaly weighting factor, on the distinction loss is pivotal: