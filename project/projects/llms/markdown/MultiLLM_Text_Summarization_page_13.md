# Page 13

## Page Information

- **Type**: figure_page
- **Word Count**: 334
- **Has Tables**: True
- **Has Figures**: False

## Content

# Page 13

## 4.2.1 Generation Phase

The first round of the conversational approach mirrors the single-round procedure (Section 4.1.1).

Each LLM M j generates an initial summary S (1) j from the original input text S using the prompt P :

S (1) j = M j ( P, S ) .

If the evaluation result from the previous round has a confidence score less than the threshold or, if the LLM fails to output a readable confidence score, the pipeline proceeds to the next round. For the second and subsequent rounds, we use the prompt P ( i ) , shown in Figure 3. LLMs in the second and subsequent rounds have access to both the text to be summarized and summaries from the previous round. Concretely, in round i > 1 :

S ( i ) j = M j ( P ( i ) , S ) .

The hope is that LLM is able to iteratively improve summarization based upon previous outputs from itself and other models.

## Visual Content

### Page Preview

![Page 13](/projects/llms/images/MultiLLM_Text_Summarization_page_13.png)

## Tables

### Table 1

|  | Generate a summary that enhances coherence
of the text in around 160 words. Output
the summary text only and nothing else.
[text] |
| --- | --- |

### Table 2

|  | Generate a summary that maximizes
precision related to the key facts of the
text in around 160 words. Output the
summary text only and nothing else.
[text] |
| --- | --- |
