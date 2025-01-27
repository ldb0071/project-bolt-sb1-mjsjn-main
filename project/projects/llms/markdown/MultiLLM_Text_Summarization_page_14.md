# Page 14

## Page Information

- **Type**: figure_page
- **Word Count**: 406
- **Has Tables**: False
- **Has Figures**: False

## Content

# Page 14

## 4.2.2 Evaluation Phase

The evaluation phase in round i > 1 is conceptually similar to the single-round setting (Section 4.1.2), but now operates on candidate summaries generated immediately before in the generation phase S i = { S ( i ) 1 , . . . , S ( i ) k } . The central LLM C evaluates these candidates using P ec :

E ( i ) = C ( P ec , S i ) ,

If the confidence level meets the threshold, the process terminates, and the summary chosen by the central LLM is accepted as S ∗ . Otherwise, we proceed to the next round of summary generation and evaluation. For the confidence scores we have chosen the range 0-10 as it is fine-grained but also is one of the most common rating scales.

## Visual Content

### Page Preview

![Page 14](/projects/llms/images/MultiLLM_Text_Summarization_page_14.png)
