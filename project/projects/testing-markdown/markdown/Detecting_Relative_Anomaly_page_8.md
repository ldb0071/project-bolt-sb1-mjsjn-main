Page 8

Fig. 5. The vertex degree approach labels the two clusters on top and bottom as anomalous, even though these correspond to medium overall Wi-Fi usage, as measured by the first covariate; most of the elements of the heavy-usage cluster on the right are labeled as normal, because heavy usage occurs relatively frequently; the top 13 percent detected anomalies are highlighted; note that a mediumusage configuration at (2 , 0) would falsely be considered extremely anomalous.

<!-- image -->

utilization

covariates for a Wi-Fi access point. The first covariate is measure of overall utilization, and the second covariate measures utilization of rx versus tx. 72 percent of the data points cluster at value ( -0 . 89 , 0 . 04) , which corresponds to no utilization. According to domain experts, high utilization states are anomalous.

The vertex degree approach yields the results in Figure 5, where again we set γ = 0 . 5 . We see that the two smaller clusters around (1 . 7 , -1 . 5) and (2 , 1 . 8) , as well as the few data points around (0 . 4 , -0 . 2) , are jointly labeled as the top thirteen percent anomalies.

In Figure 6 we show the results for the approach from Section III-A, again using γ = 0 . 2 . Here the cluster of high usage observations on the far right is correctly labeled as anomalous-because it is far from the many observations at the left of the figure. The results for the shortest path approach from Section III-B are similar.

## V. CONCLUSION

Unsupervised approaches to anomaly detection are commonly used because labeling data is too costly or difficult. Many common approaches for unsupervised anomaly detection target a frequency criterion. This means that their performance deteriorates when anomalies occur frequently, as for example in the case of scraping. We proposed a novel concept, relative anomaly detection, that is more robust to such frequently occurring anomalies. It is tailored to be robust towards anoma-

Fig. 6. The popularity approach correctly labels only the heavyusage cluster on the far right as anomalous; the top 13 percent detected anomalies are highlighted; note that a medium-usage configuration at (2 , 0) would correctly be considered normal

<!-- image -->

lies that occur frequently, by taking into account their location relative to the most typical observations. We presented two novel algorithms under this paradigm. We also discussed real-time detection for new observations, and how univariate deviations from normal system behavior can be identified. We illustrated these approaches using data on potential scraping and Wi-Fi usage from Google, Inc.

## ACKNOWLEDGMENT

We thank Mitch Trott, Phil Keller, Robbie Haertel and Lauren Hannah for many helpful comments, and Dave Peters as well as Taghrid Samak for granting us access to their data sets.

## REFERENCES

- [1] V. Chandola, A. Banerjee, and V. Kumar, 'Anomaly detection: A survey,' ACM computing surveys (CSUR) , vol. 41, no. 3, p. 15, 2009.
- [2] H. Moonesinghe and P.-N. Tan, 'Outlier detection using random walks,' in Tools with Artificial Intelligence, 2006. ICTAI'06. 18th IEEE International Conference on . IEEE, 2006, pp. 532539.
- [3] L. Page, S. Brin, R. Motwani, and T. Winograd, 'The pagerank citation ranking: bringing order to the web.' 1999.
- [4] C. E. Rasmussen and C. K. Williams, 'Gaussian processes for machine learning,' 2006.
- [5] A. Zimek, E. Schubert, and H.-P. Kriegel, 'A survey on unsupervised outlier detection in high-dimensional numerical data,' Statistical Analysis and Data Mining: The ASA Data Science Journal , vol. 5, no. 5, pp. 363-387, 2012.
- [6] C. C. Aggarwal, A. Hinneburg, and D. A. Keim, On the surprising behavior of distance metrics in high dimensional space . Springer, 2001.
- [7] T. J. Hastie, R. J. Tibshirani, and J. H. Friedman, The elements of statistical learning: data mining, inference, and prediction . Springer, 2009.
- [8] D. L. Isaacson and R. W. Madsen, Markov chains, theory and applications . Wiley New York, 1976, vol. 4.
- [9] E. Eskin, A. Arnold, M. Prerau, L. Portnoy, and S. Stolfo, 'A geometric framework for unsupervised anomaly detection,' in Applications of data mining in computer security . Springer, 2002, pp. 77-101.
- [10] F. Angiulli, S. Basta, and C. Pizzuti, 'Distance-based detection and prediction of outliers,' Knowledge and Data Engineering, IEEE Transactions on , vol. 18, no. 2, pp. 145-160, 2006.
- [11] P. Bonacich, 'Factoring and weighting approaches to status scores and clique identification,' Journal of Mathematical Sociology , vol. 2, no. 1, pp. 113-120, 1972.
- [12] C. Williams and M. Seeger, 'The effect of the input density distribution on kernel-based classifiers,' in Proceedings of the 17th international conference on machine learning , no. EPFLCONF-161323, 2000, pp. 1159-1166.
- [13] A. Rahimi and B. Recht, 'Random features for large-scale kernel machines,' in Advances in neural information processing systems , 2007, pp. 1177-1184.
- [14] C. Williams and M. Seeger, 'Using the nystrom method to speed up kernel machines,' in Proceedings of the 14th Annual Conference on Neural Information Processing Systems , no. EPFL-CONF-161322, 2001, pp. 682-688.
- [15] G. E. Box and D. R. Cox, 'An analysis of transformations,' Journal of the Royal Statistical Society. Series B (Methodological) , pp. 211-252, 1964.