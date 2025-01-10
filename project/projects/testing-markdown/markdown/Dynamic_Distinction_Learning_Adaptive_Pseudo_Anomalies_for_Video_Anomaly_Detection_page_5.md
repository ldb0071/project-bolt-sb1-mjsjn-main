Page 5

L = L recon + λ · L dist (3)

where λ is a hyperparameter that modulates the impact of the distinction loss relative to the reconstruction loss. This adjustment is crucial for ensuring that the model effectively

balances learning to reconstruct normal frames while also distinguishing them from pseudo-anomalous frames.

## 3.3.1 Reconstruction Loss

The first function is the standard reconstruction loss:

L recon = ∥ X t -f ( X ) ∥ (4)

where X t is the middle frame of X . This loss function encourages the model to accurately reconstruct the normal input frame, thus learning the distribution of normal frames.

## 3.3.2 Distinction Loss

The distinction loss is the second loss function in our model, designed to fine-tune the distinction between normal frames and their pseudo-anomalous counterparts. This differentiation is crucial for the model to recognize and identify anomalies effectively. The distinction loss function is articulated through the following mathematical formulations:

P = ∥ M t · ( X t -f ( X A )) ∥ (5)

N = ∥ M t · ( X t A -f ( X A )) ∥ (6)

Figure 2. Pseudo-Anomaly Creation Process: This figure demonstrates the step-by-step procedure for generating pseudo-anomalies within video frames. It begins by receiving the normal input frames, the masked frames, and a dynamically learned anomaly weight followed by the application of a noise tensor modulated by the anomaly weight.