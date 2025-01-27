# Page 10

## Page Information

- **Type**: main_content
- **Word Count**: 305
- **Has Tables**: False
- **Has Figures**: False

## Content

# Page 10

## 4.1.1 Generation Phase

In the single-round setting, each LLM from the list of participating models M = { M 1 , . . . , M k } independently generates a summary of the same input text using a common prompt P . The prompt P is illustrated in Figure 2. Formally, for each LLM M j ∈ M , the output is

S j = M j ( P, S )

where S represents the input text. Running this step for all M j yields a set of summaries S = { S 1 , . . . , S k } .

This initial generation stage corresponds to lines 3-5 of Algorithm 1. Conceptually, each model contributes its unique perspective, leading to a diverse pool of candidate summaries, which is important for robust summary selection in the following evaluation phase.

## Visual Content

### Page Preview

![Page 10](/projects/llms/images/MultiLLM_Text_Summarization_page_10.png)
