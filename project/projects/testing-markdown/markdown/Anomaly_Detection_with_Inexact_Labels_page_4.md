Page 4

sign( a ( x ) -h ) , (1)

where x is an instance and h is a threshold. The true positive rate (TPR) of anomaly score function a ( x ) is the rate that it correctly classifies a random anomaly from p A as anomalous,

TPR( h ) = E x A ∼ p A [ I ( a ( x A ) > h )] , (2)

where E is the expectation and I ( · ) is the indicator function; I ( A ) = 1 if A is true, and I ( A ) = 0 otherwise. The false positive rate (FPR) is the rate that it misclassifies a random non-anomalous instance from p N as anomalous,

FPR( h ) = E x N ∼ p N [ I ( a ( x N ) > h )] . (3)

The ROC curve is the plot of TPR( h ) as a function of FPR( h ) with different threshold h . The area under this curve (AUC) (Hanley and McNeil, 1982) is computed as follows (Dodd and Pepe, 2003):

AUC = ∫ 1 0 TPR(FPR -1 ( s )) ds = E x A ∼ p A , x N ∼ p N [ I ( a ( x A ) > a ( x N ))] , (4)

where FPR -1 ( s ) = inf { h ∈ R | FPR( h ) ≤ s } . AUC is the rate where a randomly sampled anomalous instance has a higher anomaly score than a randomly sampled non-anomalous instance.