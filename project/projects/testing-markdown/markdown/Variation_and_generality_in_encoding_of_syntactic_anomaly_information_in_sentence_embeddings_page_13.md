Page 13

Table 3: Anomaly detection results on mono-lingual encoder vs. its cross-lingual variants. (MLP)

As for the transferability of the anomaly encoding (especially on the multi-one transfer, see Table 7), we observe non-trivial performance improvement in the multi-task setting for the Multi-task en-en model, relative to the cross-lingual variants. This suggests that Multi-task en-en may result in a somewhat more generalized anomaly encoding, while cross-lingual variants are more sensitive to properties of individual anomalies.

## A.2 Logistic regression results

|             | LR     | LR        | LR             | LR     | LR     | LR      |
|-------------|--------|-----------|----------------|--------|--------|---------|
|             | BoW    | InferSent | Skip- thoughts | GenSen | BERT   | Roberta |
| Mod-Noun    | 50     | 57.595    | 69.329         | 79.459 | 82.903 | 87.189  |
| Verb-Ob     | 50     | 72.078    | 85.001         | 87.469 | 93.033 | 95.187  |
| SubN-ObN    | 50     | 56.451    | 57.774         | 61.723 | 80.48  | 85.484  |
| Agree-Shift | 55.34  | 72.403    | 72.93          | 72.538 | 83.778 | 91.676  |
|             | MLP    | MLP       | MLP            | MLP    | MLP    | MLP     |
|             | BoW    | InferSent | Skip- thoughts | GenSen | BERT   | Roberta |
| Mod-Noun    | 50     | 50.662    | 71.764         | 80.132 | 83.453 | 87.514  |
| Verb-Ob     | 50     | 72.605    | 87.133         | 87.794 | 93.572 | 95.277  |
| SubN-ObN    | 50     | 50        | 58.975         | 62.284 | 81.176 | 85.943  |
| Agree-Shift | 56.518 | 73.166    | 75.701         | 74.736 | 87.536 | 92.282  |

As seen in Table 4, the results suggest that, for the most part, training with LR yields comparable

performance to that with MLP, consistent with the findings of Conneau et al. (2018). 10 We do find, however, that the LR classifier has higher accuracy for InferSent on Mod-Noun and SubN-ObN . This suggests that, to the extent that these anomalies are encoded (perhaps only weakly) in InferSent, they may in fact be better suited to linear extraction. For the task of Agree-Shift , most encoders show large improvements on MLP over LR, suggesting that morphological agreement anomalies are less conducive to linear extraction.

## A.3 Error Analysis and the Role of Content Word Order

We show the error analysis results on the out-ofsample Subj-Num data in this part. Table 6 shows the error rate in terms of each training task (original and content-word-only), with the top two strongest encoders within our investigation. Table 5 lists sampled false positives identified exclusively by each classifier, along with corresponding initial observations.

As we see in the main paper, BERT and RoBERTa show non-trivial benefits from functional information for improving overall anomaly sensitivity, but the content-word-only setting can account for a substantial proportion of contribution for detecting the anomalies. This is roughly consistent with what we found in Table 6 that training from content word order only can lead to relatively lower error rate for most cases on normal sentences.

## A.4 Transferring via Multi-Task Learning

Tables 7-8 list the multi-one transferring results with consistent training size compared to that of one-one transferring. We show the multi-one transfer results along with the performance change relative to the best one-one results obtained on the current test task when training with any one of the joint training tasks. Most of the multi-one transfer results show small amount of decrease from one-one transfer, suggesting that classifiers are still fitting to anomaly-specific properties that reduce transfer of anomaly detection.

## A.5 Description of External Tasks for Transfer Training

SOMO SOMO distinguishes whether a randomly picked noun or verb was replaced with another