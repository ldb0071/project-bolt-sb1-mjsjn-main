| Dataset   |   Entities |   Dims |   Train # |   Test # |   Anomaly Rate (%) |
|-----------|------------|--------|-----------|----------|--------------------|
| SWaT      |          1 |     51 |    495000 |   449919 |              12.14 |
| WADI      |          1 |    123 |   1209601 |   172801 |               5.71 |
| PSM       |          1 |     25 |    132481 |    87841 |              27.76 |
| MSL       |         27 |     55 |     58317 |    73729 |              10.48 |
| SMAP      |         55 |     25 |    140825 |   444035 |              12.83 |
| SMD       |         28 |     38 |    708405 |   708420 |               4.16 |
| trimSyn   |          1 |     35 |     10000 |     7680 |               2.34 |

## 4.2 Baselines

We evaluate the performance of NPSR against several deep learning algorithms and simple heuristics using F1 ∗ . Due to the exhaustive nature of optimizing for all datasets and algorithms, we follow a three-step approach to populate Table 2. Firstly, we reference values from the original paper, and if unavailable, we search for the highest reported values among other publications. Finally, if no reported values are found, we modify and run publicly available code. We cannot find any reported F1 ∗ of the PSM dataset using THOC or any publicly available code, hence leaving the value blank. For multi-entity datasets (MSL, SMAP, and SMD), we compare the performance using two methods - (1) combining all entities and training them together; (2) training each entity separately and averaging the results. Moreover, some literature attempt to find a threshold ( θ a ) and then calculate the performance conditioned on it [24, 40]. Since θ a can simply be a one-value parameter, we assume that other studies have already optimized this value, and regard their reported F1 as F1 ∗ . More information on the sources of data can be found in Appendix E.