Page 7

Figure 3: Performance of encoders on original tasks vs. 'content-word-only' tasks (function words removed). Numbers in embedded table show change in accuracy from original to content-word-only setting.

<!-- image -->

our findings in Section 6, that even with BERT and RoBERTa the classifiers appear to benefit from some anomaly-specific signal in addition to the potential generalized anomaly signal.

Examining these classifier-specific false positives, we can see some patterns emerging. The Mod-Noun classifier seems to be fooled in some cases by instances in which a modifier comes at the end of a phrase (e.g., 'a lovely misty gray'). For Verb-Ob , the classifier seems at times to be fooled by grammatical sentences ending with a verb, or by fronting of prepositional phrases. For SubNObN , the false positives often involve nouns that are likely uncommon as subjects, such as 'bases'. All of these patterns suggest that to some extent, the anomaly-specific cues that the classifiers detect are closely tied to the particulars of our perturbationssome of which may constitute artifacts-and in some cases, they raise the question of whether classifiers can succeed on these tasks based on fairly superficial word position cues, rather than syntax per se. We follow up on this question in the following section.

## 7.2 Role of content word order

To explore the possibility that classifiers may be succeeding in anomaly detection based on word position cues alone, rather than details of syntactic structure, we run a follow-up test using contentword-only versions of our probes. This serves as a test of how well the models can get by with coarsergrained information about content words positions.

Table 2: Representative false positives shared by all three reordering classifiers.

|         | Dolores asked pointing to a sway backed building made in part of logs and cover with a tin roof .                              |
|---------|--------------------------------------------------------------------------------------------------------------------------------|
|         | Fireworks ∗ , animals woven of fire and women dancing with flames .                                                            |
| BERT    | There were nice accessible veins there .                                                                                       |
|         | Three rusty screws down and Beth spoke , making him jump .                                                                     |
|         | The pillars were still warming up , but the more powerful they got the more obvious it became to Mac about what was going on . |
|         | The signals grew clearer , voices , at first faint , then very clear .                                                         |
|         | One row , all the way across , formed words connected without spaces .                                                         |
|         | And kidnappers with God only knew what agenda .                                                                                |
| RoBERTa | The slums would burn , not stone nobleman keeps . '                                                                            |
|         | ' Hull reinforcements are out of power .                                                                                       |
|         | From inside that pyramid seventy centuries look out at us .                                                                    |
|         | The ornaments ∗ she wore sparkled but isn 't noticeable much , as her blissful countenance shined over , surpassing it .       |

Fig. 3 shows anomaly detection performance when embeddings reflect only content words, as compared to the original anomaly detection performance. We see that across tasks, anomaly detection performance of Skip-thoughts, GenSen, BERT, and RoBERTa are all reduced as a result of the loss of function words. BERT and RoBERTa in particular show substantial losses for the three reordering tasks, indicating that these models benefit significantly from function words for encoding the information that supports detection of these anomalies. It is also worth noting, however, that the models do retain a non-trivial portion of their original accuracy even with function words absent, supporting the idea that to some extent these perturbations can be detected through coarser position information rather than fine-grained syntax. 8 This is an observation worth keeping in mind, particularly when interpreting anomaly detection as evidence of syntactic encoding (e.g. Conneau et al., 2018).

## 8 Discussion

In the experiments above, we have taken a closer look at the nature of syntactic anomaly encoding in sentence embeddings. Using fine-grained variation in types of syntactic anomalies, we show differences in patterns of anomaly detection across encoders, suggesting corresponding differences in the types of anomaly information encoded by these models. While the margins of difference in anomaly-specific sensitivity are less dramatic between small RNN-based models and larger transformer models, when we examine the generality of the detected anomaly signal, we find that only BERT and RoBERTa show signs of higher-level

anomaly awareness, as evidenced by non-trivial transfer performance between anomalies.

What might be driving the anomaly encoding patterns indicated by our results? Explicit syntactic training does not appear to be necessary. GenSen is the only model that includes an explicit syntactic component in its training (constituency parsing), which could help to explain that model's comparatively strong performance on the individual anomaly detection tasks. However, it is noteworthy that GenSen performs mostly on par with Skipthoughts, which constitutes just one of GenSen's objectives, and which uses only prediction of adjacent sentences. BERT and RoBERTa, the only models to show signs of more generalized anomaly encoding, have no explicit syntactic training at all. However, various findings have suggested that these types of models do develop syntactic sensitivity as a result of their more generalized training objectives (Goldberg, 2019; Liu et al., 2019a; Alleman et al., 2021; Tenney et al., 2019).