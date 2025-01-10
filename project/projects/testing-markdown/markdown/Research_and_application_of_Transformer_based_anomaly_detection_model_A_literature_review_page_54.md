Page 54

Recall @ k is defined as:

Recall @ k = | anomalies above or at k % n ' | m (41)

It is used to capture the percentage of anomalies retrieved at k % of the test data sample. Where n ' is the total number of test samples. Intuitively, Recall @ k can be understood as the recall value of the data volume at k %. MAP and Recall @ k are improvements on precision and recall evaluation indexes to consider the comprehensive performance of the model under different data volumes. Liu et al. [126] used F 1, Micro -F 1, Macro -F 1, NMI and ARI evaluation indexes. Micro -F 1 and Macro -F 1 are both evaluation indexes used to measure multi-class classification tasks. Assuming that the total number of current categories is 3, Micro -F 1 is calculated as follows:

First, we calculate the total

Recall m = TP 1 + TP 2 + TP 3 TP 1 + TP 2 + TP 3 + FN 1 + FN 2 + FN 3 (42)