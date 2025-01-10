Page 29

Informer [42] aims to improve the operational efficiency of the Vanilla Transformer and reduce the time complexity. Compared with Vanilla Transformer, the time complexity of Informer is only O ( L log L ), which makes the Informer competent for Long Sequence time-series Forecasting (LSTF) tasks. The main innovation of Informer lies in its proposed ProbSparse Attention Mechanism, self-attention distillation technique, and generative decoder to improve the efficiency of Transformer, whose overall structure is shown in Figure 6:

Fig. 6 The overall structure of Informer (NOTE: The figure is from the paper [42])

<!-- image -->

## · Probsparse attention mechanism

Before Informer, some theoretical studies revealed the potential sparsity of selfattention probability. However, Informer experimentally verified the sparsity of the original attention mechanism through experiments, i.e., the long-tail phenomenon of the attention feature map. Since only a small fraction of dot products contribute to the attention score, only the important part needs to be screened out for calculation. The author argued that the prominent dot product causes the attention probability distribution of the Query matrix to be far away from the uniform distribution, so they used KL divergence to measure the distance between the two distributions. The divergence measurement equation for the i th Query is as follows: