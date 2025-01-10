## 3.6 Sequence-based Reconstruction Models

Contrary to x c t , x ∗ t should not only be in X ∗ but also obey the time-dependent relationships. Therefore, it is necessary that the model ( M seq ) for approximating x ∗ t takes a sequence of time points as input.

X ∗ ≈ ˆ X ∗ = { ˆ x ∗ 1 , ..., ˆ x ∗ T } ≜ M seq ( X 0 ) (16)

How close M seq ( X 0 ) approximates X ∗ depends on the amount of training data and the model capacity. In practice, for computational reasons, only a section of X 0 is input and reconstructed at a time. We found that given a subsequence X 0 ab = { x 0 a , ..., x 0 b } as input for reconstruction, a model tends to simply reconstruct individual points and do not take temporal information into account (as discussed in section 3.5). Therefore, we use a Performer-based stacked encoder as M seq , which predicts the middle δ points from its surrounding 2 γ points to force the learning of time-dependent relationships. We concatenate all the predicted time points output by M seq to construct ˆ X ∗ . For the rest of the study, we will use M seq to refer to the Performer-based stacked encoder model. Details for the architecture of M seq are shown in Appendix B.2. Fig. 3 gives an illustration of the architecture for M pt , M seq , and the overall scheme. By obtaining ˆ X c and ˆ X ∗ , we can calculate N ( · ) and select some A ( · ) for calculating ˆ A ( · ) . The algorithm for evaluating a trained M pt and M seq using the soft gate function is shown in Algorithm 1 .

Figure 3: (a) Performer-based autoencoder M pt , (b) Performer-based stacked encoder M seq , and (c) main scheme for NPSR. GELUs are used as the activation function for each layer.

<!-- image -->