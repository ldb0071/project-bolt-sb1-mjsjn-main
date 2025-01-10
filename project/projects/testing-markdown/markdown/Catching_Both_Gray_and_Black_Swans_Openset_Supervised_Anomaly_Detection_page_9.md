Page 9

DRA3Ar and DRA3An extend DRA2A with one additional head. DRA3Ar attempts to learn the latent resid-

ual abnormality, without the support of the holistic normality representations that DRA3An is specifically designed to learn. DRA3Ar and DRA3An further largely improves DRA2A, but both of them are much less effective than our full model DRA. This demonstrates that g r and g n need to be fused to effectively learn the latent residual abnormality.

Importance of Disentangled Abnormalities . Fig. 3 (Left) shows the results of non-disentangled, partially, and fully disentangled abnormality learning under the general setting, where the non-disentangled method is multiclass classification with normal samples, seen and pseudo anomaly classes, the partially disentangled method is the variant of DRA that learns disentangled seen and pseudo abnormalities only, and the fully disentangled method is our model DRA. The results show that disentangled abnormality learning helps largely improve the detection performance across three application domains.

## 4.6. Sensitivity Analysis

## Sensitivity w.r.t. the Source of Pseudo Anomalies

There are diverse ways to create pseudo anomalies, as shown in previous studies [18, 26, 42, 54] that focus on anomaly-free training data. We instead investigate the effect of these methods under our open-set supervised AD model DRA. We evaluate three data augmentation methods, including CutMix [67], CutPaste-Scar (CP-Scar) [26]

Table 3. Ablation study results of DRA and its variants. 'xA' denotes learning of 'x' abnormalities. Best results are highlighted .

| Module           | DRA1A                     | DRA2A                    | DRA3Ar                  | DRA3An                  | DRA                      |
|------------------|---------------------------|--------------------------|-------------------------|-------------------------|--------------------------|
| g s              | ✓                         | ✓                        | ✓                       | ✓                       | ✓                        |
| g p              |                           | ✓                        | ✓                       | ✓                       | ✓                        |
| g r              |                           |                          | ✓                       |                         | ✓                        |
| g n              |                           | General Setting          |                         | ✓                       | ✓                        |
| MVTecAD          | 0.938±0.009               | 0.911±0.012              | 0.927±0.023             | 0.949±0.006             | 0.959 ±0.003             |
| AITEX            | 0.881±0.007               | 0.925 ±0.008             | 0.907±0.014             | 0.898±0.019             | 0.893±0.017              |
| SDD              | 0.984±0.013               | 0.984±0.016              | 0.973±0.021             | 0.988±0.009             | 0.991 ±0.005             |
| ELPV             | 0.831±0.011               | 0.794±0.014              | 0.834±0.039             | 0.823±0.005             | 0.845 ±0.013             |
| optical          | 0.760±0.038               | 0.946±0.023              | 0.930±0.002             | 0.965 ±0.007            | 0.965 ±0.006             |
|                  |                           | 0.796±0.008              | 0.813±0.030             | 0.838±0.016             | 0.848 ±0.008             |
| Mastcam BrainMRI | 0.756±0.016 0.965±0.004   | 0.964±0.007              | 0.958±0.015             | 0.886±0.030             | 0.970 ±0.003             |
| HeadCT           | 0.975±0.003               | 0.974±0.007              | 0.986±0.007             | 0.988 ±0.006            | 0.972±0.002              |
| Hyper-Kvasir     |                           |                          |                         | 0.725±0.036             |                          |
|                  | 0.775±0.026               | 0.790±0.030              | 0.809±0.026             |                         | 0.834 ±0.004             |
| Color            | 0.739±0.007               | Hard Setting 0.671±0.167 | 0.847±0.045 0.763±0.176 | 0.848±0.062             | 0.886 ±0.042             |
| Cut              | 0.731±0.055               | 0.880±0.021              |                         | 0.885±0.080             | 0.922 ±0.038             |
| Car pet Hole     | 0.735±0.077               | 0.733±0.116              | 0.903±0.049             | 0.903±0.044             | 0.947 ±0.016             |
| Thread           | 0.970±0.016               | 0.978±0.005              | 0.985±0.007             | 0.992 ±0.006            | 0.989±0.004              |
| Mean             | 0.788±0.025               | 0.824±0.045              | 0.879±0.047             |                         |                          |
|                  | Broken end 0.638±0.019    | 0.738±0.142              | 0.744 ±0.114            | 0.899±0.014 0.640±0.128 | 0.935 ±0.013 0.693±0.099 |
|                  | Broken pick 0.651±0.037   | 0.714±0.039              | 0.675±0.047             | 0.725±0.104             | 0.760                    |
|                  | 0.710±0.019               |                          |                         |                         | ±0.037                   |
|                  | Cut selvage               | 0.724±0.048              | 0.766±0.035             | 0.702±0.032             | 0.777 ±0.036             |
| AITEX Fuzzyball  | 0.714 ±0.019              | 0.676±0.038              | 0.654±0.102             | 0.631±0.014             | 0.701±0.093              |
| Nep              | 0.775±0.027               | 0.745±0.036              | 0.759±0.047             | 0.784 ±0.034            | 0.750±0.038              |
| Weft crack       | 0.633±0.073               | 0.636±0.079              | 0.768 ±0.077            | 0.735±0.110             | 0.717±0.072              |
|                  | Mean 0.687±0.018          | 0.706±0.041              | 0.728±0.027             | 0.703±0.054             | 0.733 ±0.009             |
| Mono             | 0.631±0.042               | 0.655±0.034              | 0.684±0.050             | 0.650±0.034             | 0.731 ±0.021             |
| ELPV Poly        | 0.761±0.033               | 0.823±0.016              | 0.808±0.067             | 0.837 ±0.045            | 0.800±0.064              |
| Mean             | 0.696±0.005               | 0.739±0.025              | 0.746±0.048             | 0.744±0.039             | 0.766 ±0.029             |
| asir             | Barretts 0.833 ±0.028     | 0.731±0.022              | 0.778±0.025             | 0.819±0.030             | 0.824±0.006              |
|                  | B.-short-seg 0.810±0.050  | 0.741±0.052              | 0.688±0.076             | 0.825±0.038             | 0.835 ±0.021             |
| -Kv              | Esophagitis-a 0.840±0.030 | 0.816±0.045              | 0.789±0.060             | 0.889 ±0.010            | 0.881±0.035              |
| Hyper E.-b-d     | 0.741±0.031               | 0.633±0.046              | 0.652±0.069             | 0.805±0.006             | 0.837 ±0.009             |
| Mean             | 0.806±0.014               | 0.730±0.040              | 0.727±0.032             | 0.835±0.007             | 0.844 ±0.009             |

Figure 3. ( Left ) Disentangled vs. non-disentangled abnormality learning. The results are averaged over the datasets in each domain. ( Right ) AUC results of DRA using different reference set sizes ( N r ). Each result is averaged over all data subsets per dataset.

<!-- image -->

and CutPaste-Mix (CP-Mix) that utilizes both CutMix and CP-Scar, and two outlier exposure methods that respectively use samples from MVTec AD [3] and medical dataset LAG [27] as the pseudo anomalies. When using MVTec AD, we remove the classes that overlap with the training/test data; LAG does not have any overlapping with our datasets. Since pseudo anomalies are used mainly to enhance the generalization to unseen anomalies, we focus on the four hard setting datasets in our ablation study in Tab. 3.