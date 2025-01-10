Page 1

## Precision and Recall for Range-Based Anomaly Detection

Tae Jun Lee * Microsoft

Justin Gottschlich, Nesime Tatbul Intel Labs

Eric Metcalf, Stan Zdonik Brown University

## ABSTRACT

Classical anomaly detection is principally concerned with pointbased anomalies , anomalies that occur at a single data point. In this paper, we present a new mathematical model to express rangebased anomalies , anomalies that occur over a range (or period) of time.

## 1 INTRODUCTION

Anomaly detection (AD) seeks to identify atypical events. Anomalies tend to be domain or problem specific, and many occur over a period of time. We refer to such events as range-based anomalies , as they occur over a range (or period) of time 1 . Therefore, it is critical that the accuracy measures for anomalies, and the systems detecting them, capture events that occur over a range of time. Unfortunately, classical metrics for anomaly detection were designed to handle only fixed-point anomalies [1]. An AD algorithm behaves much like a pattern recognition and binary classification algorithm: it recognizes certain patterns in its input and classifies them as either normal or anomalous. For this class of algorithms, Recall and Precision are widely used for evaluating the accuracy of the result. They are formally defined as in Equations 1 and 2, where TP denotes true positives, FP denotes false positives, and FN denotes false negatives.

Recall = TP ÷ ( TP + F N ) (1)

Precision = TP ÷ ( TP + F P ) (2)

While useful for point-based anomalies, classical recall and precision suffer from their inability to capture, and bias, classification correctness for domain-specific time-series anomalies. Because of this, many time-series AD systems' accuracy are being misrepresented, as point-based recall and precision are used to measure their effectiveness [9]. Furthermore, the need to accurately identify time-series anomalies is growing due to the explosion of streaming and real-time systems [2, 4, 7, 8, 10]. To address this, we redefine recall and precision to encompass range-based anomalies. Unlike prior work [2, 6], our mathematical definitions are a superset of the classical definitions, enabling our system to subsume point-based anomalies. Moreover, our system is broadly generalizable, providing specialization functions to control a domain's bias along a multidimensional axis that is necessary to accommodate the needs of specific domains.

In this short paper, we present novel formal definitions of recall and precision for range-based anomaly detection that both subsume those formerly defined for point-based anomaly detection as well as being customizable to a rich set of application domains. Empirical data has been omitted to meet the venue's compressed format.

Table 1: Notation

| Notation   | Description                         |
|------------|-------------------------------------|
| R          | set of real anomaly ranges          |
| R i        | the i th real anomaly range         |
| P          | set of predicted anomaly ranges     |
| P j        | the j th predicted anomaly range    |
| N r        | number of real anomaly ranges       |
| N p        | number of predicted anomaly ranges  |
| α          | relative weight of existence reward |
| β          | relative weight of overlap reward   |
| γ ()       | overlap cardinality function        |
| ω ()       | overlap size function               |
| δ ()       | positional bias function            |

## 2 RANGE-BASED RECALL

Classical Recall rewards an AD system when anomalies are successfully identified (i.e., TP) and penalizes it when they are not (i.e., FN). It is computed by counting the number of anomalous points successfully predicted and then dividing that number by the total number of anomalous points. However, it is not sensitive to domains where a single anomaly can be represented as a range of contiguous points. In this section, we propose a new way to compute recall for such range-based anomalies. Table 1 summarizes our notation.

Given a set of real anomaly ranges R = { R 1 , .., R N r } and a set of predicted anomaly ranges P = { P 1 , .., P N p } , our Recall T ( R , P ) formulation iterates over the set of all real anomaly ranges ( R ), computing a recall score for each real anomaly range ( R i ∈ R ) and adding them up into a total recall score. This total score is then divided by the total number of real anomalies ( N r ) to obtain an average recall score for the whole time-series.

Recall T ( R , P ) = /summationtext.1 Nr i = 1 Recall T ( R i , P ) N r (3)

When computing the recall score Recall T ( R i , P ) for a single real anomaly range R i , we take the following aspects into account:

- · Existence : Identifying an anomaly (even by a single point in R i ) may be valuable in some application domains.
- · Size : The larger the size of the correctly predicted portion of R i , the higher the recall score will likely be.
- · Position : In some cases, not only size, but also the relative position of the correctly predicted portion of R i may be important to the application (e.g., early and late biases).
- · Cardinality : Detecting R i with a single predicted anomaly range P j ∈ P may be more valuable to an application than doing so with multiple different ranges in P .

We capture these aspects as a sum of two reward terms weighted by α and β , respectively, where 0 ≤ α , β ≤ 1 and α + β = 1 . α represents the relative importance of rewarding existence , whereas β represents the relative importance of rewarding size , position , and