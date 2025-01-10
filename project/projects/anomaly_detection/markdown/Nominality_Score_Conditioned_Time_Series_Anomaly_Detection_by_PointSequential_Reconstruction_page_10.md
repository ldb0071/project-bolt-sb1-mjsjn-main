## Claim 2 Using a hard gate function,

g θ N ( N ) ≜ ✶ N<θ N (11)

If d = 1 , and there exist two thresholds: (i) θ 2 such that N ( t ) < θ 2 for all anomaly time points ( y t = 1 ) (ii) θ ∞ = ∞ ; then F1 ∗ ( ˆ A ( · ; g θ 2 ); y ) ≥ F1 ∗ ( ˆ A ( · ; g θ ∞ ); y ) , i.e., the best F1 score using the induced anomaly score with g θ 2 as the gate function is greater or equal to the best F1 score using the induced anomaly score with g θ ∞ as the gate function.

## Proof 2 For any anomaly time point t a , we have

ˆ A ( t a ; g θ 2 ) = min( T,t a +1) ∑ τ =max(1 ,t a -1) A ( τ ) = A ( t a -1) ✶ t a > 1 + A ( t a ) + A ( t a +1) ✶ t a <T (12)

where the first equality arises from the fact that g θ 2 ( N ( t a )) = 1 , according to (11) and the assumptions. For any normal time point t n , we have

ˆ A ( t n ; g θ 2 ) = min( T,t n +1) ∑ τ =max(1 ,t n -1) A ( t n ; τ, g θ 2 ) ≤ A ( t n -1) ✶ t n > 1 + A ( t n ) + A ( t n +1) ✶ t n <T (13)

since N ( t n ) might be greater than θ 2 and hence g θ 2 ( N ( t n )) ≤ 1 . However, we have

ˆ A ( t ; g θ ∞ ) = min( T,t +1) ∑ τ =max(1 ,t -1) A ( τ ) = A ( t -1) ✶ t> 1 + A ( t ) + A ( t +1) ✶ t<T (14)

regardless of normal or anomaly points since N ( t ) < θ ∞ for any t . Therefore, since ˆ A ( t a ; g θ 2 ) = ˆ A ( t a ; g θ ∞ ) and ˆ A ( t n ; g θ 2 ) ≤ ˆ A ( t n ; g θ ∞ ) , we get a potentially higher F1 ∗ when using θ 2 compared to using θ ∞ .

ˆ A ( · ; g θ ∞ ) can be viewed as the smoothed value (or shifted simple moving average) over A ( · ) with a period of 2 d +1 . This averaging method is common among other studies [11, 12, 32, 33]. Claim 2 implies that by conditioning on N ( · ) and calculating ˆ A ( t ) , the performance can be improved over using a simple smoothing value of A ( · ) . In practice, we can relax the constraint of d , and use other gated functions to yield a more flexible architecture. Note that the appropriateness of a nominality score is critical for this to work.