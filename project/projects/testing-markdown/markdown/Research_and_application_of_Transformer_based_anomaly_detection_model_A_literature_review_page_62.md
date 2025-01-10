Page 62

SPD combines sequence-based average detection delay with sequence alarm accuracy to achieve a metric for easy comparison of event sequence algorithms. SPD statistically quantifies the accuracy and normalized ADD ( NADD ) of the area under the curves, which is similar to the AUC evaluation index. To map ADD to the interval [0 , 1], the author performed a normalization operation. NADD = ADD/δ max . α denotes NADD , and P indicates Precision .

Similar to Doshi et al., Dang et al. [115] argued that time delay should be considered in the evaluation index of time series anomaly detection task. Therefore, they added additional time delay measurements based on Pre , Rec , and F 1 evaluation indexes to verify the validity of the detection.

Ma et al. [141] innovatively proposed the PerformanceScore index using the numerical fitting method, to better and more intuitively consider the performance of a model in terms of performance and training efficiency. The calculation is as follows:

PerformanceScore = e ( AUC + F 1 -1) × K log 10 Time (58)

The numerator of PerformanceScore 's calculation formula adopts the exponential form to amplify the performance impact of the 2 evaluation indexes AUC and F 1. The purpose of subtracting 1 is that the AUC and F 1 values are meaningless if they are lower than 0 . 5 because even if pure probability prediction is used, the results of the corresponding AUC and F 1 values are 0.5. The denominator takes a logarithm to the running time to weaken the impact of time on PerformanceScore . K in the numerator is an adjustable parameter, whose purpose is to balance the relationship between performance and efficiency, and can be set to different values according to different demand scenarios. For example, in a scenario with high-performance requirements, the value of parameter K should be increased, while in a scenario with high-efficiency requirements, the value of parameter K should be decreased.