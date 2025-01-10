Page 4

P ( x t | x t -1 , x t -2 , . . . , x t -n ) < ϵ (2)

An anomaly detection algorithm typically takes a time series as input and outputs either binary labels Y := { y 1 , y 2 , . . . , y T } or anomaly scores { s 1 , s 2 , . . . , s T } . In the case of binary labels, y t = 1 indicates an anomaly at time t , and y t = 0 indicates normal behavior. The number of anomalies should be much smaller than the number of normal data points, i.e., ∑ T t =1 y t ≪ T .

In the case of anomaly scores, s t represents the degree of anomaly at time t , with higher scores indicating a higher likelihood of an anomaly. This likelihood can be connected to the conditional probability definition, where a higher score is correlated to a lower conditional probability P ( x t | x t -1 , x t -2 , . . . , x t -n ) . A threshold θ can be applied to the scores to convert them into binary labels, where y t = 1 if s t > θ and y t = 0 otherwise.

Interval-Based Anomalies. It is common to define anomalies as continuous intervals of time points rather than individual points. Let R be a set of time intervals where anomalies occur, defined as R = { [ t 1 start , t 1 end ] , [ t 2 start , t 2 end ] , . . . , [ t k start , t k end ] } , where [ t i start , t i end ] represents the i -th anomalous time interval, with t i start and t i end being the start and end times of the interval, respectively. The binary labels for this definition would be:

y t = { 1 if t ∈ [ t i start , t i end ] for all i ∈ { 1 , . . . , k } 0 otherwise

Wewill consider this definition of anomalies in our evaluation of LLMs' anomaly detection capabilities. Note that we are interested in detecting anomalies at the data-point level instead of the sequence

level. While we use interval-based anomalies, these are still composed of individual anomalous data points within a sequence. This approach differs from sequence-level anomaly detection, where entire sequences would be classified as anomalous or normal.

Zero-Shot and Few-Shot Anomaly Detection. Few-shot anomaly detection involves providing the model f with a small set of labeled examples. Given n labeled time series { ( X 1 , Y 1 ) , ( X 2 , Y 2 ) , . . . , ( X n , Y n ) } , where Y i is a series of anomaly labels for each time step in X i , and a new unlabeled time series X new , the model g predicts:

{ s 1 , s 2 , . . . , s T } or { y 1 , y 2 , . . . , y T } = g ( X new , { ( X 1 , Y 1 ) , ( X 2 , Y 2 ) , . . . , ( X n , Y n ) } ) ,