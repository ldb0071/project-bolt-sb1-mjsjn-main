Page 1

## Variation and generality in encoding of syntactic anomaly information in sentence embeddings

## Qinxuan Wu ∗

College of Computer Science and Technology Zhejiang University

wuqinxuan@zju.edu.cn

## Abstract

While sentence anomalies have been applied periodically for testing in NLP, we have yet to establish a picture of the precise status of anomaly information in representations from NLP models. In this paper we aim to fill two primary gaps, focusing on the domain of syntactic anomalies. First, we explore finegrained differences in anomaly encoding by designing probing tasks that vary the hierarchical level at which anomalies occur in a sentence. Second, we test not only models' ability to detect a given anomaly, but also the generality of the detected anomaly signal, by examining transfer between distinct anomaly types. Results suggest that all models encode some information supporting anomaly detection, but detection performance varies between anomalies, and only representations from more recent transformer models show signs of generalized knowledge of anomalies. Follow-up analyses support the notion that these models pick up on a legitimate, general notion of sentence oddity, while coarser-grained word position information is likely also a contributor to the observed anomaly detection.

## 1 Introduction

As the NLP community works to understand what is being learned and represented by current models, a notion that has made sporadic appearances is that of linguistic anomaly. Analyses of language models have often tested whether models prefer grammatical over ungrammatical completions (e.g. Linzen et al., 2016), while analyses of sentence embeddings have probed for syntax and semantics by testing detection of sentence perturbations (Conneau et al., 2018). Such work tends to exploit anomaly detection as a means of studying linguistic phenomena, setting aside any direct questions about encoding of anomaly per se. However, models' treatment of anomaly is itself a topic that raises

## Allyson Ettinger

Department of Linguistics The University of Chicago aettinger@uchicago.edu

important questions. After all, it is not obvious that we should expect models to encode information like 'this sentence contains an anomaly', nor is it obvious which types of anomalies we might expect models to pick up on more or less easily. Nonetheless, anomalies are easy to detect for humans, and their detection is relevant for applications such as automatic error correction (Ge et al., 2018), so it is of value to understand how anomalies operate in our models, and what impacts anomaly encoding.

In the present work we seek to fill this gap with a direct examination of anomaly encoding in sentence embeddings. We begin with fine-grained testing of the impact of anomaly type, designing probing tasks with anomalies at different levels of syntactic hierarchy to examine whether model representations better support detection of certain types of anomaly. Then we examine the generality of anomaly encoding by testing transfer performance between distinct anomalies-here our question is, to the extent that we see successful anomaly detection, does this reflect encoding of a more general signal indicating 'this sentence contains an anomaly', or does it reflect encoding of simpler cues specific to a given anomaly? We focus on syntactic anomalies because the hierarchy of sentence structure is conducive to our fine-grained anomaly variation. (Sensitivity to syntactic anomalies has also been studied extensively as part of the human language capacity (Chomsky, 1957; Fodor et al., 1996), strengthening precedent for prioritizing it.)

We apply these tests to six prominent sentence encoders. We find that most models support nontrivial anomaly detection, though there is substantial variation between encoders. We also observe differences between hierarchical classes of anomaly for some encoders. When we test for transferability of the anomaly signal, we find that for most encoders the observed anomaly detection shows little sign of generality-however, transfer performance in BERT and RoBERTa suggests