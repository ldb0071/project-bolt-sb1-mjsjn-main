Page 5

## IV. EXPERIMENTS

In this paper, the experiment was conducted in accordance with the survey paper [1] to compare the performance of our method with existing methods. The following describes the dataset used in our experiments, the comparison methods, the implementation details for our method, evaluation metrics, and the results.

## A. Dataset

Three public datasets (BGL, Spirit, and Thunderbird) were used to evaluate the model of log anomaly detection [36], [37]. Details of each dataset are as follows.

- · BGL (Blue Gene/L) is a log dataset of supercomputing systems collected by Lawrence Livermore National Labs. Each message in this dataset was manually labeled as either normal or abnormal.
- · Spirit is a collection of system log data from the Spirit supercomputing system installed at Sandia National Labs (SNL). Since this dataset contains a large number of log

messages, we use a small set containing the first 5 million log lines of the original Spirit dataset in this experiments.

- · Thunderbird dataset is a log datasset collected from SNL's Thunderbird supercomputer. Since the Thunderbird is also very large, we use a small set of the first 10 million in this experiments.

## B. Comparison methods

We compared our proposed method LogELECTRA with DeepLog, LogAnomaly, PLELog, LogRobust, and CNN [19], [20], [22]-[24]. These methods have publicly available source code; we did not include Logsy [21] in the comparison since its source code was not publicly available. For hyperparameters, the same values were used for models reported in the original papers; otherwise, hyperparameters were adjusted empirically. For the log parser, we used Drain [7] to split the logs into log templates and log parameters for all models requiring parsing.

In addition, LogAnomaly is trained by adding domainspecific antonyms and synonyms to the template2vec model in the original paper, but this information was not available, so we used FastText [29], a pre-trained Word2Vec, to compute the semantic vector of the log templates. For PLELog, we used a Glove [38], another pre-trained word vector model, to compute the semantic vectors of the log templates, as in the original paper [22].

These five existing methods detect anomalies on the basis of the time series of log messages unlike our method. Therefore, for these methods,multiple log messages need to be grouped in some way before training. In this experiments, log messages are grouped into log sequences by using a fixed window strategy that groups them by fixed width in accordance with the timestamp of occurrence. Also, in accordance with the ground truth labels of each datasets, a log sequence is considered anomalous if it contains an anomalous log message. If all log messages contained in the log sequence are normal, the log sequence is considered normal. In this paper, experiments were conducted for two patterns of fixed widths: 100 messages and 60 minutes.

On the other hand, unlike other existing methods, LogELECTRA performs anomaly detection on a single line of log messages. Therefore, in this experiment, to compare its detection performance with those of existing methods, a log sequence consisting of multiple log messages was input to LogELECTRA and the detection performance was evaluated. If

TABLE I