# Page 9

## Page Information

- **Type**: main_content
- **Word Count**: 329
- **Has Tables**: False
- **Has Figures**: False

## Content

# Page 9

## 4.1 Single Round

In the simplest case, we prompt each LLM once, gather their summaries, and then perform a single

Table 1: Overview of Multi-LLM Summarization Framework (Sections 4-5).

| Multi-LLM Summarization Framework   | General Mechanism                                                   | Stage                    |
|-------------------------------------|---------------------------------------------------------------------|--------------------------|
| Single-Round (Sec. 4.1)             | Generation (§ 4.1.1) Evaluation (§ 4.1.2)                           | CENTRALIZED ( Sec. 4 )   |
| Single-Round (Sec. 4.1)             | Conversational (Sec. 4.2) Generation (§ 4.2.1) Evaluation (§ 4.2.2) | CENTRALIZED ( Sec. 4 )   |
| Single-Round (Sec. 5.1)             | Generation (§ 5.1.1) Evaluation (§ 5.1.2)                           | DECENTRALIZED ( Sec. 5 ) |
| Conversational (Sec. 5.2)           | Generation (§ 5.2.1) Evaluation (§ 5.2.2)                           | DECENTRALIZED ( Sec. 5 ) |

Figure 1: Centralized and Decentralized approaches using a 5-LLM example. Similar topologies can be applied to any (" k ") number of LLMs. In centralized interactions, all models communicate with a central model; in decentralized interactions, each model communicate with every other model and also itself.

<!-- image -->

evaluation step to select the best final summary. This is the initial process before we extend it to multiple rounds.

## Visual Content

### Page Preview

![Page 9](/projects/llms/images/MultiLLM_Text_Summarization_page_9.png)
