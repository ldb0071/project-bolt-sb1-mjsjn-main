Page 10

The results are shown in Tab. 4, from which it is clear that the data augmentation-based pseudo anomaly creation

Table 4. AUC results w.r.t. methods to create pseudo anomalies.

|                  |               | Augmentation   | Augmentation   | Augmentation   | External     | External     |
|------------------|---------------|----------------|----------------|----------------|--------------|--------------|
| Anomaly Category |               | CP-Scar        | CP-Mix         | CutMix         | MVTec AD     | LAG          |
| pet              | Color         | 0.743±0.142    | 0.967 ±0.048   | 0.886±0.042    | 0.615±0.028  | 0.711±0.041  |
| pet              | Cut           | 0.853±0.098    | 0.862±0.072    | 0.922 ±0.038   | 0.688±0.019  | 0.721±0.021  |
| pet              | Hole          | 0.809±0.033    | 0.955 ±0.024   | 0.947±0.016    | 0.712±0.015  | 0.823±0.020  |
| pet              | Car Metal     | 0.858±0.197    | 0.840±0.096    | 0.933 ±0.022   | 0.764±0.039  | 0.670±0.037  |
| pet              | Thread        | 0.987±0.013    | 0.988±0.011    | 0.989 ±0.004   | 0.966±0.003  | 0.968±0.005  |
| pet              | Mean          | 0.850±0.070    | 0.922±0.012    | 0.935 ±0.013   | 0.749±0.006  | 0.779±0.017  |
| AITEX            | Broken end    | 0.584±0.127    | 0.750±0.115    | 0.693±0.099    | 0.793 ±0.043 | 0.722±0.072  |
| AITEX            | Broken pick   | 0.616±0.111    | 0.671±0.082    | 0.760 ±0.037   | 0.603±0.017  | 0.584±0.034  |
| AITEX            | Cut selvage   | 0.676±0.032    | 0.653±0.091    | 0.777 ±0.036   | 0.690±0.013  | 0.683±0.035  |
| AITEX            | Fuzzyball     | 0.639±0.056    | 0.582±0.067    | 0.701±0.093    | 0.743 ±0.053 | 0.588±0.112  |
| AITEX            | Nep           | 0.679±0.060    | 0.706±0.096    | 0.750±0.038    | 0.774 ±0.029 | 0.739±0.012  |
| AITEX            | Weft crack    | 0.470±0.209    | 0.507±0.293    | 0.717 ±0.072   | 0.671±0.031  | 0.480±0.140  |
| AITEX            | Mean          | 0.611±0.064    | 0.645±0.070    | 0.733 ±0.009   | 0.712±0.010  | 0.633±0.049  |
| ELPV             | Mono          | 0.665±0.098    | 0.622±0.067    | 0.731 ±0.021   | 0.543±0.064  | 0.544±0.041  |
| ELPV             | Poly          | 0.755±0.006    | 0.807±0.085    | 0.800±0.064    | 0.749±0.052  | 0.808 ±0.056 |
| ELPV             | Mean          | 0.710±0.046    | 0.715±0.076    | 0.766 ±0.029   | 0.646±0.042  | 0.676±0.031  |
| -Kv asir         | Barretts      | 0.832±0.016    | 0.735±0.028    | 0.761±0.043    | 0.834 ±0.024 | 0.824±0.006  |
| -Kv asir         | B.-short-seg  | 0.827±0.054    | 0.719±0.049    | 0.695±0.030    | 0.839 ±0.038 | 0.835±0.021  |
| -Kv asir         | Esophagitis-a | 0.832±0.024    | 0.751±0.023    | 0.763±0.070    | 0.811±0.031  | 0.881 ±0.035 |
| -Kv asir         | E.-b-d        | 0.805±0.035    | 0.749±0.060    | 0.782±0.028    | 0.847 ±0.017 | 0.837±0.009  |
| -Kv asir         | Hyper Mean    | 0.824±0.020    | 0.739±0.007    | 0.751±0.021    | 0.833±0.023  | 0.844 ±0.009 |

methods are generally more stable and much better than the external data-based methods on non-medical datasets. On the other hand, the external data method is more effective on medical datasets, since the augmentation methods often fail to properly simulate the lesions. The LAG dataset provides more application-relevant features and enables DRA to achieve the best results on Hyper-Kvasir.

Sensitivity w.r.t. the Reference Size in Latent Residual Abnormality Learning . Our latent residual abnormality learning head requires to sample a fixed number N r of normal training images as reference data. We evaluate the sensitivity of our method using different N r and report the AUC results in Fig. 3 (Right). Using one reference image is generally sufficient to learn the residual anomalies. Increasing the reference size to five helps further improve the detection performance, but increasing the size to ten is not consistently helpful. N r = 5 is generally recommended, which is the default setting in DRA in all our experiments.

