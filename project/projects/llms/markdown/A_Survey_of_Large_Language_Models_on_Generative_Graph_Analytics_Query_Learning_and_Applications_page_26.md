# Page 26

## Page Information

- **Type**: table_page
- **Word Count**: 732
- **Has Tables**: False
- **Has Figures**: False

## Content

# Page 26

## C. Comparisons and Discussions

For addressing graph learning tasks, existing methods [30] [79] [82] categorize based on the role of LLM into three types: LLMs act as enhancers (LLM-GNN pipelines), LLMs act as predictors (LLM pipelines), and graph prompts. In the part of graph prompts, we introduce the prompting engineering in GNNs without utilizing LLMs. Graph prompts aim to unify downstream tasks and construct a universal framework. Therefore, it is compared with LLM-GNN pipelines and LLM pipelines to provide a comprehensive overview.

When LLMs act as enhancers, the most popular pipeline is the LLM-GNN pipeline. There are three categories of LLMGNN pipelines, depending on how LLM enhances GNN: encoding the graph into embeddings, generating graph pseudo labels, and providing external knowledge/explanations. However, the LLM-GNN pipelines that are currently available are not end-to-end pipelines, meaning that LLM and GNN cannot be trained together. LLM and GNN can be trained separately using frameworks like EM framework [31] or by freezing LLM and using it as an external knowledge base. Co-training LLM and GNN can lead to issues like gradient vanishing, which is a significant obstacle in current LLM-GNN pipelines due to the large number of parameters in LLM compared to GNN. To solve this problem, methods like knowledge distillation can reduce the number of LLM parameters while retaining the beneficial capabilities for downstream tasks.

When LLMs act as predictors, two main methods are used: prompting LLMs and SFT LLMs. All approaches for fine-tuning LLMs can be reviewed in the 'comparisons and discussions' section of Section III. Currently, SFT and DPO are popular methods for fine-tuning LLMs.

For graph prompt, the workflow involves unifying pretraining and downstream tasks, followed by prompt tuning for different downstream tasks through prompt engineering, as shown in Figure 15. Graph prompts require fewer tunable

(a)

<!-- image -->

Sort the following list of numbers in ascending order. Output only the sorted list of numbers, no additional text. Input: [5, 1, 0, 1, 2, 0, 4, 8, 1, 9, 5, 1, 3, 3, 9, 7] Output: [0, 0, 1, 1, 1, 1, 2, 3, 3, 4, 5, 5, 7, 8, 9, 9]

Find the intersection of two sets of numbers. Output only the set of numbers that are present in both sets, no additional text. Input Set 1: [13, 16, 30, 6, 21, 7, 31, 15, 11, 1, 24, 10, 9, 3, 20, 8] Input Set 2: [25, 24, 10, 4, 27, 0, 14, 12, 8, 2, 29, 20, 17, 19, 26, 23]

## Visual Content

### Page Preview

![Page 26](/projects/llms/images/A_Survey_of_Large_Language_Models_on_Generative_Graph_Analytics_Query_Learning_and_Applications_page_26.png)
