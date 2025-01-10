## 3.4 The Induced Anomaly Score

Having N ( · ) defined, we now propose a method for integrating any given N ( · ) and anomaly score A ( · ) to yield an induced anomaly score ˆ A ( · ) , and show some instances where the performance will improve over using A ( · ) or a smoothed A ( · ) . Consider a dataset that contains subsequence anomalies. For two near time points t and τ , it is natural to assume that the possibility of t being anomalous is affected by τ . We quantify this effect as A ( t ; τ ) , which is the induced anomaly score at t due to τ . By summing over a range of τ around t , we get the induced anomaly score at t :

ˆ A ( t ) ≜ min( T,t + d ) ∑ τ =max(1 ,t -d ) A ( t ; τ ) (6)

where d is the induction length. Furthermore, we define A ( t ; τ ) as a gated value of A ( τ ) , which is controlled by the nominality score from τ to t :

A ( t ; τ ) ≜ A ( τ ) max( t -✶ t = τ ,τ -1) ∏ k =min( τ +1 ,t ) g θ N ( N ( k )) =    A ( τ ) g θ N ( N ( τ +1)) ...g θ N ( N ( t )) t > τ A ( τ ) t = τ A ( τ ) g θ N ( N ( τ -1)) ...g θ N ( N ( t )) t < τ (7)

<!-- image -->

Figure 2: The probability density function for N n and N a of the toy dataset at (a) D = 2 and (b) D = 100 .

<!-- image -->

where the gate function g θ N ( N ) is some transformation function of N conditioned on a threshold θ N . A reasonable assumption is that g θ N ( N ) is a non-increasing function of N , i.e., N > N ' implies g θ N ( N ) ≤ g θ N ( N ' ) . Indeed, if N ( k ) is large, then time point k is likely a normal point, and any two points t 1 , t 2 , where t 1 < k < t 2 , are unlikely to be in the same anomaly subsequence, hence A ( t 1 ; t 2 ) and A ( t 2 ; t 1 ) should be small. Explicitly, we can use ˆ A ( t ) = ˆ A ( t ; g θ N ) and A ( t ; τ ) = A ( t ; τ, g θ N ) to denote that these values are conditioned on g θ N . Overall, ˆ A ( · ) can be thought of as some (unnormalized) weighted smoothed value of A ( · ) , where the weights are the product of g θ N ( N ( · )) across some range. We consider the following two cases: