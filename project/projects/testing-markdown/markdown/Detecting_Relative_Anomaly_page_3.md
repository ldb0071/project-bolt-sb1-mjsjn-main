Page 3

## III. DETECTING RELATIVE ANOMALY

Approaches to unsupervised anomaly detection that target the frequency criterion may not perform well in the presence of frequently occurring anomalies, as discussed in the previous sections. We now introduce two anomaly detection models that take into account the location of the most typical observations when determining how anomalous a new observation is. Both of these methods have the advantage that they provide a quantitative ordering of the data points in terms of how anomalous they are. We also investigate relationships and differences with other approaches to anomaly detection, especially the approach of [2], which we discussed in Section II-B.

## A. Popularity approach

We propose to consider a 'random walk' between nodes based on the unnormalized similarity matrix S -instead of the transition probability matrix P considered in Section II-B. From

S = diag( S1 ) P , (5)

we see that the similarity [ S ] ij between two nodes x i and x j factors into the transition probability [ P ] ij and

the vertex degree of x i . This has the effect that the random walk weakens when transitioning through nodes whose vertex degree is medium or small, and that it strengthens when passing through nodes of high vertex degree. We label an observation x i as anomalous if its relative anomaly ,

RA( x i ) · · = -( s ) i , (6)

is small, where s is the dominant left-eigenvector of S . This eigenvector is unique with all elements positive by the Perron-Frobenius theorem.

We can gain further insight into this algorithm via a connection with the network analysis literature. [11] considers a network of persons, where each person rates each other person as popular or not. Their goal is to determine an overall popularity score for each person, based on the pairwise ratings. They suggest that a measure of overall popularity of person i should depend not only on how many people in the network deem that person to be popular, but also whether those people are themselves popular. This leads to the eigenproblem ∑ j [ S ] ij v j = λv i , where v i is the overall popularity of person i , and [ S ] ij takes value one if person i considers person j popular. A person is labeled as overall popular when its entry in the dominant left-eigenvector of the adjacency matrix, called the eigenvector centrality, is large. We see that by measuring anomaly using (6) instead of (3), how anomalous an observation is depends not only on how many other observations are close, but also on whether these other observations themselves have close neighbors. As a result, high vertex degree observations that are sufficiently far from many other observations in the similarity graph will be labeled anomalous. Asymptotically, the leading eigenvector of a kernel matrix converges to the leading eigenfunction, ϕ , in the following eigenproblem [12]:

∫ s ( x , y ) f ( x ) ϕ ( x )d x = δϕ ( y ) . (7)

Here f is the data density, and δ is the eigenvalue that corresponds to ϕ . We see that, asymptotically, the popularity ϕ ( y ) of an observation y is high if values x that are close to y have high density and are popular themselves. Here the size of the surrounding of y is determined by the choice of s .

The power method can be used to find the dominant left-eigenvector of S . This iterative method starts from a random initialization, s 0 , and then follows the recurrence relation s t +1 = Ss t / ‖ Ss t ‖ 2 . The convergence is geometric, with ratio | λ 2 /λ 1 | , where λ 1 and λ 2 denote the first and second dominant eigenvalue of S , respectively. We find that the error ‖ Ss t -s T t Ss t s t ‖ 2 typically becomes