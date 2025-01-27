# Page 21

## Page Information

- **Type**: main_content
- **Word Count**: 125
- **Has Tables**: False
- **Has Figures**: True

## Content

# Page 21

## 6.3 Content Categories and Distribution

Fig 5. Distribution of article lengths across different size categories. The graph shows the frequency of articles classified as Small (≈87), Medium (≈140), Large (≈105), ExtraLarge (≈42), and Humongous (≈7). The y-axis represents the number of articles, while the x-axis shows the size classifications. Data is represented using a bar chart with distinct colors for each category.

<!-- image -->

Based on the context window analysis, we established five distinct categories:

- ● Small (0-24,576 characters): Representing approximately 87 articles in our dataset, these documents fit within a single context window. Processing these documents requires minimal chunking overhead, allowing for straightforward, efficient processing.
- ● Medium (24,577-49,152 characters): The most common category with approximately 138 articles, requiring two context windows. This category represents the sweet spot for CAG's chunking strategy, balancing processing overhead with content comprehension.
- ● Large (49,153-73,728 characters): Containing about 105 articles, this category requires three context windows. These documents demonstrate CAG's ability to maintain semantic coherence across multiple processing chunks.
- ● Extra Large (73,729-98,304 characters): With roughly 43 articles, this category requires four context windows. These documents test CAG's resource management capabilities and chunk coordination strategies.
- ● Humongous (98,304+ characters): A small but significant category with approximately 8 articles, requiring more than four context windows. These documents showcase CAG's scalability and ability to handle extensive content while maintaining browser performance.

## Visual Content

### Page Preview

![Page 21](/projects/llms/images/CAG_Chunked_Augmented_Generation_for_Google_Chromes_Builtin_Gemini_Nano_page_21.png)

### Figures

![](/projects/llms/figures/CAG_Chunked_Augmented_Generation_for_Google_Chromes_Builtin_Gemini_Nano_page_21_figure_1.png)

