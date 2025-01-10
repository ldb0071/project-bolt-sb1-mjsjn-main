Page 7

goods, Contact container port, Contact airlines, Prepare delivery note]. Is this trace norma

anomal

As an AI, I don't have the exact context or knowledge of the specific rules of the business process.

Without additional context or a definition of what is considered normal in this specific process, we

What makes this trace a

tifies 562 anomalous variants. These detected anomalies reveal some interesting irregularity patterns illustrated in Table 4. These irregularity patterns include: trips starting before a permit is properly handled (A1), approved (A2), or even rejected (A3); the declaration being finally approved by a supervisor and payment handled despite the permit being rejected (A4); and requests for payment being approved before the permit is approved (A5).

Road Traffic Fine Management We apply our DABL on another real-world event log from an information system managing road traffic fines (de Leoni and Mannhardt 2015), which captures the road traffic fine management process. The process flow involves the creation of a fine, appeal to the prefecture, addition of penalties, and fine payment.

This log contains 150,370 traces with 231 variants. DABL identifies 56 anomalous variants. These detected anomalies

reveal some interesting irregularity patterns as detailed in Table 5. The examples illustrate irregularity patterns where the fine is repeatedly paid (A1), the fine is paid before the penalty is added (A2), and the result appeal from the prefecture is received before the appeal is sent to the prefecture (A3).

## Conclusion

In this paper, we introduce DABL, a novel semantic business process anomaly detection model leveraging LLMs. Trained on 143,137 real-world process models from various domains, DABL excels at zero-shot detection of semantic anomalies and interprets their causes in natural language. Extensive experiments demonstrate DABL's generalization ability, allowing users to detect anomalies in their own datasets without additional training.

## Acknowledgments

This work is supported by China National Science Foundation (Granted No. 62072301).

## References

Aalst, W. v. d.; Buijs, J.; and Dongen, B. v. 2011. Towards improving the representational bias of process mining. In International Symposium on Data-Driven Process Discovery and Analysis , 39-54. Springer.

Achiam, J.; Adler, S.; Agarwal, S.; Ahmad, L.; Akkaya, I.; Aleman, F. L.; Almeida, D.; Altenschmidt, J.; Altman, S.; Anadkat, S.; et al. 2023. Gpt-4 technical report. arXiv preprint arXiv:2303.08774 .

Caspary, J.; Rebmann, A.; and van der Aa, H. 2023. Does this make sense? machine learning-based detection of semantic anomalies in business processes. In International Conference on Business Process Management , 163-179. Springer.

Chinosi, M.; and Trombetta, A. 2012. BPMN: An introduction to the standard. Computer Standards & Interfaces , 34(1): 124-134.

Chklovski, T.; and Pantel, P. 2004. Verbocean: Mining the web for fine-grained semantic verb relations. In Proceedings of the 2004 Conference on Empirical Methods in Natural Language Processing , 33-40.

De Koninck, P.; vanden Broucke, S.; and De Weerdt, J. 2018. act2vec, trace2vec, log2vec, and model2vec: Representation Learning for Business Processes. In Weske, M.; Montali, M.; Weber, I.; and vom Brocke, J., eds., Business Process Management , 305-321. Cham: Springer International Publishing. ISBN 978-3-319-98648-7.

de Leoni, M. M.; and Mannhardt, F. 2015. Road Traffic Fine Management Process.