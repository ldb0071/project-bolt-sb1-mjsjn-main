## Claim 1 Using a soft gate function,

g θ N ( N ) ≜ max(0 , 1 -N θ N ) (8)

If there exists θ 1 such that N ( t ) ≥ θ 1 for all normal points ( y t = 0 ), then F1 ∗ ( ˆ A ( · ; g θ 1 ); y ) ≥ F1 ∗ ( A ( · ); y ) , i.e., the best F1 score using the induced anomaly score with g θ 1 as the gate function is greater or equal to the best F1 score using the original anomaly score.

## Proof 1 For any normal time point t n , we have

ˆ A ( t n ; g θ 1 ) = min( T,t n + d ) ∑ τ =max(1 ,t n -d ) A ( t n ; τ, g θ 1 ) = min( T,t n + d ) ∑ τ =max(1 ,t n -d ) A ( τ ) ✶ t n = τ = A ( t n ) (9)

The equality in the middle arises from the fact that g θ 1 ( N ( t n )) = 0 , according to (8) and the assumptions. However, for any anomaly point t a , we have

ˆ A ( t a ; g θ 1 ) = min( T,t a + d ) ∑ τ =max(1 ,t a -d ) A ( t a ; τ, g θ 1 ) ≥ A ( t a ) (10)

This is because N ( t a ) might be lower than θ 1 , and hence g θ 1 ( N ( t a )) ≥ 0 . By potentially having a higher ˆ A ( t ) than A ( t ) for anomaly points, we get a potentially higher F1 ∗ .

Such a θ 1 indeed exists in real applications (e.g. the minimum nominality score among all normal points t n ). However, targeting this value barely leads to any improvement for F1 ∗ in practice. This is because anomaly points are generally fewer than normal points, resulting in barely any anomaly points t a having N ( t a ) < θ 1 . Nevertheless, we have shown that the soft gate function along with the induced anomaly score can provably yield equal or better F1 ∗ under some threshold.