## 3 Methods

## 3.1 Problem Formulation

Let X = { x 1 , ..., x T } denote a multivariate time series with x t ∈ R D , where T is the time length and D is the dimensionality or number of channels. There exists a corresponding set of labels y = { y 1 , ..., y T } , y t ∈ { 0 , 1 } indicating whether the time point is normal ( y t = 0 ) or anomalous ( y t = 1 ). For a given X , the goal is to yield anomaly scores for all time points a = { a 1 , ..., a T } , a t ∈ R and a corresponding threshold θ a such that the predicted labels ˆ y = { ˆ y 1 , ..., ˆ y T } , where ˆ y t ≜ ✶ a t ≥ θ a , match

y as much as possible. To quantify how matched ˆ y and y is, or how good a is for potentially yielding a good ˆ y , there are several performance metrics that takes either a or ˆ y into account [11, 12, 29, 30, 31]. This work mainly focuses on the best F1 score ( F1 ∗ ) without point-adjust, also known as the pointwise F1 score, which is defined as the maximum possible F1 score considering all thresholds. (A complete derivation for F1 ∗ is covered in Appendix A.)