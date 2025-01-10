Page 23

Thus, although DeiT addresses some of ViT's pain points, significant data enhancement is still needed to expand the training set capacity and achieve better anomaly detection performance.

## 4.4 Anomaly detection based on TabTransformer

TabTransformer [32] is a model for processing tabular data, which treats each row in a table as a sentence and each column value as a word or token. Since the length of each row in the table is fixed, and the position of each token in the table is relatively fixed, TabTransformer discards the Position Encoding method of Vanilla Transformer and only needs to focus on fixed-length input, which is shown in Figure 4:

Fig. 4 The structure of TabTransformer (NOTE: The figure is from the paper [32])

<!-- image -->