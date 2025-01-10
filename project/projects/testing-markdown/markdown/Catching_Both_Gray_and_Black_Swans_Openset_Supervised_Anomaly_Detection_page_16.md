Page 16

| Dataset      | | C |   | DeepSAD      | MINNS        | DRA (Ours)   |
|--------------|---------|--------------|--------------|--------------|
| Carpet       | 5       | 0.791±0.011  | 0.876±0.015  | 0.940 ±0.027 |
| Grid         | 5       | 0.854±0.028  | 0.983±0.016  | 0.987 ±0.009 |
| Leather      | 5       | 0.833±0.014  | 0.993±0.007  | 1.000 ±0.000 |
| Tile         | 5       | 0.888±0.010  | 0.980±0.003  | 0.994 ±0.006 |
| Wood         | 5       | 0.781±0.001  | 0.998 ±0.004 | 0.998 ±0.001 |
| Bottle       | 3       | 0.913±0.002  | 0.995±0.007  | 1.000 ±0.000 |
| Capsule      | 5       | 0.476±0.022  | 0.905±0.013  | 0.935 ±0.022 |
| Pill         | 7       | 0.875±0.063  | 0.913 ±0.021 | 0.904±0.024  |
| Transistor   | 4       | 0.868±0.006  | 0.889±0.032  | 0.915 ±0.025 |
| Zipper       | 7       | 0.974±0.005  | 0.981±0.011  | 1.000 ±0.000 |
| Cable        | 8       | 0.696±0.016  | 0.842±0.012  | 0.909 ±0.011 |
| Hazelnut     | 4       | 1.000 ±0.000 | 1.000 ±0.000 | 1.000 ±0.000 |
| Metal nut    | 4       | 0.860±0.053  | 0.984±0.002  | 0.997 ±0.002 |
| Screw        | 5       | 0.774±0.081  | 0.932±0.035  | 0.977 ±0.009 |
| Toothbrush   | 1       | 0.885 ±0.063 | 0.810±0.086  | 0.826±0.021  |
| MVTec AD     | -       | 0.830±0.009  | 0.939±0.011  | 0.959 ±0.003 |
| AITEX        | 12      | 0.686±0.028  | 0.813±0.030  | 0.893 ±0.017 |
| SDD          | 1       | 0.963±0.005  | 0.961±0.016  | 0.991 ±0.005 |
| ELPV         | 2       | 0.722±0.053  | 0.788±0.028  | 0.845 ±0.013 |
| Optical      | 1       | 0.558±0.012  | 0.774±0.047  | 0.965 ±0.006 |
| Mastcam      | 11      | 0.707±0.011  | 0.803±0.031  | 0.848 ±0.008 |
| BrainMRI     | 1       | 0.850±0.016  | 0.943±0.031  | 0.970 ±0.003 |
| HeadCT       | 1       | 0.928±0.005  | 0.984 ±0.010 | 0.972±0.002  |
| Hyper-Kvasir | 4       | 0.719±0.032  | 0.647±0.051  | 0.834 ±0.004 |

in the another dataset. In the eight best-performing datasets, our method improves AUC by 2% to 19.1% over the best competing method.

Hard Setting. Tab. 8 shows the results of DRA and two additional competing methods under the hard setting. Our method performs best on most of the data subsets and achieves the best AUC performance on five of the six datasets at the dataset level. Our method improves from 9.2% to 24.4% over the suboptimal method in the other five datasets.

The experimental results in both settings show the superiority of our method compared to Deep SAD and MINNS.

## C.2. Sensitivity w.r.t. Loss Function

In our paper, we use the deviation loss [35] in all our four heads by default. Here we vary the use of the loss function and analyze the impact of the loss function on the performance of anomaly detection. Any related binary classification loss functions may be used for training all the four heads of DRA. We evaluate the applicability of two additional popular loss functions, including binary crossentropy loss and focal loss, in addition to deviation loss. The results are reported in Fig. 5, where all results are the averaged AUC of three independent runs of the experiments. In general, the deviation loss function, which is specifically designed for anomaly detection, has clear superiority on most cases. The two classification losses perform better on the medical dataset Hyper-Kvasir. Based on such empirical findings, the deviation loss function is generally

Table 8. AUC results of DRA and two additional competing methods under the hard setting, where models are trained with one known anomaly class and tested to detect the rest of all other anomaly classes. Each data subset is named by the known anomaly class.

