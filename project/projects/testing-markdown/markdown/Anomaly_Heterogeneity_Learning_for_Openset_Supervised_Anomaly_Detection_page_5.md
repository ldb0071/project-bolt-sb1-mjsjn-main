Page 5

where ℓ dev is specified by a deviation loss [32], following previous OSAD methods DRA [15] and DevNet [32], and D s i is the support set in D i . Although only limited seen anomalies are available during the training stage, the mixture of normal and anomaly samples in each D i differs largely from each other, allowing each ϕ i to learn a different anomaly distribution for anomaly scoring.

Collaborative Differentiable Learning. Each ϕ i captures only one part of the whole picture of the underlying anomaly heterogeneity. Thus, we then perform a collaborative differentiable learning that utilizes the losses from the

T base models to learn the unified AD model g for capturing richer anomaly heterogeneity. The key insight is that g is optimized in a way to work well on a variety of possible anomaly distributions, mitigating potential overfitting to a particular anomaly distribution. Further, the optimization of g is based on the losses on the query sets that are not seen during training the base models in Eq. 1, i.e ., g is optimized under a surrogate open environment, which helps train a more generalized OSAD model g .

Specifically, g is specified to have exactly the same network architecture as the based model ϕ i , and its weight parameters θ g at epoch t +1 are optimized based on the losses resulted from all base models at epoch t :

θ t g ←-θ t -1 g -α ∇L cdl , (2)

where α is a learning rate and L cdl is an aggregated loss over T base models on the query sets:

L cdl = T ∑ i =1 |D q i | ∑ j =1 L ϕ i ( ϕ i ( x j ; θ t i ) , y j ) . (3)

In the next training epoch, all θ t +1 i of the base models are set to θ t g as their new weight parameters. We then optimize the base models ϕ i using Eq. 1 on the support sets, and subsequently optimize the unified model g using Eq. 2 on the query sets. This alternative base model and unified model learning is used to obtain an AD model g that increasingly captures richer anomaly heterogeneity.

Learning the Importance Scores of Individual Anomaly Distributions. The quality of the simulated anomaly distribution data D i can vary largely, leading to base models of

large difference in their effectiveness. Also, a base model that is less effective at one epoch can become more effective at another epoch. Therefore, considering every base model equally throughout the optimization dynamic may lead to inferior optimization because poorly performing base models can affect the overall performance of the unified model g . To address this issue, we propose a self-supervised sequential modeling module to dynamically estimate the importance of each base model at each epoch. This refines the L cdl loss as follows: