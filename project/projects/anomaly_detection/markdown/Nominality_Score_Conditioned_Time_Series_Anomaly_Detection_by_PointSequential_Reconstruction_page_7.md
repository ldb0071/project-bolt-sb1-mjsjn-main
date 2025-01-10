## 3.3 The Nominality Score

Now we conceptualize the Nominality Score N ( · ) . Analogous to the anomaly score, N ( · ) indicates how normal a time point is. A nominality score N ( · ) is appropriate if for every possible θ N > 0 , P ( N ( t ) > θ N | y t = 0) > P ( N ( t ) > θ N | y t = 1) for all t ∈ { 1 , ..., T } , i.e., the portion of normal points that has a nominality score larger than θ N is strictly larger than the portion of anomaly points

Figure 1: (a) Relationships between variables, (b) observed time series on 2D plane, and (c) radial and angular displacement vs time from nominal time series ( x ∗ t ) for the 2D position sensor example.

<!-- image -->

that has a nominality score larger than θ N . There are many ways to define N ( · ) . In this study, we define N ( t ) as the ratio of the squared L2-norm between ∆ x c t and ∆ x 0 t .

N ( t ) ≜ ∥ ∆ x c t ∥ 2 2 ∥ ∆ x 0 t ∥ 2 2 = ∥ ∆ x c t ∥ 2 2 ∥ ∆ x c t +∆ x p t ∥ 2 2 = ∥ x c t -x ∗ t ∥ 2 2 ∥ x 0 t -x ∗ t ∥ 2 2 (1)

We provide an example as to when N ( · ) will be appropriate. In this derivation, we add an n and a in the subscript to denote variables that are only associated with normal and anomaly points, respectively. Consider a toy dataset, where ∆ x c t,n , ∆ x p t,n , ∆ x c t,a , and ∆ x p t,a have been defined:

∆ x c t,n ∼ N (0 , I D ) , ∆ x p t,n ∼ N (0 , I D ) , ∆ x c t,a ∼ N (0 , I D ) , ∆ x p t,a ∼ N (0 , α 2 I D ) (2)

According to (1), we have

2 N n ( t ) = 2 ∥ ∆ x c t,n ∥ 2 2 ∥ ∆ x c t,n +∆ x p t,n ∥ 2 2 ∼ F( D,D ) (3)

(1 + α 2 ) N a ( t ) = (1 + α 2 ) ∥ ∆ x c t,a ∥ 2 2 ∥ ∆ x c t,a +∆ x p t,a ∥ 2 2 ∼ F( D,D ) (4)

where F is the F-distribution with D and D degrees of freedom. Fig. 2 illustrates the probability density function of N n ( · ) and N a ( · ) for different D and α . If α > 1 , then N ( · ) becomes an appropriate nominality score, since

P ( N ( t ) > θ N | y t = 0) = ∫ ∞ 2 θ N f ( x ; D,D ) dx > ∫ ∞ (1+ α 2 ) θ N f ( x ; D,D ) dx = P ( N ( t ) > θ N | y t = 1)

(5)

where f ( · ; D,D ) is the probability density function of the F-distribution with degrees of freedom D and D . Indeed, it is reasonable to assume that ∆ x p t,a has a larger variance than ∆ x p t,n .