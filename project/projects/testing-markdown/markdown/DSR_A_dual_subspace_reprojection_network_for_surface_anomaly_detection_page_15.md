Page 15

## 4.4 Ablation Study

Additional experiments on the MVTec dataset provide further insights into DSR. Anomaly source evaluation. We evaluate the impact of training using our feature-based anomalies and compare it to the training with image-based

anomalies generated from out-of-distribution datasets as proposed in [21]. The results are shown in Table 6(a), where DSR img denotes the results when using image-based anomalies during training. We can see that feature-based anomaly generation (DSR) outperforms the image-based approach in anomaly localization and detection.

Anomaly feature sampling. To generate simulated anomalies, DSR samples vectors from the codebook K according to a designed process presented in Section 3.6. We compare this approach to one that samples the codebook with a uniform probability for each vector. The results (DSR random ) presented in Table 6(b) show a significant drop in performance. The sampling method, therefore, plays an important role. The proposed approach generates anomalous regions from vectors that are close to the extracted vectors generating simulated near-distribution anomalies that leads to superior results in terms of anomaly detection as well as localization. DSR is robust to the choice of the similarity bound parameter, retaining a good anomaly detection performance for a wide range of λ s values (Table 5).

λ

s

AUROC