Page 6

## THE STATISTICS OF DATASETS

Table I summarizes the details of the dataset after each grouping under each selection method.

|             |              | Train          | Train          | Train                                  | Train                                  | Test           | Test           | Test                                   | Test                                   |
|-------------|--------------|----------------|----------------|----------------------------------------|----------------------------------------|----------------|----------------|----------------------------------------|----------------------------------------|
| Dataset     | Grouping     | # Log messages | # Log messages | # Log sequences (random/chronological) | # Log sequences (random/chronological) | # Log messages | # Log messages | # Log sequences (random/chronological) | # Log sequences (random/chronological) |
|             |              | Normal         | Anomaly        | Normal                                 | Anomaly                                | Normal         | Anomaly        | Normal                                 | Anomaly                                |
| BGL         | 60 minutes   | 3059327        | 1120874        | 2884 / 2625                            | 536 / 496                              | 266085         | 267207         | 722 / 981                              | 129 / 171                              |
| BGL         | 100 messages | 3362700        | 408100         | 37708 / 55401                          | 4081 / 25066                           | 858300         | 84393          | 8583 / 13851                           | 844 / 6309                             |
| Spirit      | 60 minutes   | 329396         | 3359245        | 2884 / 2625                            | 536 / 496                              | 615334         | 696025         | 722 / 981                              | 129 / 171                              |
| Spirit      | 100 messages | 2061600        | 1938400        | 37708 / 55401                          | 4009 / 25066                           | 965400         | 34600          | 9427 / 13851                           | 817 / 6309                             |
| Thunderbird | 60 minutes   | 2070050        | 7081597        | 2884 / 2625                            | 536 / 496                              | 502107         | 346246         | 722 / 981                              | 129 / 171                              |
| Thunderbird | 100 messages | 4286900        | 3713100        | 37708 / 55401                          | 4009 / 25066                           | 1807800        | 192200         | 9427 / 13851                           | 817 / 6309                             |

there was even one abnormal log message in the log sequence, the log sequence was marked as abnormal by LogELECTRA.

The method of selecting training data also affects the accuracy of anomaly detection. There are two methods for selecting training data: chronological selection and random selection. Since the state of the monitored system usually changes with time, log messages that are not included in the training data may appear in the test data in a chronological selection [14]. On the other hand, in random selection, log messages are randomly shuffled and then split into training data and test data. In this way, the training data contains more diverse information. Although random selection is suitable for measuring the performance of the detection method itself, it is not a realistic scenario that can be used in a real environment. In this paper we experimented under both selection methods. The split ratio was set as train : test = 80 : 20.

## C. Implementation details

We describe the hyper-parameters of LogELECTRA. As a discriminator, we used a Transformer model with 512 dimensional 6 hidden layers. As the generator, we used a model with three 256-dimensional hidden layers. The mask probability of the input to the generator was set to 15 % and λ = 50 was used as the weight coefficient for the objective function in Eq.4. AdamW was used as the optimizer [39]. Other parameters were tuned empirically.

## D. Evaluation Metrics

To measure the effectiveness of the models in detecting anomalies, we use the Precision, Recall, Specificity, and F1Score metrics defined as follows.

- · Precision is the percentage of logs detected as anomalies in the model that were truly anomalous. Prec = TP TP+FP .
- · Recall is the percentage of anomaly logs detected by the model out of all true anomaly logs. Rec = TP TP+FN .
- · Specificity is the percentage of logs identified as normal by the model out of all true normal logs. Spec = TN TN+FP .
- · F1 score is The harmonic mean of Precision and Recall. F1 = 2 ∗ Prec ∗ Rec Prec+Rec .

TP (True Positive) is the number of abnormal log sequences correctly detected by the model; FP (False Positive) is the number of normal log sequences falsely identified as anomaly; FN (False Negative) is the number of abnormal log sequences not detected by the model; and TN (True Negative) is the number of normal log sequences not detected by the model. For methods that require threshold adjustment, including our method, the optimal threshold was determined by F1 maximization.

## E. Results

Comparison results of detection performance on the BGL, Spirit, and Thunderbird datasets are shown in tables II, III, and IV, respectively. These results show that our LogELECTRA achieved higher performance in all experimental settings than other unsupervised methods such as DeepLog and LogAnomaly. They also show that LogELECTRA performs comparably to or better than semi-supervised methods such as PLELog. In particular, under the chronological training data selection, LogELECTRA has higher detection performance than other methods that do not use anomaly labels for training. Chronological training data selection is a realistic strategy. Furthermore, in some experiments, LogELECTRA performs comparably to supervised methods, despite the unfair settings.