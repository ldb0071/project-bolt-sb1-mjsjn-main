Page 5

min l :1 -ˆ F VD ( x l ) ≤ q min { paths from · to x l } ∑ ( i,j ): is edge in path -ln s ij .

Then label · as anomalous if RA q ( · ) is large. RA q ( · ) = 1 if · is one of the q · 100 percent of observations which are considered most normal, and RA q ( · ) > 1 otherwise. This shortest path problem can be solved more efficiently when considering a sparsified version of S , for example by applying a directed k nearest neighbor truncation.

An advantage of this approach is that the tuning parameter q allows controlling the number of data points considered typical. Several central regions of the data may emerge for a larger value of q . A disadvantage is the higher computational complexity of the shortest path problem, which may however be reduced through subsampling.

We can gain further insight into this approach when used with the kernel function in (1). Then the path length in (10) becomes

(11)

∑ ( i,j ): is edge in path -ln exp( -d ( x i , x j ) 2 /γ ) ∝ ∑ ( i,j ): is edge in path d ( x i , x j ) 2 .

We see that the squared distance between two observations discourages large jumps, and thereby paths through high density regions are encouraged. While the tuning parameter γ does not influence the comparison between two path lengths, since it is only a multiplicative constant, it influences the calculation of ˆ F VD in (10). A larger value for γ means that the bandwidth in the vertex degree estimator is higher, thereby smoothing the density

more, which can be used to smear away small clusters of frequently occurring anomalies.

## C. Normalization

A relative anomaly measure RA can be transformed into a degree of anomaly in (0 , 1) for each observation · using the empirical distribution function ˆ F of directed anomalies in the training data:

DORA( · ) · · = ˆ F (RA( · )) ∈ (0 , 1) . (12)

## D. Determining largest univariate deviations

Once an anomalous state x anomalous is identified, we can determine which univariate features deviate most from what is normal as follows: