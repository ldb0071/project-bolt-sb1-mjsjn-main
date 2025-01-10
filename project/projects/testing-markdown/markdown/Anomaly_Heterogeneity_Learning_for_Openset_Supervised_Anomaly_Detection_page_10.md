Page 10

Our ablation study uses DRA as the baseline. To evaluate our first component HADG, we compare DRA using only HADG ( + HADG ) with its three variants, including DRA using random heterogeneous anomaly distribution generation ( + RamHADG ), i.e ., an ensemble of DRA trained on different random data subsets; an ensemble of DRA trained on the full data using different random seeds ( + RamFULL ); an ensemble of heterogeneous detectors DRA and DevNet trained using RamHADG ( + RamHADG + DevNet ). We then examine the effectiveness of another component CDL by adding it on top of the variant DRA + HADG, which is also our full AHL model, denoted as ' + CDL ' for brevity. ' + CDL ' is also compared with its simplified version ' + CDL -' in which the weights w i of ϕ i are simply computed based on the detection accuracy on the training data excluding D s i instead of using our model importance learning ψ . Table 5 illustrates the results under both settings using M = 10 , where the results for the hard setting are averaged over all the anomaly classes

Table 5. Ablation study results of AHL and its variants under both general and hard settings. Best results and the second-best results are respectively highlighted in red and bold .

| Dataset             | DRA             | + HADG          | + RamHADG       | + RamFULL       | + RamHADG + DevNet   | + CDL -         | + CDL           |
|---------------------|-----------------|-----------------|-----------------|-----------------|----------------------|-----------------|-----------------|
| General Setting     | General Setting | General Setting | General Setting | General Setting | General Setting      | General Setting | General Setting |
| AITEX               | 0.892±0.003     | 0.916±0.004     | 0.908±0.003     | 0.905±0.011     | 0.894±0.003          | 0.915±0.007     | 0.925±0.013     |
| SDD                 | 0.990±0.000     | 0.990±0.000     | 0.990±0.000     | 0.985±0.002     | 0.984±0.000          | 0.991±0.001     | 0.991±0.000     |
| ELPV                | 0.843±0.002     | 0.846±0.006     | 0.844±0.002     | 0.843±0.000     | 0.843±0.003          | 0.847±0.002     | 0.850±0.004     |
| optical             | 0.966±0.002     | 0.974±0.002     | 0.970±0.004     | 0.963±0.006     | 0.897±0.005          | 0.974±0.002     | 0.976±0.004     |
| Mastcam             | 0.849±0.003     | 0.852±0.001     | 0.815±0.003     | 0.849±0.001     | 0.813±0.001          | 0.841±0.004     | 0.855±0.005     |
| BrainMRI            | 0.971±0.001     | 0.973±0.002     | 0.974±0.001     | 0.973±0.007     | 0.961±0.002          | 0.977±0.002     | 0.977±0.001     |
| HeadCT              | 0.978±0.001     | 0.992±0.002     | 0.986±0.001     | 0.988±0.003     | 0.995±0.002          | 0.991±0.001     | 0.993±0.002     |
| Hyper-Kvasir        | 0.844±0.001     | 0.874±0.005     | 0.865±0.002     | 0.863±0.001     | 0.831±0.003          | 0.877±0.005     | 0.880±0.003     |
| MVTecAD (mean)      | 0.966±0.002     | 0.968±0.003     | 0.964±0.003     | 0.968±0.004     | 0.954±0.005          | 0.966±0.003     | 0.970±0.002     |
| Hard Setting        | Hard Setting    | Hard Setting    | Hard Setting    | Hard Setting    | Hard Setting         | Hard Setting    | Hard Setting    |
| Carpet (mean)       | 0.940±0.006     | 0.943±0.003     | 0.943±0.002     | 0.947±0.001     | 0.902±0.002          | 0.951±0.007     | 0.949±0.002     |
| AITEX (mean)        | 0.733±0.011     | 0.739±0.007     | 0.733±0.005     | 0.733±0.004     | 0.691±0.005          | 0.720±0.003     | 0.747±0.002     |
| ELPV (mean)         | 0.771±0.005     | 0.784±0.004     | 0.774±0.004     | 0.779±0.002     | 0.732±0.001          | 0.779±0.009     | 0.788±0.003     |
| Hyper-Kvasir (mean) | 0.822±0.013     | 0.847±0.008     | 0.835±0.004     | 0.829±0.003     | 0.833±0.005          | 0.838±0.011     | 0.854±0.004     |

Figure 3. Hyperparameter analysis of AHL (DRA) based on the general setting using ten anomaly examples. Left: AUC results w.r.t. different number of clusters ( C ). Right: AUC results w.r.t. the length of sequences ( K ) as input to the sequential model ψ .

<!-- image -->

(see Appendix C for class-level results). We can observe that using only HADG, ' + HADG ', largely improves DRAonmost datasets, and it also substantially outperforms three types of DRA-based ensemble models, showing the effectiveness of our HADG component. Adding the CDL component, ' + CDL ', consistently improves the variant ' + HADG ' across all datasets. Simplifying ' + CDL ' to ' + CDL -' leads to performance drop on most datasets, with relatively large drops on challenging datasets like AITEX (both settings), Mastcam, and Hyper-Kvasir, indicating the significance of ψ in CDL.

## 4.5.3 Hyperparameter Analysis

Weconduct an analysis of two key hyperparameters in AHL , the number of normal clusters ( C ) in HADG (Sec. 3.2) and the length of score sequences ( K ) in CDL (Sec. 3.3), with the results shown in Fig. 3 (left) and Fig. 3 (right), respectively. We observe that increasing C does not always result in improved performance. This is mainly because that excessively dividing normal samples into too many small clusters can introduce biased individual anomaly distributions into the learning process due to the presence of too few samples per cluster. As for K , the results show that setting K = 3 is generally sufficient for accurate generalization error estimation. However, having K = 5 can further improve the performance on a few datasets where more accurate generalization error estimation requires longer input sequences. C = 3 and K = 5 are generally suggested, which are the default settings for AHL models throughout our large-scale experiments.

## 5. Conclusion

In this work, we explore the OSAD problem and introduce a novel, generic framework, namely anomaly heterogeneity learning ( AHL ). It learns generalized, heterogeneous abnormality detection capability by training on diverse generated anomaly distributions in simulated OSAD scenarios. AHL models such anomaly heterogeneity using a collaborative differentiable learning on a set of heterogeneous based models built on the generated anomaly distribution. Experiments on nine real-world anomaly detection datasets demonstrate that the AHL approach can substantially enhance different state-of-the-art OSAD models in detecting unseen anomalies in the same-domain and cross-domain cases, with the AUC improvement up to 9%.