# Page 7

## Page Information

- **Type**: table_page
- **Word Count**: 310
- **Has Tables**: False
- **Has Figures**: False

## Content

# Page 7

## 3 Multi-LLM Summarization Framework

In this work, we propose a novel multi-LLM summarization framework that leverages multiple large language models to enhance summarization quality of long document input. Through the distribution of generation and evaluation of candidate summaries across multiple models, our framework aims to provide better summaries than single LLM methods, leveraging expertise from different models. We present two interaction topologies, centralized and decentralized , to guide the collaboration, evaluation, and refinement of summaries between LLMs. Visually these two methods can be represented at a high level in Figure 1. Our approach tackles long text document input, which can span to tens of thousands of words and as such usually exceeds the context window of most standard LLMs. To handle this, we establish a two stage process that involves chunking the source document, independently summarizing each chunk of the source document, and then applying a second round of chunking and summarization on the concatenated intermediate results. Throughout both these stages, both frameworks allow multiple LLMs to collaborate and converge on a single final high quality summary of the entire original reference document. Table 1 provides an overview of our framework's four main variations.

## Visual Content

### Page Preview

![Page 7](/projects/llms/images/MultiLLM_Text_Summarization_page_7.png)
