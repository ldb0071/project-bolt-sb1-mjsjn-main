Page 6

<!-- image -->

As for how our generated anomaly types vary in supporting transfer to other anomaly types, we again note some differences between Mod-Noun and Verb-Ob . While Verb-Ob proved more accessible for detection than Mod-Noun , in the transfer setting we find that the broader hierarchical perturbation in Verb-Ob is often less conducive to transfer than Mod-Noun . Below we explore further to better understand what models are learning when trained on these anomalies.

## 7 Further analyses

## 7.1 Exploring false positives

The results above indicate that embeddings from these encoders contain non-trivial signal relevant for specific perturbations, but only BERT and RoBERTa show promise for encoding more general awareness of anomalies. To further explore the

anomaly signal learned from these representations, in this section we apply the learned anomaly classifiers to an entirely new dataset, for which no perturbations have been made. For this purpose, we use the Subj-Num dataset from Conneau et al. (2018). 7 By default we can assume that all sentences in these data are non-anomalous, so any sentences labeled as perturbed can be considered errors. After testing the pre-trained classifiers on embeddings of these unperturbed sentences, we examine these false positives to shed further light on what the classifiers have come to consider anomalies. We focus this analysis on BERT and RoBERTa, as the two models that show the best anomaly detection and the only signs of generalized anomaly encoding.

Error rates for this experiment are shown in Appendix Table 6. We see that in general the false pos-

Table 1: Error rate on Subj-Num data.

| Train task   | Mod-Noun   | Verb-Ob   | SubN-ObN   | Agree-Shift   |
|--------------|------------|-----------|------------|---------------|
| BERT         | 4.9%       | 2.61%     | 4.81%      | 31.98%        |
| RoBERTa      | 7.73%      | 3.6%      | 7.83%      | 22.13%        |

itive rates for these models are very low. The highest error rates are found for the classifiers trained on Agree-Shift , and examination of these false positives suggests that the majority of these errors are driven by confusion in the face of past-tense verbs (past tense verbs do not inflect for number in English-so past tense verbs were few, and uninformative when present, in our Agree-Shift task). This type of error is less informative for our purposes, so we exclude the Agree-Shift classifier for these error analyses. For the other classifiers, the error rates are very low, suggesting that the signal picked up on by these classifiers is precise enough to minimize false positives in normal inputs.

To examine generality of the anomaly signal detected by the classifiers, we look first to sentences that receive false positives from multiple of the three reordering-based classifiers. We find that within the union of false positives identified across all three classifiers, sentences that are labeled as anomalous by at least two classifiers make up 28.6% and 35.6% for BERT and RoBERTa respectively-and sentences labeled as anomalous by all three classifiers make up 7.3% and 9.6%. Since no two classifiers were trained on the same perturbation, the existence of such overlap is consistent with some generality in the anomaly signal for the representations from these two models.

Table 2 lists samples of false positives identified by all three classifiers. While these sentences are generally grammatical, we see that many of them use somewhat convoluted structures-in many cases one can imagine a human requiring a second pass to parse these correctly. In some cases, as in the 'Fireworks' example, there is not a full sentence-or in the 'ornaments' example, there appears to be an actual ungrammaticality. The fact that the classifiers converge on sentences that do contain some structural oddity supports the notion that these classifiers may, on the basis of these models' embeddings, have picked up on somewhat of a legitimate concept of syntactic anomaly.

Of course, there are also many items that individual classifiers identify uniquely. We show examples of these in Appendix Table 5. The presence of such anomaly-specific errors is consistent with