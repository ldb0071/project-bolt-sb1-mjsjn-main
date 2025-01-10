Page 3

The cardinality factor is largest (i.e., 1), when R i overlaps with at most one predicted anomaly range (i.e., it is identified by a single prediction range). Otherwise, it receives a value 0 ≤ γ () ≤ 1 defined by the application.

Cardinalit/y.altF actor ( R i , P ) =        1 , if R i overlaps with at most one P j ∈ P γ ( R i , P ) , otherwise (7)

  The Recall T constants ( α and β ) and functions ( γ () , ω () , and δ () ) are tunable according to the needs of the application. Next, we illustrate how they can be customized with examples.

The cardinality factor should generally be inversely proportional to Card ( R i ) , i.e., the number of distinct prediction ranges that a real anomaly range R i overlaps. For example, γ ( R i , P ) can simply be set to 1 / Card ( R i ) .

Figure 1a provides an example for the ω () function for size, which can be used with many different δ () functions for positional bias as shown in Figure 1b. If all index positions are equally important, then the flat bias function should be used. If earlier ones are more important than later ones (e.g., early cancer detection [5], real-time apps [2]), then the front-end bias function should be used. Finally, if later index positions are more important (e.g., delayed response in robotic defense), then the tail-end bias function should be used.

Our recall formula for range-based anomalies subsumes the classical one for point-based anomalies (i.e., Recall T ≡ Recall ) when:

- (i) all R i ∈ R and P j ∈ P are represented as single-point ranges (e.g., range [ 1 , 3 ] represented as [ 1 , 1 ] , [ 2 , 2 ] , [ 3 , 3 ] ), and
- (ii) α = 0 , β = 1 , γ () = 1 , ω () is as in Figure 1a, and δ () returns flat positional bias as in Figure 1b.

## 3 RANGE-BASED PRECISION

Classical Precision is computed by counting the number of successful prediction points (i.e., TP) in proportion to the total number of prediction points (i.e., TP+FP). The key difference between Precision and Recall is that Precision penalizes FPs. In this section, we extend classical precision to handle range-based anomalies. Our formulation follows a similar structure as Recall T .

Given a set of real anomaly ranges R = { R 1 , .., R N r } and a set of predicted anomaly ranges P = { P 1 , .., P N p } , Precision T ( R , P ) iterates over the set of predicted anomaly ranges ( P ), computing a precision score for each range ( P i ∈ P ) and then sums them. This sum is then divided by the total number of predicted anomalies ( N p ), averaging the score for the whole time-series.

Precision T ( R , P ) = /summationtext.1 Np i = 1 Precision T ( R , P i ) N p (8)

When computing Precision T ( R , P i ) for a single predicted anomaly range P i , there is no need for an existence reward, because precision by definition emphasizes prediction quality, and existence by itself is too low a bar for judging the quality of a prediction. This removes the need for α and β constants. Therefore:

Precision T ( R , P i ) = Cardinalit/y.altF actor ( P i , R )

× Nr /summationdisplay.1 j = 1 ω ( P i , P i ∩ R j , δ ) (9)

γ () , ω () , and δ () are customizable as before. Furthermore, Precision T ≡ Precision under the same settings as in Section 2 (except α and β are not needed). Note that, while δ () provides a potential knob for positional bias, we believe that in many domains a flat bias function will suffice for Precision T , as an FP is typically considered uniformly bad wherever it appears in a prediction range.

## 4 CONCLUSION

In this paper, we note that traditional recall and precision were invented for point-based analysis. In range-based anomaly detection, anomalies are not necessarily single points, but are, in many cases, ranges. In response, we offered new recall and precision definitions that take ranges into account.

Acknowledgments. This research has been funded in part by Intel.

## Precision and Recall for Range-Based Anomaly Detection

## REFERENCES

- [1] Charu C. Aggarwal. 2013. Outlier Analysis . Springer.
- [2] Subutai Ahmad, Alexander Lavin, Scott Purdy, and Zuha Agha. 2017. Unsupervised Real-time Anomaly Detection for Streaming Data. Neurocomputing 262 (2017), 134-147.
- [3] Varun Chandola, Arindam Banerjee, and Vipin Kumar. 2009. Anomaly Detection: A Survey. ACM Computing Surveys 41, 3 (2009), 15:1-15:58.
- [4] Sudipto Guha, Nina Mishra, Gourav Roy, and Okke Schrijvers. 2016. Robust Random Cut Forest Based Anomaly Detection on Streams. In International Conference on Machine Learning (ICML) . 2712-2721.
- [5] Konstantina Kourou, Themis P. Exarchos, Konstantinos P. Exarchos, Michalis V. Karamouzis, and Dimitrios I. Fotiadis. 2015. Machine Learning Applications in Cancer Prognosis and Prediction. Computational and Structural Biotechnology Journal 13 (2015), 8-17.
- [6] Alexander Lavin and Subutai Ahmad. 2015. Evaluating Real-Time Anomaly Detection Algorithms - The Numenta Anomaly Benchmark. In IEEE International Conference on Machine Learning and Applications (ICMLA) . 38-44.
- [7] Tae Jun Lee, Justin Gottschlich, Nesime Tatbul, Eric Metcalf, and Stan Zdonik. 2018. Greenhouse: A Zero-Positive Machine Learning System for Time-Series Anomaly Detection. https://arxiv.org/abs/1801.03168/. In SysML Conference .
- [8] Pankaj Malhotra, Lovekesh Vig, Gautam Shroff, and Puneet Agarwal. 2015. Long Short Term Memory Networks for Anomaly Detection in Time Series. In European Symposium on Artificial Neural Networks, Computational Intelligence and Machine Learning (ESANN) . 89-94.
- [9] Nidhi Singh and Craig Olinsky. 2017. Demystifying Numenta Anomaly Benchmark. In International Joint Conference on Neural Networks (IJCNN) . 15701577.
- [10] Twitter. 2015. AnomalyDetection R Package. https://github.com/twitter/AnomalyDetection/. (2015).
- [11] Christina Warrender, Stephanie Forrest, and Barak Pearlmutter. 1999. Detecting Intrusions using System Calls: Alternative Data Models. In IEEE Symposium on Security and Privacy . 133-145.