| Module   |               | DeepSAD MINNS   |              | DRA (Ours)   |
|----------|---------------|-----------------|--------------|--------------|
|          | Color         | 0.736±0.007     | 0.767±0.011  | 0.886 ±0.042 |
|          | Cut           | 0.612±0.034     | 0.694±0.068  | 0.922 ±0.038 |
| pet      | Hole          | 0.576±0.036     | 0.766±0.007  | 0.947 ±0.016 |
| Car      | Metal         | 0.732±0.042     | 0.789±0.097  | 0.933 ±0.022 |
|          | Thread        | 0.979±0.000     | 0.982±0.008  | 0.989 ±0.004 |
|          | Mean          | 0.727±0.011     | 0.800±0.022  | 0.935 ±0.013 |
|          | Bent          | 0.821±0.023     | 0.868±0.033  | 0.990 ±0.003 |
| nut      | Color         | 0.707±0.028     | 0.985 ±0.018 | 0.967±0.011  |
|          | Flip          | 0.602±0.020     | 1.000 ±0.000 | 0.913±0.021  |
| Metal    | Scratch       | 0.654±0.004     | 0.978 ±0.000 | 0.911±0.034  |
|          | Mean          | 0.696±0.012     | 0.958 ±0.008 | 0.945±0.017  |
|          | Broken end    | 0.442±0.029     | 0.708 ±0.103 | 0.693±0.099  |
| AITEX    | Broken pick   | 0.614±0.039     | 0.565±0.018  | 0.760 ±0.037 |
|          | Cut selvage   | 0.523±0.032     | 0.734±0.012  | 0.777 ±0.036 |
|          | Fuzzyball     | 0.518±0.023     | 0.534±0.058  | 0.701 ±0.093 |
|          | Nep           | 0.733±0.017     | 0.707±0.059  | 0.750 ±0.038 |
|          | Weft crack    | 0.510±0.058     | 0.544±0.183  | 0.717 ±0.072 |
|          | Mean          | 0.557±0.014     | 0.632±0.023  | 0.733 ±0.009 |
|          | Mono          | 0.554±0.063     | 0.557±0.010  | 0.731 ±0.021 |
| ELPV     | Poly          | 0.621±0.006     | 0.770±0.032  | 0.800 ±0.064 |
|          | Mean          | 0.588±0.021     | 0.663±0.015  | 0.766 ±0.029 |
|          | Bedrock       | 0.474±0.038     | 0.419±0.025  | 0.658 ±0.021 |
| Mastcam  | Broken-rock   | 0.497±0.054     | 0.687 ±0.015 | 0.649±0.047  |
|          | Drill-hole    | 0.494±0.013     | 0.651±0.035  | 0.725 ±0.005 |
|          | Drt           | 0.586±0.012     | 0.705±0.043  | 0.760 ±0.033 |
|          | Dump-pile     | 0.565±0.046     | 0.697±0.022  | 0.748 ±0.066 |
|          | Float         | 0.408±0.022     | 0.635±0.073  | 0.744 ±0.073 |
|          | Meteorite     | 0.489±0.010     | 0.551±0.018  | 0.716 ±0.004 |
|          | Scuff         | 0.502±0.010     | 0.502±0.040  | 0.636 ±0.086 |
|          | Veins         | 0.542±0.017     | 0.577±0.013  | 0.620 ±0.036 |
|          | Mean          | 0.506±0.009     | 0.603±0.016  | 0.695 ±0.004 |
| asir     | Barretts      | 0.672±0.017     | 0.679±0.009  | 0.824 ±0.006 |
|          | B.-short-seg  | 0.666±0.012     | 0.608±0.064  | 0.835 ±0.021 |
| -Kv      | Esophagitis-a | 0.619±0.027     | 0.665±0.045  | 0.881 ±0.035 |
| Hyper    | E.-b-d        | 0.564±0.006     | 0.480±0.043  | 0.837 ±0.009 |
|          | Mean          | 0.630±0.009     | 0.608±0.014  | 0.844 ±0.009 |

recommended in DRA.

## C.3. Cross-domain Anomaly Detection

An interesting extension area of open-set anomaly detection is cross-domain anomaly detection, aiming at training detection models on a source domain to detect anomalies on datasets from a target domain different from the source domain. To demonstrate potential of our method in such setting, we report cross-domain AD results of our model DRA on all five texture anomaly datasets in MVTec AD in Tab. 9. DRA is trained on one of five datasets (source domain) and in fine-tuned with 10 epochs on the other four datasets (target domains) using normal samples only. The results show that the domain-adapted DRA significantly outperforms the SOTA unsupervised method KDAD that is directly trained

Figure 5. The AUC performance of our proposed method using different loss functions under the hard setting. We report the averaged results over all data subsets per dataset.

<!-- image -->

on the target domain. This demonstrates some promising open-domain performance of DRA.

Table 9. AUC results of domain-adapted DRA and unsupervised method KDAD in texture datasets. The top row is the source domain and the left column is the target domain.

|         | carpet   | grid   | leather   | tile   | wood   |   KDAD |
|---------|----------|--------|-----------|--------|--------|--------|
| carpet  | -        | 0.833  | 0.921     | 0.930  | 0.917  |  0.774 |
| grid    | 0.983    | -      | 0.924     | 0.940  | 0.916  |  0.749 |
| leather | 0.988    | 0.998  | -         | 0.994  | 1.000  |  0.948 |
| tile    | 0.917    | 0.971  | 0.958     | -      | 0.955  |  0.911 |
| wood    | 0.993    | 0.985  | 0.972     | 0.948  | -      |  0.94  |

## D. Failure Cases

Although DRA shows competitive results on most datasets, it still fails on individual datasets; the most notable is the toothbrush dataset. After in-depth research and analysis of the results, we believe the failure of the toothbrush dataset is mainly due to its small size of normal samples (60 normal samples, see Tab. 5). Due to the more complex architecture, DRA often requires a relatively larger set of normal training samples to learn the disentangled abnormalities, while simpler methods like FLOS and SAOE that perform mainly binary classification do not have this requirement and work better on this dataset. In practice, we need to pay attention to the available data size of the target task, and apply a lightweight network in DRA instead when facing small-scale tasks.