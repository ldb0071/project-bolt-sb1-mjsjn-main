Page 2

Conformance Checking-based Methods The conformance checking-based approaches (Ebrahim and Golpayegani 2022; Sarno, Sinaga, and Sungkono 2020; Sinaga and Sarno 2016) utilize process models, which are either provided by the user or derived from logs using process mining techniques. Anomalies are detected through conformance checking techniques (Leemans, Fahland, and van der Aalst 2018), which assess the alignment between traces and the corresponding process model. When the trace deviates from the process model, it is considered anomalous.

The performance of these methods heavily depends on the quality of the process model. Additionally, complex processes are difficult to accurately represent with a process model, limiting the applicability of these methods.

Semantic-based Methods The semantic-based methods detect anomalies through natural language analysis, aim-

ing to detect process behaviors that deviate from a semantic point of view.

Van der Aa et al. (van der Aa, Rebmann, and Leopold 2021) fine-tune BERT (Devlin et al. 2018), a pre-trained language model, to parse the names of executed activities by extracting the action and business object. Then, a knowledge base capturing assertions about the interrelations that should hold among actions parsed from names of executed activities is applied. The knowledge is extracted either from VerbOcean (Chklovski and Pantel 2004) or from an abstract representation of the process model. Anomalies can be detected by checking if the recorded process behavior violates the assertions captured in the knowledge base.

Caspary et al. (Caspary, Rebmann, and van der Aa 2023) extract event pairs that are in an eventually-follow relation. To detect anomalous event pairs, they propose two approaches: an SVM-based approach and a BERT-based approach. The SVM-based approach transforms an event pair into a vector representation using GloVe embeddings. This vector is then fed into a trained SVM, which classifies whether the event pair is an anomaly. The BERT-based approach extends BERT with an additional output layer for two-class classification, determining whether an input event pair is anomalous or not. Both the SVM and the extended BERT model are trained using normal event pairs extracted from normal traces, along with anomalous event pairs simulated by randomly generating event pairs that are not normal.

However, existing semantic-based methods treat a trace as multiple event pairs, which disrupts long-distance dependencies. Additionally, these methods only identify anomalous event pairs to interpret the causes of anomalies, making them difficult to understand. In contrast, our DABL incorporates the entire trace into a novel prompt, allowing the LLMs to automatically capture long-distance dependencies. DABL also provides insightful interpretations of the causes of anomalies in natural language, making them easy to understand.

## Large Language Models for Anomaly Detection

Motivated by the impressive cognitive abilities exhibited by large language models (LLMs) (Ouyang et al. 2022; Zeng et al. 2022; Achiam et al. 2023; Touvron et al. 2023), researchers have begun investigating their application for anomaly detection.

AnomalyGPT (Gu et al. 2024) and Myriad (Li et al. 2023) incorporate novel image encoders with LLMs for industrial anomaly detection (IAD). Elhafsi et al. (Elhafsi et al. 2023) apply an LLM to analyze potential confusion among observed objects in a scene, which could lead to taskrelevant errors in policy implementation. LLMAD (Liu et al. 2024) leverages LLMs for few-shot anomaly detection by retrieving and utilizing both positive and negative similar time series segments. In (Qi et al. 2023) and (Egersdoerfer, Zhang, and Dai 2023), authors devise effective prompts to apply LLMs for zero/few-shot system log anomaly detection. SheepDog (Wu and Hooi 2023) conducts fake news detection by preprocessing data using LLMs to reframe the news, customizing each article to match different writing styles. Sarda et al. (Sarda et al. 2023) propose a pipeline for

automatic microservice anomaly detection and remediation based on LLMs.

Yet, the application of LLMs for business process anomaly detection remains unexplored.

## Method

DABL is a novel conversational fine-tuned large language model, primarily designed to detect semantic anomalies in business processes and interpret their causes. Fig. 2 details the DABL training procedure, which consists mainly of dataset preparation and fine-tuning. DABL is implemented in Python, and the source code is accessible at https://github.com/guanwei49/DABL.

## Dataset Preparation

To effectively fine-tune LLMs for developing a generic model capable of detecting semantic anomalies in business processes, a log meeting the following criteria is imperative: i) it must encompass both normal and anomalous traces, ii) it should contain rich semantic information (i.e., the activities should not be represented by meaningless characters), and iii) the traces within it should stem from diverse processes across various domains. Since such a log is not available in the real world, we generate normal traces by playout of the real-world process models from the BPM Academic Initiative (BPMAI) (Weske et al. 2020), fundamentals of business process management (FBPM) (Dumas et al. 2018), and SAP signavio academic models (SAP-SAM) (Sola et al. 2022). These process models cover a broad range of domains, including common processes related to order and request handling, as well as specialized processes from fields such as software engineering and healthcare. We then generate synthetic anomalies from these normal traces. We detail the dataset preparation in the following subsection.

Generation of Normal Traces We select process models M from BPMAI, FBPM, and SAP-SAM that meet the following criteria: they are in BPMN notation (Chinosi and Trombetta 2012), described in English, and convertible into a sound workflow net. This results in a total set of 144,137 process models. Among these, 143,137 process models are used for generating training datasets, resulting in 1,574,381 normal traces, while the remaining 1,000 process models are used for generating test datasets.

Next, for each process model m ∈ M , we perform a playout to obtain the set of normal traces, denoted as L m . These traces are allowed by the process model m . To prevent infinite trace lengths, we limit each loop in the process model m to be executed a maximum of twice.

Anomaly Simulation Normal traces can be converted into anomalous ones by disrupting the order of executed activities (ordering anomalies) or by sequencing exclusive activities (exclusion anomalies).

Ordering anomalies : Ordering anomalies arise when activities ought to be executed in a different sequence. Five types of ordering anomalies, as identified in (Nolle et al. 2022), are frequently encountered in real-world business

Figure 2: Detecting semantic anomalies in business processes using large language models.