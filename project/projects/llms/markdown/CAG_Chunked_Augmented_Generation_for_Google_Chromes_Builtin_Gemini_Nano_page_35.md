# Page 35

## Page Information

- **Type**: main_content
- **Word Count**: 4
- **Has Tables**: False
- **Has Figures**: True

## Content

# Page 35

## 7.3 Medium Articles Processing Performance

Analysis of the processing performance for medium articles, characterized by Context Window Length Quotient (CWQ) between 1 and 2 (24,577-49,152 characters), demonstrates CAG's effectiveness in handling content requiring dual context windows.

The evaluation encompasses approximately 140 samples, representing the largest category in our dataset, providing comprehensive insights into CAG's performance with content exceeding Chrome's base context window constraints. The compression analysis reveals robust efficiency patterns across varied content

domains. Experimental data indicates compression ratios predominantly ranging between 70% and 93%, with a median efficiency of 82.5%.

Technical content categories exhibit superior compression characteristics, achieving mean ratios of 87.3%, while narrative content maintains strong efficiency at 80%. Statistical analysis reveals consistent performance across specialized domains, where compression ratios maintain stability around the mean, with technical documentation achieving peak ratios of 93%.

Fig 9. ROUGE metric analysis for medium-length articles (1 < CWQ ≤ 2). Time series plot demonstrates sustained semantic coherence across dual context windows with ROUGE-N scores averaging 0.76, ROUGE-L at 0.48, and ROUGE-S maintaining 0.19, indicating robust performance in multi-window processing.

<!-- image -->

Quality assessment through ROUGE metrics demonstrates strong performance across all evaluation criteria. ROUGE-N analysis yields a mean score of 0.76, indicating exceptional preservation of sequential text elements across chunk boundaries. The ROUGE-L metric, averaging 0.48, confirms effective maintenance of the longest common subsequences despite the dual-window processing requirement. Skip-bigram capture, measured through ROUGE-S, maintains a consistent 0.19 average, validating the system's semantic coherence preservation across chunk boundaries. Notable performance peaks emerge in

technical content, where ROUGE-N measurements reach 0.89, suggesting particular efficacy in handling well-structured documentation spanning multiple context windows.

Performance metrics within Chrome's Gemini Nano implementation demonstrate efficient resource utilization. Processing latency maintains 3.8-second averages per article, while browser memory consumption remains within 22% of available resources. The architecture's efficiency is further evidenced by minimal chunk reconciliation overhead (185ms) and 99.3% processing success rates across the medium article dataset.

Fig 10. Compression ratio distribution for medium-length content categorized by subject matter. The visualization demonstrates consistent compression performance between 70-95%, with technical documentation achieving optimal ratios above 90%, validating CAG's effectiveness for dual-window content processing.

<!-- image -->

These experimental results validate CAG's effectiveness in processing content spanning multiple context windows. The robust performance across both compression and quality metrics demonstrates the architecture's capability to efficiently manage chunk boundaries while maintaining semantic integrity. This performance profile particularly suits complex browser-based applications where consistent processing of longer content is essential for maintaining user experience quality.

## Visual Content

### Page Preview

![Page 35](/projects/llms/images/CAG_Chunked_Augmented_Generation_for_Google_Chromes_Builtin_Gemini_Nano_page_35.png)

### Figures

![](/projects/llms/figures/CAG_Chunked_Augmented_Generation_for_Google_Chromes_Builtin_Gemini_Nano_page_35_figure_1.png)

