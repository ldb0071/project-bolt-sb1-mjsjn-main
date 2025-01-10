## 4.5 Detection Trade-off Between Point and Contextual Anomalies

We elaborate on the trade-off between detecting point and contextual anomalies and relate them with the performance of M pt and M seq . It may seem intuitive that finding temporal information in

Table 3: AUC and F1 ∗ for different methods and datasets, with bold text denoting the highest and underlined text denoting the second highest value. The mean ( µ d ) and standard deviation ( σ d ) of the performance metrics evaluated across d = 1 , 2 , 4 , 8 , 16 , 32 , 64 , 128 , 256 are shown.

| Dataset                           |     | SWaT   | SWaT   | WADI   | WADI   | PSM   | PSM   | MSL         | MSL   | SMAP   | SMAP   | SMD   | SMD   | trimSyn   | trimSyn   |
|-----------------------------------|-----|--------|--------|--------|--------|-------|-------|-------------|-------|--------|--------|-------|-------|-----------|-----------|
| Method                            |     | AUC    | F1 ∗   | AUC    | F1 ∗   | AUC   | F1 ∗  | AUC         | F1 ∗  | AUC    | F1 ∗   | AUC   | F1 ∗  | AUC       | F1 ∗      |
| M pt ( ∥ ˆ x c t - x 0 t ∥ 2 2 )  |     | 0.908  | 0.839  | 0.819  | 0.629  | 0.790 | 0.626 | 0.640       | 0.366 | 0.647  | 0.329  | 0.820 | 0.485 | 0.721     | 0.100     |
| M seq ( ∥ ˆ x ∗ t - x 0 t ∥ 2 2 ) |     | 0.899  | 0.755  | 0.843  | 0.559  | 0.766 | 0.576 | 0.621       | 0.351 | 0.611  | 0.292  | 0.820 | 0.482 | 0.832     | 0.345     |
| M pt + Hard (11)                  | µ d | 0.912  | 0.813  | 0.827  | 0.630  | 0.775 | 0.621 | 0.708       | 0.451 | 0.665  | 0.389  | 0.835 | 0.492 | 0.785     | 0.144     |
| ( θ N = ∞ )                       | σ d | 0.005  | 0.034  | 0.007  | 0.037  | 0.023 | 0.020 | 0.032       | 0.038 | 0.010  | 0.036  | 0.025 | 0.052 | 0.037     | 0.021     |
| M pt + Hard (11)                  | µ d | 0.912  | 0.820  | 0.844  | 0.625  | 0.779 | 0.624 | 0.718       | 0.467 | 0.659  | 0.386  | 0.833 | 0.495 | 0.791     | 0.292     |
| ( θ N = 98 . 5% N trn )           | σ d | 0.005  | 0.024  | 0.007  | 0.023  | 0.017 | 0.015 | 0.041 0.698 | 0.051 | 0.012  | 0.034  | 0.024 | 0.050 | 0.069     | 0.121     |
| M pt + Soft (8)                   | µ d | 0.909  | 0.837  | 0.856  | 0.639  | 0.804 | 0.636 |             | 0.465 | 0.656  | 0.388  | 0.840 | 0.525 | 0.862     | 0.434     |
| ( θ N = 98 . 5% N trn )           | σ d | 0.000  | 0.001  | 0.011  | 0.008  | 0.005 | 0.004 | 0.031       | 0.061 | 0.005  | 0.039  | 0.003 | 0.011 | 0.063     | 0.099     |

Figure 4: Histograms of the nominality scores for the SWaT and WADI dataset.

<!-- image -->