# Page 34

## Page Information

- **Type**: main_content
- **Word Count**: 39
- **Has Tables**: False
- **Has Figures**: True

## Content

# Page 34

## 7.2 Small Article Processing Performance

Analysis of the processing performance for small articles, characterized by Context Window Length Quotient (CWQ) ≤ 1 (under 24,576 characters), reveals distinct patterns in compression efficiency and quality metrics. The evaluation encompasses approximately 87 samples, providing comprehensive insights into CAG's performance within Chrome's single context window constraints. The compression analysis demonstrates consistent efficiency patterns across varied content categories. Experimental data indicates compression ratios predominantly ranging between 60% and 80%, with a median efficiency of 70%. Technical content categories exhibit superior compression characteristics, achieving mean ratios of 75%, while narrative content maintains acceptable efficiency at 65%. Statistical analysis reveals notable outliers in specialized domains, where compression ratios deviate significantly from the mean, ranging from sub-50% to over 80% efficiency.

Fig 7. ROUGE metric performance comparison across content categories for small articles (CWQ ≤ 1). The graph shows ROUGE-N (blue), ROUGE-L (pink), and ROUGE-S (green) scores, demonstrating consistent semantic preservation with ROUGE-N values averaging 0.12 and notable peaks in technical content categories.

<!-- image -->

Quality assessment through ROUGE metrics demonstrates robust performance across all evaluation criteria. ROUGE-N analysis yields a mean score of 0.12, indicating strong preservation of sequential text elements. The ROUGE-L metric, averaging 0.08, confirms effective maintenance of the longest common subsequences. Skip-bigram capture, measured through ROUGE-S, maintains a consistent 0.05 average, validating the system's semantic coherence preservation. Notable performance peaks emerge in structured technical content, where ROUGE-N measurements reach 0.35, suggesting particular efficacy in handling well-structured technical documentation. Performance metrics within Chrome's Gemini Nano implementation demonstrate optimal resource utilization. Processing latency maintains sub-2-second averages per article, while browser memory consumption remains within 15% of available resources. The architecture's efficiency is further evidenced by zero chunk reconciliation overhead and complete processing success rates across the small article dataset.

Fig 8. Distribution of compression ratios by content type for small articles (CWQ ≤ 1). Bar chart shows compression ratios ranging from 60-80%, with technical content achieving higher efficiency (70-75%) compared to narrative content (65%), illustrating CAG's content-adaptive compression capabilities.

<!-- image -->

These experimental results validate CAG's effectiveness in processing content within the base context window size. The consistent performance across both compression and quality metrics demonstrates the architecture's capability to efficiently leverage Chrome's Gemini Nano implementation while maintaining semantic integrity. This performance profile particularly suits real-time browser-based applications where processing efficiency and output quality are paramount considerations.

## Visual Content

### Page Preview

![Page 34](/projects/llms/images/CAG_Chunked_Augmented_Generation_for_Google_Chromes_Builtin_Gemini_Nano_page_34.png)

### Figures

![](/projects/llms/figures/CAG_Chunked_Augmented_Generation_for_Google_Chromes_Builtin_Gemini_Nano_page_34_figure_1.png)

