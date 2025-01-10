Page 25

<!-- image -->

Figure 21: The distribution of left: the hallucination points over the segments that the model has hallucination and right: the total hallucination points over all segments.

<!-- image -->

GB of memory. Inference requires about 15 GB of memory on a single GPU and takes approximately 1 hour for 100 data samples.

## B Complementary Results

## B.1 Example Responses Given Different Prompt Strategies On Trial Cases

## B.2 More results on GPT-4

Performance under different Range-F window size The evaluation metric range-F score evaluates the model's precision in detecting anomalies. Specifically, it questions how closely the model's predicted anomaly positions align with the actual anomaly positions. Figure 22 illustrates the variation of the F-score as the range-F window size changes across different benchmark datasets. Generally, enlarging the window size enhances the model's performance, with notable improvements observed in the YAHOO dataset. This suggests that, compared to other datasets, the model's predictions for anomaly positions in the YAHOO dataset are significantly closer to their actual locations.

Figure 22: Results with different Range-F window size.

<!-- image -->

More results in evaluation metrics The distribution over F-score and Range-F on the four benchmark datasets is shown in Figure 19. We further explore the precision and recall across various datasets. The outcomes are detailed in Table 8. Generally, we observe that recall exceeds precision,

Table 8: Precision and Recall on the four datasets by GPT4Table 9: Performance after filtering the hallucination segments.