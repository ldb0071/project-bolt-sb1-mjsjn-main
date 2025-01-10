Page 13

## B.1. Generating Partial Anomaly Distribution Datasets

Our proposed approach creates a diverse collection of data subsets by randomly selecting a subset of normal clusters and incorporating labeled anomaly examples to form the support and query sets for learning partial anomaly distributions. Specifically, we generate each data subset as follows.

Normal Samples in Each Data Subset. We employ the K-means algorithm to cluster normal samples into three groups. In each data subset, we randomly select two clusters to form the support and query sets. We follow this way to generate six such data subsets. Furthermore, we include an additional subset consisting of all normal samples to capture a holistic view of the distribution of normal instances, in which normal samples are randomly divided into two parts to form the support and query sets.

Abnormal Samples in Each Data Subset. To simulate diverse open-set environments in partial anomaly distribution subsets, for the setting with M = 10 , we choose 50% of the seen anomalies randomly as virtual seen anomalies, which

Algorithm 1 Anomaly Heterogeneity Learning ( AHL )

Input: Input D = { x , y } , { ϕ } T 1 , ψ Output: Output g

- 1: /* Heterogeneous Anomaly Distribution Generation */
- 2: Construct D i through grouping training set D into T groups
- 3: /* Collaborative Differentiable Learning */
- 4: for epoch = 1 to N do
- 5: Update parameter of base model ϕ i for D i based on Eq.(1)
- 6: /* Learning Importance Scores of Individual Anomaly Distributions */
- 7: if epoch > = 5 then
- 8: Compute the generalization error r i and importance score w i for ϕ i with the help of sequential model ψ via Eq.(6) and Eq.(7), respectively
- 9: else
- 10: Treat all ϕ equally, w i = 1 T
- 11: end if
- 12: Update parameter of g based on Eq.(4)
- 13: Set the parameters of ϕ i as the new weight parameters of g
- 14: end for

are present in both the support and query sets. The remaining 50% are virtual unseen anomalies that are only available in the query set. In the case of M = 1 , where we only have one seen anomaly instance, both the training and refining sets have access to this sample.

To enhance the variety of anomaly samples in our approach, we introduce three distinct anomaly augmentation techniques to generate pseudo anomaly samples: CutMix [60], CutPaste [22], DREAM Mask [63]. These techniques are randomly applied to each partial anomaly distribution learning data subset to introduce diverse types of anomalies.

## B.2. The Algorithm of AHL