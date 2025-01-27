# Page 10

## Page Information

- **Type**: table_page
- **Word Count**: 352
- **Has Tables**: False
- **Has Figures**: False

## Content

# Page 10

## 3.2 Measuring Consistency

Consistency Dataset The consistency dataset is composed of multi-choice questions. Each character has an average of 150 questions. To accurately answer these questions, the LLMs needs to analyze and employ logical reasoning to the profile information. We apply GPT-4 to autonomously generate these questions based on the various profile information types. For question generation details and question examples, please refer to the Appendix A.4. According to the profile descriptive framework, there are three kinds of questions related to Immutable Characteristics, Social Roles, and Relationships. We manually generate the gold answers for every question and double-check the correct-

ness of the answer.

For every question, we add a choice of 'There's not enough information to answer this question'. This choice is intended for the case that there is no sufficient information about the character in the profile for the LLM to deduce the answer, and we set this choice as the gold answer in such a case. The reason for this setting is that if the LLM is given unrestricted freedom to respond to the content that is not mentioned in the profile, there is a high probability of compromising the character's information and undermining the LLM's believability. We further categorize the questions into two classes according to their gold answer: Known and Unknown . The gold answer of Unkown is 'There's not enough information to answer this question'. For question examples, please refer to the Appendix A.4.

Measuring Metric: CA To measure the consistency, we will employ the LLMs to answer the questions in the consistency dataset, and we will calculate the accuracy of these answers as the consistency ability, referred to as CA .

## Visual Content

### Page Preview

![Page 10](/projects/nmn/images/How_Far_Are_LLMs_from_Believable_AI_A_Benchmark_for_Evaluating_the_Believability_of_Human_Behavior_S_page_10.png)
