# Page 5

## Page Information

- **Type**: figure_page
- **Word Count**: 485
- **Has Tables**: True
- **Has Figures**: False

## Content

# Page 5

## 2.1 Summarization

Recent advancements in summarization have increasingly leveraged large language models (LLMs), moving beyond fine-tuned transformer models like Pegasus, BART, and T5. Studies consistently show that LLMs can generate summaries with higher coherence, relevance, and factual accuracy, often rivaling or surpassing human-written summaries (Goyal et al., 2023; Zhang et al., 2023; Pu et al., 2023b).

For example, Goyal et al. (2023) demonstrated that GPT-3 (text-davinci-002) produced summaries preferred by human evaluators over fine-tuned models like Pegasus and BRIO on structured datasets such as CNN/DM (Nallapati et al., 2016) and XSUM (Narayan et al., 2018). Similarly, Zhang et al. (2023) emphasized the importance of instruc-

tion tuning in achieving superior zero-shot performance for summarization tasks. Pu et al. (2023b) further highlighted improved factual consistency and reduced hallucinations when using LLMs.

While these studies validate the potential of LLMs in summarizing well-structured and relatively short texts, they fail to address the unique challenges of long-document summarization, where inputs lack clear structural cues and exhibit greater complexity. Research focusing on long-text summarization, such as Keswani et al. (2024), employed semantic clustering and multistage summarization with LLaMA2 to manage lengthy inputs. However, such approaches often rely on predefined hierarchical processing strategies that may oversimplify the nuanced relationships within the text. Moreover, as Liu et al. (2023) noted, LLMs tend to neglect content from the middle sections of long documents, resulting in incomplete or unbalanced summaries.

These limitations point to the need for a novel approach capable of addressing the inherent challenges of long-document summarization. Our work builds upon this foundation by proposing a multiLLM framework designed to overcome these shortcomings through information exchange and collaborative synthesis, which can better capture the diversity and complexity of long texts.

## Visual Content

### Page Preview

![Page 5](/projects/llms/images/MultiLLM_Text_Summarization_page_5.png)

## Tables

### Table 1

|  | Given the original text below, along with
the summaries of that text by [k] agents,
please evaluate the summaries and output
the name of the agent that has the best
summary. Output the exact name only and
nothing else.
ORIGINAL:
[chunk or concatenated chunk summaries S]
Summary by agent_1:
[LLM 1’s summary]
.
.
.
Summary by agent_k:
[LLM k’s summary] |
| --- | --- |

### Table 2

|  | Provide a concise summary of the text in
around 160 words. Output the summary text
only and nothing else.
[concatenated chunk summaries S] |
| --- | --- |

### Table 3

|  | Given the initial text below, along with
the summaries of that text by [k] LLMs,
please evaluate the generated summaries
and output the name of the LLM has the
best summary. On a separate line indicate
a confidence level between 0 and 10.
ORIGINAL:
[text]
Summary by M :
1
[LLM 1’s summary]
.
.
.
Summary by M :
k
[LLM k’s summary]
Remember, on a separate line indicate a
confidence level between 0 and 10 |
| --- | --- |
