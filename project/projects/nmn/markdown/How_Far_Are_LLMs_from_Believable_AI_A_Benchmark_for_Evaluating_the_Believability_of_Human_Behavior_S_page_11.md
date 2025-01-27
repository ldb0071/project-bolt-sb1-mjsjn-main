# Page 11

## Page Information

- **Type**: main_content
- **Word Count**: 53
- **Has Tables**: False
- **Has Figures**: False

## Content

# Page 11

## 3.3 Measuring Robustness

Robustness Dataset The robustness dataset is constructed by conducting perturbations on the characters' profiles (denoted by the characters' variant) and modifying the questions in the consistency dataset accordingly. We perturb the profile of characters by replacing the content of demographic factors: Education , Surname , Race , and Age . To prevent irrationality caused by the perturbation, a thorough examination of the consequences resulting from any modifications made to the initial profile is conducted. Please refer to the Appendix A.3 for more details. According to this perturbation, we modify the corresponding questions in the consistency dataset. Then, we include the modified questions in our robustness dataset. For instance, if we modify the age of a character from 20 to 30, our initial step will involve duplicating the questions pertaining to the character in the consistency dataset. Subsequently, we shall alter these questions and their gold answers to align with the age adjustment. After the alteration of these questions, we get the questions for the character at the age of 30.

Measuring Metrics: RA and RCoV The robustness aims to determine the variation in the consistency performance of the LLMs when slight mod-

ifications are made to profiles. To achieve this goal, we employ the variation of CA and coefficient of variation 4 of CA scores as the robustness performance of LLMs, referred to as RA and RCoV respectively. For example, when employing GPT3.5 to simulate a character, only modifying the age property in the profile to values of 10, 15, 20, 25, and 30 yields five variants. After all five variants finish the robustness dataset, five CA scores will exist: s 1 , . . . , s 5 . The five scores' deviation and mean are σ , µ . The RA of GPT-3.5 will be RA = σ . The RCoV of GPT-3.5 will be RCoV = RA/µ .

Dividing RA by µ allows for the comparison of different models. RCoV can be understood as the quantification of the impact that robustness (RA) can have on the actual performance ( µ ). As an illustration, LLM A demonstrates an RA of 0.04, a µ of 0.3, and hence RCoV to be 0.13. LLM B exhibits an RA of 0.08, a µ of 0.9, and hence RCoV to be 0.089. While LLM B has a higher RA score (0.08 compared to 0.04), the actual impact of RA on performance is smaller (0.089 compared to 0.13).

## Visual Content

### Page Preview

![Page 11](/projects/nmn/images/How_Far_Are_LLMs_from_Believable_AI_A_Benchmark_for_Evaluating_the_Believability_of_Human_Behavior_S_page_11.png)
