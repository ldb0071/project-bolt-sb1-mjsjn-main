## 4.3 Main Results

In Table 2, we report the results for F1 ∗ on several datasets. Detailed preprocessing steps and training settings are reported in Appendix C. NPSR almost consistently outperforms other algorithms, only being slightly inferior to TranAD on the PSM dataset. NPSR makes use of M pt to precisely capture point anomalies with low false-positive rates (given the best threshold). Moreover, it acquires the ability to detect contextual anomalies by incorporating M seq through the calculation of ˆ A ( · ) , without compromising its capability of detecting point anomalies. We observe that recent studies do not necessarily have higher F1 ∗ scores than older ones. Interestingly, simple heuristics can even perform fairly well on F1 ∗ , with NPSR being the only algorithm consistently outperforming them.

Table 2: Best F1 score ( F1 ∗ ) results on several datasets, with bold text denoting the highest and underlined text denoting the second highest value. The deep learning methods are sorted with older methods at the top and newer ones at the bottom.

| Algorithm \ Dataset           | SWaT   | WADI   | PSM   |   MSL |   SMAP |   SMD | trimSyn   |
|-------------------------------|--------|--------|-------|-------|--------|-------|-----------|
| Simple Heuristic [11, 30, 31] | 0.789  | 0.353  | 0.509 | 0.239 |  0.229 | 0.494 | 0.093     |
| DAGMM[26]                     | 0.750  | 0.121  | 0.483 | 0.199 |  0.333 | 0.238 | 0.326     |
| LSTM-VAE [22]                 | 0.776  | 0.227  | 0.455 | 0.212 |  0.235 | 0.435 | 0.061     |
| MSCRED [24]                   | 0.757  | 0.046  | 0.556 | 0.25  |  0.17  | 0.382 | 0.340     |
| OmniAnomaly [9]               | 0.782  | 0.223  | 0.452 | 0.207 |  0.227 | 0.474 | 0.314     |
| MAD-GAN [23]                  | 0.770  | 0.370  | 0.471 | 0.267 |  0.175 | 0.22  | 0.331     |
| MTAD-GAT [27]                 | 0.784  | 0.437  | 0.571 | 0.275 |  0.296 | 0.4   | 0.372     |
| USAD [28]                     | 0.792  | 0.233  | 0.479 | 0.211 |  0.228 | 0.426 | 0.326     |
| THOC [18]                     | 0.612  | 0.130  | -     | 0.19  |  0.24  | 0.168 | -         |
| UAE [11]                      | 0.453  | 0.354  | 0.427 | 0.451 |  0.39  | 0.435 | 0.094     |
| GDN [12]                      | 0.810  | 0.570  | 0.552 | 0.217 |  0.252 | 0.529 | 0.284     |
| GTA [41]                      | 0.761  | 0.531  | 0.542 | 0.218 |  0.231 | 0.351 | 0.256     |
| Anomaly Transformer [40]      | 0.220  | 0.108  | 0.434 | 0.191 |  0.227 | 0.08  | 0.049     |
| TranAD [25]                   | 0.669  | 0.415  | 0.649 | 0.251 |  0.247 | 0.31  | 0.282     |
| NPSR (combined)               | -      | -      | -     | 0.261 |  0.511 | 0.227 | -         |
| NPSR                          | 0.839  | 0.642  | 0.648 | 0.551 |  0.505 | 0.535 | 0.481     |