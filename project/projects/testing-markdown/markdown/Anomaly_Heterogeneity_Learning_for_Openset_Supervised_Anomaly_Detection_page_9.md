Page 9

Table 3. AUC results of DRA and AHL (DRA) on detecting texture anomalies in cross-domain datasets (all are MVTec AD datasets). The top row is the source domain for training, while the left column is the target domain for inference. The same-domain results are shown in gray for reference. Best results are boldfaced .

|         | DRA    | DRA   | DRA     | DRA   | DRA   | AHL (DRA)   | AHL (DRA)   | AHL (DRA)   | AHL (DRA)   | AHL (DRA)   |
|---------|--------|-------|---------|-------|-------|-------------|-------------|-------------|-------------|-------------|
|         | Carpet | Grid  | Leather | Tile  | Wood  | Carpet      | Grid        | Leather     | Tile        | Wood        |
| Carpet  | 0.945  | 0.833 | 0.921   | 0.930 | 0.917 | 0.953       | 0.979       | 1.000       | 1.000       | 0.998       |
| Grid    | 0.983  | 0.990 | 0.924   | 0.940 | 0.916 | 0.959       | 0.992       | 1.000       | 1.000       | 0.973       |
| Leather | 0.988  | 0.998 | 1.000   | 0.994 | 1.000 | 0.963       | 0.998       | 1.000       | 1.000       | 0.998       |
| Tile    | 0.917  | 0.971 | 0.958   | 1.000 | 0.955 | 0.943       | 0.982       | 1.000       | 1.000       | 0.999       |
| Wood    | 0.993  | 0.985 | 0.972   | 0.948 | 0.998 | 0.995       | 0.989       | 1.000       | 1.000       | 0.998       |

DRAwork[15], we employ the DRA and AHL (DRA) models, trained on one of five datasets (the source domain) and fine-tune them for 10 epochs using only normal samples on the other four datasets (the target domains). The results of this experiment are presented in Table 3. Overall, the AHL (DRA) model outperforms the DRA baseline significantly in this setting, and it can even achieves comparable AUC to the same-domain performance ( i.e ., the diagonal results). However, we do observe a slight drop in performance on some target domains. We attribute this to the learned anomaly heterogeneity being based on anomaly samples from the source domain, which may introduce bias when testing the AD model on the target domains. Nevertheless, our findings indicate that the AHL framework enhances the generalization ability of DRA on novel domains, demonstrating promising cross-domain performance.

## 4.5. Analysis of AHL

## 4.5.1 Utility of Few-shot Samples

To investigate the utility of few-shot samples in the OSAD task, AHL is also compared with state-of-theart models of unsupervised anomaly detection (UAD) and fully-supervised anomaly detection (FSAD), including KDAD [40] and PatchCore [38] for UAD and fully supervised DRA (FS-DRA for short) for FSAD. DRA is trans-

Table 4. AUC results comparison of AHL (DRA) to unsupervised anomaly detection methods - KDAD and PatchCore - and a fullysupervised DRA model (FS-DRA). Best results and the secondbest results are respectively highlighted in red and bold

| Dataset         | KDAD        | PatchCore   | AHL (DRA)   | FS-DRA      |
|-----------------|-------------|-------------|-------------|-------------|
| AITEX           | 0.576±0.002 | 0.783       | 0.925±0.013 | 0.919±0.004 |
| SDD             | 0.842±0.006 | 0.873       | 0.991±0.000 | 0.991±0.000 |
| ELPV            | 0.744±0.001 | 0.916       | 0.850±0.004 | 0.874±0.004 |
| Optical         | 0.579±0.002 | -           | 0.976±0.004 | 0.982±0.000 |
| Mastcam         | 0.642±0.007 | 0.809       | 0.855±0.005 | 0.877±0.003 |
| BrainMRI        | 0.733±0.016 | 0.754       | 0.977±0.001 | 0.979±0.001 |
| HeadCT          | 0.793±0.017 | 0.864       | 0.993±0.002 | 0.998±0.003 |
| Hyper-Kvasir    | 0.401±0.002 | 0.494       | 0.880±0.003 | 0.900±0.009 |
| MVTec AD (mean) | 0.863±0.029 | 0.992       | 0.970±0.002 | 0.984±0.004 |

formed to a fully supervised approach FS-DRA by using a set of 10 anomaly examples that illustrate all possible anomaly classes in the test data. The results of AHL (DRA) using randomly sampled 10 anomaly examples are used here for comparison. The results are presented in Table 4. It shows that AHL (DRA) substantially outperforms the unsupervised detectors KDAD and PatchCore, demonstrating better generalization ability than the unsupervised methods. FS-DRA is the best-performing model on six out of nine datasets. This is expected due to its fully supervised nature. Although AHL (DRA) is an open-set detector, it is the best performer on AITEX and SDD and performs comparably well to the fully-supervised model FS-DRA on the other seven datasets, indicating that AHL (DRA) can accurately generalize to detect unseen anomalies while effectively maintaining the effectiveness on the seen anomalies. These results suggest very effective utilization of the fewshot anomaly examples in AHL , while avoiding the overfitting of the seen anomalies.

## 4.5.2 Ablation Study