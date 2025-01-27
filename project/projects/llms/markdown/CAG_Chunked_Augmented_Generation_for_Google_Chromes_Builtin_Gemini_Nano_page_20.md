# Page 20

## Page Information

- **Type**: table_page
- **Word Count**: 134
- **Has Tables**: False
- **Has Figures**: True

## Content

# Page 20

## 6.2 Dataset Characteristics

We introduce the Context Window Length Quotient (CWQ), a standardized metric for categorizing and analyzing content length about model context windows. The CWQ is defined as:

CWQ=L/ (T × C)

where:

- ● L is the content length in characters
- ● T is the base token window size (6,144 tokens)
- ● C is the character-to-token ratio (≈ 4 characters/token)

This yields a dimensionless quotient that can be used to categorize content:

- ● CWQ≤1: Small content (single context window)
- ● 1 < CWQ ≤ 2: Medium content (dual context window)
- ● 2 < CWQ ≤ 3: Large content (triple context window)
- ● 3 < CWQ ≤ 4: Extra large content (quadruple context window)
- ● CWQ>4: Humongous content (multiple context windows)

```
await ai. languageModel. create( ) AILanguageModel {maxTokens: 6144, tokensSoFar: 0, tokensLeft: 6144, topK: 3 , temperature: 1, i maxTokens: 6144 oncontextoverflow: null temperature: tokensLeft: 6144 tokensSoFar: topK: [ [Prototype]]: AILanguageModel
```

Fig 3. The image shows an AI language model configured with a token limit of 6,144 tokens, where both maxTokens and tokensLeft are set to 6,144, and tokensSoFar is 0, indicating no tokens have been used yet.

The choice of 6,144 tokens aligns with Gemini Nano's context window, optimizing for both edge device compatibility and efficient processing while providing adequate context for most text analysis tasks. Using this metric, we analyzed article length distribution with a baseline context window of 24,576 characters (6,144 tokens × 4 characters/token). This established our fundamental processing unit and informed our categorization strategy. The histogram analysis reveals a right-skewed distribution of article lengths, with the majority of content falling within the CWQ ranges of 0-2 (small to medium categories). The granular frequency distribution shows multiple local maxima, particularly in the 0.8-1.6 CWQ range (20,000-40,000 characters), suggesting common natural break points in content length.

Dataset Characteristics Summary:

- ● Total Articles: 381
- ● Average Article Length: 45,672 characters
- ● Median CWQ: 1.86
- ● Standard Deviation of CWQ: 0.73
- ● Reading Level Range: 45.3 - 72.8 (Flesch-Kincaid)

Fig 4. The histogram analysis reveals a right-skewed distribution of article lengths, with the majority of content falling within the small to medium categories. The granular frequency distribution shows multiple local maxima, particularly in the 20,000-60,000 character range, suggesting common natural break points in content length.

<!-- image -->

## Visual Content

### Page Preview

![Page 20](/projects/llms/images/CAG_Chunked_Augmented_Generation_for_Google_Chromes_Builtin_Gemini_Nano_page_20.png)

### Figures

![](/projects/llms/figures/CAG_Chunked_Augmented_Generation_for_Google_Chromes_Builtin_Gemini_Nano_page_20_figure_1.png)

