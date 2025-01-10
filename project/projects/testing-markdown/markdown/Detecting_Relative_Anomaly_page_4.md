Page 4

small after just a few iterations. This computation is highly parallelizable.

We find that typically more than half of the smallest elements of the kernel matrix can be set to a small constant-allowing sparse matrix computations and a hence a speed-up of more than two-without changing the rank order of the relative anomaly values. Furthermore, for high-dimensional problems, we can obtain good starting values for the power iteration as follows. [13] show that S can be approximated by Φ T Φ , where Φ is a draw of random Fourier features calculated from the original data. If we choose only a small number of Fourier features as compared to the sample size, then rank ( Φ T Φ ) glyph[lessmuch] rank( S ) , and we can cheaply find an approximation to the leading eigenvector of S as Φ T lev( ΦΦ T ) . Here lev( ΦΦ T ) denotes the leading eigenvector of ΦΦ T ; it can again be found using the power iteration. In our experiments, this approach reduces the run time until the leading eigenvector of S is found by one fourth.

It is computationally expensive to retrain the model with every new observation. Furthermore, it may not even be desired to update the model in the presence of every new observation, because that new observation may come from a different, anomalous data generating process. We propose to instead determine the relative anomaly of a new observation with respect to the observations in the training data set as follows. Recall that the left-eigenproblem of S is λ s = S T s , from which we see that ( s ) i = ( S T s ) i / s T Ss . We can use this relation to predict the relative anomaly of a new observation · , based solely on training data, as

̂ RA( · ) = -( s ( · , x 1 ) , . . . , s ( · , x n )) s s T Ss . (8)

This can be viewed as an application of the Nystrom method to approximate the leading eigenvector of the extended kernel matrix; for a reference on the Nystrom method, see [14].

## B. Shortest path approach

We also propose an approach to relative anomaly detection based on highest similarity paths. The idea is to first identify those observations that can be considered very typical, and then to label an observation as anomalous if it is difficult to reach it from any of the typical observations. Here we interpret an element [ S ] ij as a 'connectivity' value between nodes x i and x j . We use the following two-step approach:

- 1) Consider those observations for which the vertex degree is higher than that of (1 -q ) · 100 percent of the observations in the training data set as

highly normal. For each observation · , we can express this as ˆ F VD ( · ) > q , using the empirical cumulative distribution function of vertex degrees in the training data set, ˆ F VD . Note that by choosing the kernel bandwidth large enough we can smooth out local peaks in the data density, such that indeed the observations with highest vertex degrees can be considered normal.

- 2) Now, for each observation · that is not considered highly normal, find the length of the bestconnected path from it to any of the observations deemed normal:

max l : 1 -ˆ F VD ( x l ) ≤ q max { paths from · to x l } ∏ ( i,j ): is edge in path s ij . (9)

Alternatively, solve the equivalent shortest path problem

RA q ( · ) · · = (10)