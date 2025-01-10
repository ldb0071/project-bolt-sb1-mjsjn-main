Page 4

## 4 Experiments

We generate probing datasets for each of the anomaly tests described above. We then apply these tasks to examine anomaly sensitivity in a number of generic sentence encoders. 4

Datasets Each of the above perturbations is used to create a probing dataset consisting of normal sentences and corresponding modified sentences, labeled as normal and perturbed , respectively. Within each probing task, each normal sentence has a corresponding perturbed sentence, so the label sets for each task are fully balanced. Each probe is formulated as a binary classification task. Normal sentences and their corresponding perturbed sentences are included in the same partition of the train/dev/test split, so for any sentence in the test set, no version of that sentence (neither the perturbed form nor its original form) has been seen at training time. We draw our normal sentences from MultiNLI (Williams et al., 2018) (premise only). Perturbations of those sentences are then generated as our perturbed sentences.

4 Please refer to the Appendix A.5, A.6, A.7 for more details about data generation, probing implementation, as well as descriptions about encoders and external tasks.

Figure 1: Anomaly detection performance.

<!-- image -->

Probing We analyze sentence embeddings from these prominent sentence encoders: InferSent (Conneau et al., 2017), Skip-thoughts (Kiros et al., 2015), GenSen (Subramanian et al., 2018), BERT (Devlin et al., 2019), and RoBERTa (Liu et al., 2019b). The first three models are RNNbased, while the final two are transformer-based.

To test the effectiveness of our control of word content, we also test bag-of-words (BoW) sentence embeddings obtained by averaging of GloVe (Pennington et al., 2014) embeddings. This allows us to verify that our probing tasks are not solvable by simple lexical cues (c.f. Ettinger et al., 2018), thus better isolating effects of syntactic anomalies.

We train and test classifiers on our probing tasks, with sentence embeddings from the above encoders as input. The classifier structure is a multilayer perceptron (MLP) classifier with one hidden layer. 5

## 5 Anomaly Detection Results

Fig. 1 shows anomaly detection performance for the tested encoders. We can see first that for three of our four tasks-all reordering tasks-our BoW baseline performs perfectly at chance, verifying elimination of lexical biases. BoW on the AgreeShift task is just above chance, reflecting (expected) slight bias in morphological variations.

Comparing between tasks, we see that Verb-Ob yields highest overall performance while SubNObN yields the lowest. As mentioned above, a particularly informative comparison is between VerbOb and Mod-Noun , which both involve swapping sequentially adjacent content, but at different hier-

archical levels. We see that encoders consistently show stronger performance on Verb-Ob than ModNoun , suggesting that the broader hierarchical domain of Verb-Ob may indeed make anomalies more accessible for encoding. The only anomaly that affects a broader span of the sentence is SubN-ObN -but we see that this is instead one of the most challenging tasks. We suspect that this is attributable to the fact that, as described above, detecting this anomaly may require extra world knowledge and common sense, which certain encoders may have less access to. 6 It is not unexpected, then, that BERT and RoBERTa, with comparatively much larger and more diverse training data exposure, show a large margin of advantage on this challenging SubN-ObN task relative to the other encoders. Agree-Shift patterns roughly on par with Mod-Noun , though notably InferSent (and Skipthoughts) detects the agreement anomaly much more readily than it does the Mod-Noun anomaly.