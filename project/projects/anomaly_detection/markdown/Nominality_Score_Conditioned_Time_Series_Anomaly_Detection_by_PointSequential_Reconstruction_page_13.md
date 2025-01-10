## Algorithm 1 NPSR F1 ∗ Evaluation (soft gate function)

function NPSR( M pt , M seq , X 0 = { x 0 1 , ..., x 0 T } , y = { y 1 , ..., y T } , θ N , d )

Construct ˆ X c = { ˆ x c 1 , ..., ˆ x c T } with ˆ x c t ← M pt ( x 0 t )

▷ (15)

Construct ˆ X ∗ = { ˆ x ∗ 1 , ..., ˆ x ∗ T } ← M seq ( X 0 )

▷ (16)

Construct A ( · ) with A ( t ) ←∥ ˆ x c t - x 0 t ∥ 2 2

▷ section 3.5

Construct N ( · ) with N ( t ) ←∥ ˆ x c t - ˆ x ∗ t ∥ 2 2 / ∥ x 0 t - ˆ x ∗ t ∥ 2 2

▷ (1)

Construct g θ N ( N ( · )) with g θ N ( N ( t )) ← max(0 , 1 - N ( t ) /θ N )

▷ (8)

Construct A ( · ; · ) with A ( t ; τ ) ← A ( τ ) ∏ max( t - ✶ t = τ ,τ - 1) k =min( τ +1 ,t ) g θ N ( N ( k ))

▷ (7)

Construct ˆ A ( · ) with ˆ A ( t ) ← ∑ min( T,t + d ) τ =max(1 ,t - d ) A ( t ; τ )

▷ (6)

return F1 ∗ ← max θ a F1(ˆ y ( ˆ A ( · ) , θ a ); y )

## 4 Experiments

## 4.1 Datasets

We evaluate NPSR on the following datasets:

- · SWaT (Secure Water Treatment) [35]: The SWaT dataset is collected over 11 days from a scaleddown water treatment testbed with 51 sensors. During the last 4 days, 41 anomalies were injected using diverse attack methods, while only normal data were generated during the first 7 days.
- · WADI (WAter DIstribution testbed) [36]: The WADI dataset is acquired from a reduced city water distribution system with 123 sensors and actuators operating for 16 days. The first 14 days contain only normal data, while the remaining two days have 15 anomaly segments.
- · PSM (Pooled Server Metrics) [37]: The PSM dataset is collected internally from multiple application server nodes at eBay. There are 13 weeks of training data and 8 weeks of testing data.
- · MSL (Mars Science Laboratory) and SMAP (Soil Moisture Active Passive) [38, 13]: The MSL and SMAP datasets are public datasets collected by NASA, containing telemetry anomaly data derived from the Incident Surprise Anomaly (ISA) reports of spacecraft monitoring systems. The datasets have 55 and 25 dimensions respectively. The training set contains unlabeled anomalies.
- · SMD (Server Machine Dataset) [9]: The SMD is collected from a large internet company, comprising 5 weeks of data from 28 server machines with 38 sensors. The first 5 days contain only normal data, and anomalies are injected intermittently for the last 5 days.
- · trimSyn (Trimmed Synthetic Dataset) [24]: The original synthetic dataset was generated using trigonometric functions and Gaussian noises. We obtained the dataset from [39] and trimmed the test dataset such that only one segment of anomaly is present.

The statistics for the datasets are summarized in Table 1. For multi-entity datasets, Train#/Test# corresponds to the number of train/test time points summed over all entities, and the anomaly rate is calculated from the ratio between the sum of all anomaly points and sum of all test points.

Table 1: Datasets used in this study before preprocess.