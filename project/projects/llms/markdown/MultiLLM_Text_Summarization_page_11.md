# Page 11

## Page Information

- **Type**: figure_page
- **Word Count**: 357
- **Has Tables**: False
- **Has Figures**: False

## Content

# Page 11

## 4.1.2 Evaluation Phase

After collecting the set of candidate summaries S , we select a central agent C ∈ M to evaluate these summaries. The central LLM C uses an evaluation prompt P ec , as shown in Figure 5, to assess the quality of each summary. To reduce potential bias arising from authorship attribution, we use anonymized identifiers for summaries like agent\_1 , agent\_2 , etc. during evaluation.

Formally, we obtain E = C ( P ec , S ) , where E is the central LLM's evaluation of all candidate summaries. This includes the choice for the best summary (expressed as its anonymized identifier) and a confidence score for that evaluation (expressed as an integer from 0 to 10), denoted together as r = AGGRRESULTS ( E ) in Algorithm 1. We deanonymize the identifier to recover the text of the selected summary S j and set this as our final output S ∗ . In the single-round regime, this terminates the process as no further iterations are performed.

In the evaluation prompt, we include the prompt to output a confidence score so there is a variable on which to impose a stopping condition. This allows us to extend the centralized process to multiple rounds of generation and evaluation using that condition. This process is explained in subsequent sections.

## Visual Content

### Page Preview

![Page 11](/projects/llms/images/MultiLLM_Text_Summarization_page_11.png)
