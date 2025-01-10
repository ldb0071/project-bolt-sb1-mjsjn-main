Page 4

DABL involves fine-tuning the open-source Llama 2-Chat 13B model (Touvron et al. 2023) to enhance its capability to detect semantic anomalies in business processes. To mitigate the expense associated with fine-tuning LLMs with a substantial parameter count, we leverage QLoRA (Dettmers et al. 2024) to reduce memory usage. QLoRA achieves this by back-propagating gradients into a frozen 4-bit quantized model while preserving the performance level attained during the full 16-bit fine-tuning process.

Weemploy the Adam optimizer (Kingma and Ba 2014) to fine-tune the LLMs for two epochs, setting the initial learning rate to 5 × 10 -5 with polynomial learning rate decay. The mini-batch size is set to 64. The fine-tuning is carried out on an NVIDIA A6000 GPU with 48 GB of memory.

## Experiments

## Experimental Setup

Datasets As mentioned in previous section, we allocate 1,000 process models for generating the test dataset D 1 . These models produce 14,387 normal traces, and we randomly simulate anomalies, resulting in 13,694 anomalous traces. In total, the test dataset D 1 comprises 28,081 traces.

From 143,137 process models used for generating the training dataset, we randomly select 1,000 process models to create the test dataset D 2 . These 1,000 process models produce 21,298 normal traces, and we randomly simulate anomalies, resulting in 19,627 anomalous traces. In total, the test dataset D 2 comprises 40,925 traces. Note that, although the normal traces within the test dataset D 2 are identical to those in the training dataset, the simulated anomalies are not.

In summary, the test dataset D 1 is used to evaluate the model's generalization ability, verifying if the model can detect anomalies of unseen processes. The test dataset D 2 aims to validate the model's performance on seen processes but unseen anomalies (i.e., learning of given processes).

Compared Methods Statistical-based and conformance checking methods can only be applied to datasets containing traces from a single process. However, our test datasets include traces from 1000 processes where no two traces are identical (i.e., traces with identical orders of activities are executed). Therefore, these methods cannot be compared.

Table 1: Semantic anomaly detection results on dataset D 1 . The best results are indicated using bold typeface.Table 2: Semantic anomaly detection results on dataset D 2 . The best results are indicated using bold typeface.

|            |   Prec.(%) |   Rec.(%) |   F 1 (%) |   Acc.(%) |
|------------|------------|-----------|-----------|-----------|
| SEM        |      48.67 |     46.8  |     47.72 |     50.81 |
| SENSE-SVM  |      87.95 |      1.12 |      2.2  |     52.5  |
| SENSE-BERT |      48.17 |     97.74 |     64.53 |     48.47 |
| DBAL       |      94.06 |     89.79 |     91.88 |     92.39 |

|            |   Prec.(%) |   Rec.(%) |   F 1 (%) |   Acc.(%) |
|------------|------------|-----------|-----------|-----------|
| SEM        |      71.91 |     48.63 |     58.02 |     66.75 |
| SENSE-SVM  |      90.28 |     28.64 |     43.49 |     64.82 |
| SENSE-BERT |      93.16 |     62.88 |     75.08 |     80.28 |
| DBAL       |      98.12 |     95.64 |     96.87 |     97.03 |

In our evaluation, we compare our DABL to existing semantic business process anomaly detection methods: SENSE (Caspary, Rebmann, and van der Aa 2023) and SEM (van der Aa, Rebmann, and Leopold 2021). SENSE offers both SVM-based and BERT-based models for detecting anomalous event pairs, which we denote as SENSESVM and SENSE-BERT, respectively. These methods divide traces into event pairs and determine whether each pair is normal or anomalous. If at least one event pair in a trace is identified as anomalous, the entire trace is classified as anomalous. It is important to note that SEM can only detect anomalous event pairs that share the same business object, automatically classifying pairs with distinct business objects as non-anomalous. Due to the high training costs, we utilize the open-source trained models provided by the authors for the test dataset D 1 . For the test dataset D 2 , we train the comparative models using the 21,298 normal traces available within it. The hyper-parameters of these methods are set to the values that yielded the best results reported in the original paper.

Evaluation Metrics Following existing anomaly detection methods, we employ precision , recall , F 1 -score and accuracy to evaluate the anomaly detection performance.

The recall-oriented understudy for gisting evaluation (ROUGE) (Lin 2004) is a software package and metric set designed to assess the quality of generated text by comparing it with ground truth text. In our evaluation of DABL's ability to interpret the cause of anomalies, we utilize ROUGE-2 and ROUGE-L metrics.

## Quantitative Results

Anomaly Detection To evaluate the model's generalization ability , we conduct experiments on the test dataset D 1 . The results are shown in Table 1, with the best outcomes highlighted in bold. Our DBAL achieves the highest precision, F 1 -score, and accuracy, with both the F 1 -score and accuracy exceeding 90%. Although SENSE-BERT attains the best recall, it has the lowest precision and accuracy. Compared to other methods, DBAL maintains a balanced

Table 3: The results of DABL in interpreting the causes of anomalies.

| Dataset   | ROUGE-2(%)   | ROUGE-2(%)   | ROUGE-2(%)   | ROUGE-L(%)   | ROUGE-L(%)   | ROUGE-L(%)   |
|-----------|--------------|--------------|--------------|--------------|--------------|--------------|
|           | Prec.        | Rec.         | F 1          | Prec.        | Rec.         | F 1          |
| D 1       | 74.48        | 74.49        | 74.32        | 76.29        | 76.11        | 76.02        |
| D 2       | 84.92        | 84.61        | 84.54        | 86.96        | 86.66        | 86.56        |

precision and recall. SENSE-SVM exhibits limited sensitivity to anomalies, potentially overlooking many anomalies, thereby achieving high precision but markedly low recall. Conversely, SENSE-BERT demonstrates excessive sensitivity, resulting in numerous false alarms, thus yielding low precision but high recall. These results demonstrate that DBAL possesses a superior generalization ability for detecting anomalies in unseen processes.

We conduct experiments on dataset D 2 to evaluate if the methods can learn the given processes . The results are presented in Table 2. Compared to the experiments on dataset D 1 , the precision of each method increases. This improvement is due to the incorporation of normal process behavior in the training dataset, thereby reducing false alarms. Consequently, the F 1 -score and accuracy also show significant improvements. Our DABL method stands out, achieving the best performance across all metrics, with the F 1 -score and accuracy showing improvements of 21.79% and 16.75%, respectively, over the best existing semantic-based anomaly detection method (i.e., SENSE-BERT). These results demonstrate that DABL can learn the given processes effectively, allowing users to further fine-tune DABL on their own processes to obtain a customized model.

Interpretation of the Cause of Anomalies Table 3 shows the results of DABL in interpreting the causes of anomalies. On dataset D 1 , both ROUGE-2 and ROUGE-L scores are relatively high, indicating that DABL performs well in identifying the causes of anomalies, even for processes not included in the training data. For dataset D 2 , DABL exhibits better performance because the normal behaviors of the processes are well-represented in the training data. Furthermore, the slight difference between recall and precision suggests that the model maintains a good balance. These results demonstrate that DABL is effective at interpreting the causes of anomalies in terms of both bigrams and longest common subsequences.