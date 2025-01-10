Page 2

that these more recent models may in fact pick up on a generalized awareness of syntactic anomalies. Follow-up analyses support the possibility that these transformer-based models pick up on a legitimate, general notion of syntactic oddity-which appears to coexist with coarser-grained, anomalyspecific word order cues that also contribute to detection performance. We make all data and code available for further testing. 1

## 2 Related Work

This paper builds on work analyzing linguistic knowledge reflected in representations and outputs of NLP models (Tenney et al., 2019; Rogers et al., 2020; Jawahar et al., 2019). Some work uses tailored challenge sets associated with downstream tasks to test linguistic knowledge and robustness (Dasgupta et al., 2018; Poliak et al., 2018a,b; White et al., 2017; Belinkov et al., 2017b; Yang et al., 2015; Rajpurkar et al., 2016; Jia and Liang, 2017; Rajpurkar et al., 2018). Other work has used targeted classification-based probing to examine encoding of specific types of linguistic information in sentence embeddings more directly (Adi et al., 2016; Conneau et al., 2018; Belinkov et al., 2017a; Ettinger et al., 2016, 2018; Tenney et al., 2019; Klafka and Ettinger, 2020). We expand on this work by designing analyses to shed light on encoding of syntactic anomaly information in sentence embeddings.

A growing body of work has examined syntactic sensitivity in language model outputs (Chowdhury and Zamparelli, 2018; Futrell et al., 2019; Lakretz et al., 2019; Marvin and Linzen, 2018; Ettinger, 2020), and our Agree-Shift task takes inspiration from the popular number agreement task for language models (Linzen et al., 2016; Gulordava et al., 2018; Goldberg, 2019). Like this work, we focus on syntax in designing our tests, but we differ from this work in focusing on model representations rather than outputs, and in our specific focus on understanding how models encode information about anomalies. Furthermore, as we detail below, our Agree-Shift task differs importantly from the LM number agreement tests, and should not be compared directly to results from those tests.

Our work relates most closely to studies involving anomalous or erroneous sentence information (Warstadt et al., 2019; Yin et al., 2020; Hashemi

and Hwa, 2016). Some work investigates impacts from random shuffling or other types of distortion of input text (Pham et al., 2020; Gupta et al., 2021) or of model pre-training text (Sinha et al., 2021) on downstream tasks-but this work does not investigate models' encoding of these anomalies. Warstadt et al. (2019) present and test with the CoLA dataset for general acceptability detection, and among the probing tasks of Conneau et al. (2018) there are three that involve analyzing whether sentence embeddings can distinguish erroneous modification to sentence inputs: SOMO , BShift , and CoordInv . Yin et al. (2020) also generate synthetic errors based on errors from nonnative speakers, showing impacts of such errors on downstream tasks, and briefly probing error sensitivity. More recently, Li et al. (2021) conduct anomaly detection with various anomaly types at different layers of transformer models, using training of Gaussian models for density estimation, and finding different types of anomaly sensitivity at different layers. We build on this line of work in anomaly detection with a fine-grained exploration of models' detection of word-content-controlled perturbations at different levels of syntactic hierarchy. Our work is complementary also in exploring generality of models' anomaly encoding by examining transfer performance between anomalies.

## 3 Syntactic Anomaly Probing Tasks

To test the effects of hierarchical location of a syntactic anomaly, we create a set of tasks based on four different levels of sentence perturbation. We structure all perturbations so as to keep word content constant between original and perturbed sentences, thus removing any potential aid from purely lexical contrast cues. Our first three tasks involve reordering of syntactic constituents, and differ in hierarchical proximity of the reordered constituents: the first switches constituents of a noun phrase, the second switches constituents of a verb phrase, and the third switches constituents that only share the clause. Our fourth task tests sensitivity to perturbation of morphological number agreement, echoing existing work testing agreement in language models (Linzen et al., 2016).

## 3.1 Mod-Noun : Detecting modifier/noun reordering

Our first task tests sensitivity to anomalies in modifier-noun structure, generating anomalous sen-

tences by swapping the positions of nouns and their accompanying modifiers, as below:

A man wearing a yellow scarf rides a bike. → A man wearing a scarf yellow rides a bike.

We call this perturbation Mod-Noun . Any article determiner of the noun phrase remains unperturbed.