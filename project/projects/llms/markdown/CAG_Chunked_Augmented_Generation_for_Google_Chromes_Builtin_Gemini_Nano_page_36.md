# Page 36

## Page Information

- **Type**: main_content
- **Word Count**: 5
- **Has Tables**: False
- **Has Figures**: True

## Content

# Page 36

## 7.4 Large Articles Processing Performance

Analysis of large articles, characterized by 2 < CWQ ≤ 3 (49,153-73,728 characters), demonstrates distinct processing characteristics across approximately 65 samples. The results reveal the system's performance in managing content spanning multiple context windows while maintaining efficient compression and semantic coherence.

Compression analysis indicates exceptional efficiency across diverse content categories, with compression ratios consistently ranging between 85% and 95%. Technical and scientific content categories, including "Machine learning," "Quantum mechanics," and "Medical ethics," demonstrate particularly robust compression performance, maintaining ratios above 90%. The compression stability across varied content domains suggests effective pattern recognition and redundancy elimination even in complex technical narratives. Statistical analysis reveals minimal variance, with a standard deviation of 2.1% across all content categories.

ROUGE metric evaluation demonstrates sophisticated performance characteristics across the three measurement criteria. ROUGE-N scores exhibit significant fluctuation between 0.45 and 0.65, with consistent peaks occurring in structured technical content. This oscillation pattern suggests varying degrees of success in maintaining n-gram coherence across different content types. ROUGE-L measurements maintain a more stable profile, averaging 0.35 with variations between 0.25 and 0.45, indicating reliable preservation of the longest common subsequences. ROUGE-S scores demonstrate remarkable consistency, stabilizing around 0.1, suggesting effective skip-bigram capture despite the increased content volume.

The processing framework exhibits several noteworthy characteristics specific to large article handling:

- 1. Memory utilization scales efficiently, maintaining peak consumption below 35% of available browser resources.
- 2. Processing latency averages 5.2 seconds per article, with minimal variance across content categories.
- 3. Chunk reconciliation processes demonstrate 92% efficiency in maintaining semantic continuity across context window boundaries.
- 4. System stability remains robust with a 98.2% successful processing rate.

These findings indicate that CAG's architectural design effectively manages the complexity of large articles while maintaining both processing efficiency and output quality. The high compression ratios, coupled with stable ROUGE metrics, suggest successful handling of content spanning multiple context windows. The performance characteristics validate the scalability of the browser-based implementation for processing substantial content volumes.

Fig 11. Temporal analysis of compression ratios across large articles (2 < CWQ ≤ 3). The bar chart shows consistently high compression efficiency (85-95%) maintained across diverse content categories, with particular effectiveness in technical and scientific documentation.

<!-- image -->

Fig 12. ROUGE metric performance analysis for large articles spanning multiple context windows. The graph illustrates the relationship between content complexity and semantic preservation, with ROUGE-N scores fluctuating between 0.45-0.65 and maintaining coherence across extended content spans.

<!-- image -->

## Visual Content

### Page Preview

![Page 36](/projects/llms/images/CAG_Chunked_Augmented_Generation_for_Google_Chromes_Builtin_Gemini_Nano_page_36.png)

### Figures

![](/projects/llms/figures/CAG_Chunked_Augmented_Generation_for_Google_Chromes_Builtin_Gemini_Nano_page_36_figure_1.png)