## 5. Conclusions and Discussions

This paper proposes the framework of learning disentangled representations of abnormalities illustrated by seen anomalies, pseudo anomalies, and latent residual-based anomalies, and introduces the DRA model to effectively detect both seen and unseen anomalies. Our comprehensive results in Tabs. 7 and 2 justify that these three disentangled abnormality representations can complement each other in detecting the largely varying anomalies, substantially outperforming five SotA unsupervised and supervised anomaly detectors by a large margin, especially on the challenging cases, e.g ., having only one training anomaly example, or detecting unseen anomalies.

The studied problem is largely under-explored, but it is very important in many relevant real-world applications. As shown by the results in Tabs. 7 and 2, there are still a number of major challenges requiring further investigation, e.g ., generalization from smaller anomaly examples from fewer

classes, of which our model and comprehensive results provide a good baseline and extensive benchmark results.

## References

- [1] Abhijit Bendale and Terrance E Boult. Towards open set deep networks. In Proc. IEEE Conf. Comp. Vis. Patt. Recogn. , pages 1563-1572, 2016. 2
- [2] Liron Bergman and Yedid Hoshen. Classification-based anomaly detection for general data. In Proc. Int. Conf. Learn. Representations , 2020. 1, 2
- [3] Paul Bergmann, Michael Fauser, David Sattlegger, and Carsten Steger. Mvtec ad - a comprehensive real-world dataset for unsupervised anomaly detection. In Proc. IEEE Conf. Comp. Vis. Patt. Recogn. , June 2019. 1, 5, 8, 12, 14
- [4] Paul Bergmann, Michael Fauser, David Sattlegger, and Carsten Steger. Uninformed students: Student-teacher anomaly detection with discriminative latent embeddings. In Proc. IEEE Conf. Comp. Vis. Patt. Recogn. , June 2020. 1, 3, 5
- [5] Hanna Borgli, Vajira Thambawita, Pia H Smedsrud, Steven Hicks, Debesh Jha, Sigrun L Eskeland, Kristin Ranheim Randel, Konstantin Pogorelov, Mathias Lux, Duc Tien Dang Nguyen, et al. Hyperkvasir, a comprehensive multi-class image and video dataset for gastrointestinal endoscopy. Scientific Data , 7(1):1-14, 2020. 5, 12
- [6] Paula Branco, Lu'ıs Torgo, and Rita Ribeiro. A survey of predictive modeling on imbalanced domains. ACM Computing Surveys , 49(2):1-50, 2016. 2
- [7] Raghavendra Chalapathy, Aditya Krishna Menon, and Sanjay Chawla. Anomaly detection using one-class neural networks. arXiv preprint arXiv:1802.06360 , 2018. 2
- [8] Yuanhong Chen, Yu Tian, Guansong Pang, and Gustavo Carneiro. Deep one-class classification via interpolated gaussian descriptor. In Proc. AAAI Conf. Artificial Intell. , 2022. 1, 2
- [9] Sergiu Deitsch, Vincent Christlein, Stephan Berger, Claudia Buerhop-Lutz, Andreas Maier, Florian Gallwitz, and Christian Riess. Automatic classification of defective photovoltaic module cells in electroluminescence images. Solar Energy , 185:455-468, 2019. 5, 12
- [10] Giancarlo Di Biase, Hermann Blum, Roland Siegwart, and Cesar Cadena. Pixel-wise anomaly detection in complex driving scenes. In Proc. IEEE Conf. Comp. Vis. Patt. Recogn. , pages 16918-16927, 2021. 1
- [11] Mariana-Iuliana Georgescu, Antonio Barbalau, Radu Tudor Ionescu, Fahad Shahbaz Khan, Marius Popescu, and Mubarak Shah. Anomaly detection in video via selfsupervised and multi-task learning. In Proc. IEEE Conf. Comp. Vis. Patt. Recogn. , pages 12742-12752, 2021. 1, 2
- [12] Izhak Golan and Ran El-Yaniv. Deep anomaly detection using geometric transformations. In Proc. Advances in Neural Inf. Process. Syst. , pages 9758-9769, 2018. 2
- [13] Dong Gong, Lingqiao Liu, Vuong Le, Budhaditya Saha, Moussa Reda Mansour, Svetha Venkatesh, and Anton van den Hengel. Memorizing normality to detect anomaly: Memory-augmented deep autoencoder for unsupervised