Page 6

L + cdl = T ∑ i =1 |D q i | ∑ j =1 w t i L ϕ i ( ϕ i ( x j ; θ t i ) , y j ) , (4)

where w t i denotes the importance score of its base model ϕ i at epoch t . Below we present how w t i is learned via ψ .

Our sequential modeling-based estimation of the dynamic importance score is built upon the intuition that if a base model ϕ i has good generalization ability, its predicted anomaly scores for different input data should be consistent and accurate at different training stages, where various anomaly heterogeneity gradually emerges as the training unfolds. To this end, wen train a sequential model ψ to capture the consistency and accuracy of the anomaly scores yielded by all base models. This is achieved by training ψ to predict the next epoch's anomaly scores of the base models using their previous output anomaly scores. Specifically, given a training sample x j , the base models { ϕ i } T i =1 make a set of anomaly scoring predictions s j = { s ji } T i =1 , resulting in a sequence of score predictions prior to an epoch t , S t j = [ s t -K j , · · · , s t -2 j , s t -1 j ] tracing back to K previous steps, then ψ : S → R T aims to predict the scoring predictions of all T base models at epoch t . In our implementation, ψ is specified by a sequential neural network parameterized by θ ψ , and it is optimized using the following next sequence prediction loss:

L seq = ∑ x j ∈D L mse (ˆ s t j , s t j ) , (5)

where ˆ s t j = ψ ( S t j ; θ ψ ) and s t j are respectively the predicted and actual anomaly scores of x j from the base models at epoch t , and L seq is a mean squared error function. Instead of using supervised losses, the model ψ is trained using a self-supervised loss function in Eq. 5 so as to withhold the ground truth labels for avoiding overfitting the labeled data and effectively evaluating the generalization ability of the base models.

The generalization error r t i for base model ϕ i is then defined using the difference between the predicted anomaly score ˆ s t ji and the real label y j as follows:

r t i = 1 |D ' | ∑ x j ∈D ' c j L mse (ˆ s t ji , y j ) , (6)

where D ' = D\X n,i and c j is a pre-defined category-wise weight associate with each example x j . In other words, r t i measures the detection error of ϕ i in predicting the anomaly scores for the seen anomalies in X a,i and all other unseen normal and anomaly training examples, excluding the seen normal examples X n,i w.r.t. ϕ i . A larger c j is assigned if x j is an unseen anomaly to highlight the importance of detecting unseen anomalies; and it is assigned with the same value for the other examples otherwise.

Since a large r t i implies a poor generalization ability of the base model ϕ i at epoch t , we should pay less attention to it when updating the unified model g . Therefore, the importance score of ϕ i is defined as the inverse of its generalization error as follows:

w t i = exp( -r t i ) ∑ T i exp( -r t i ) . (7)