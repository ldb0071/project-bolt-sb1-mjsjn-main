# Page 15

## Page Information

- **Type**: figure_page
- **Word Count**: 145
- **Has Tables**: False
- **Has Figures**: False

## Content

# Page 15

## 4.3 Analysis of Complexity

The centralized approach uses k models for generation and 1 central model for evaluation; other than text length, the number of input tokens scale linearly with the number of models and with the number of rounds. Output tokens also scale linearly with number of models and number of rounds, but since we instruct the model to output a fixed number of words for summary (and in our experiments the models are largely compliant), and output only the anonymous identifier for a chosen summary, we ensure bounded runtime and cost. Further analysis can be found at Appendix B.1.

## Visual Content

### Page Preview

![Page 15](/projects/llms/images/MultiLLM_Text_Summarization_page_15.png)
