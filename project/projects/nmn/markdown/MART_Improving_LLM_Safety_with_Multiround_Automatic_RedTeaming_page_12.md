# Page 12

## Page Information

- **Type**: main_content
- **Word Count**: 18
- **Has Tables**: False
- **Has Figures**: False

## Content

# Page 12

## 2.4 Iteratively Training M adv and M tgt

As the parameters of M tgt change across iterations, new vulnerabilities or failure modes may emerge after each model update, which calls for adaptation of M adv to provide updated adversarial attacks. To consistently provide effective attack to improve M tgt , we propose to jointly optimize M adv and M tgt in an iterative cycle. At each iteration i , M adv is first prompted using P i -1 adv to generate similar but novel prompt set P i gen . Then we use the newly generated P i gen to query the target model M tgt and provide feedback for its response. According to the feedback, we further se-

lect training data for M adv and M tgt and update both models. The process is repeated for multiple iterations until the target model can robustly defend against attacks from the adversarial model.

## Visual Content

### Page Preview

![Page 12](/projects/nmn/images/MART_Improving_LLM_Safety_with_Multiround_Automatic_RedTeaming_page_12.png)
