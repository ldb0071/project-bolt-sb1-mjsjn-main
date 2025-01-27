# Page 7

## Page Information

- **Type**: figure_page
- **Word Count**: 514
- **Has Tables**: True
- **Has Figures**: False

## Content

# Page 7

## Algorithm 1: MART Model Training

Input: Initial adversarial model M 0 adv , target model M 0 tgt , safety reward model (RM) S s , helpfulness RM S h , seed adversarial prompt P 0 adv , number of generations K adv and K Output: Adversarial model M T , target model M T

adv tgt

- 1 for i ∈ { 1 , · · · , T -1 } do
- 2 P i gen ← Generate ( M i adv , P i -1 adv , K adv ) // P i gen :newly generated adversarial set
- 3 A i tgt ← Generate ( M i tgt , P i gen , K tgt ) // A i tgt :newly generated answer set
- 4 P i adv , R i tgt ← Select ( P i gen , A i tgt , S s , S h ) // Training data selection
- // Update adversarial model with adversarial prompt sets P i -1 adv and P i adv
- 5 M i +1 adv ← Train ( M i adv , P i -1 adv , P i adv )
- // Update target model with prompt set P gen and safe response set R tgt i +1 i i i )
- 6 M tgt ← Train ( M tgt , P gen , R tgt
- 7 return M T adv , M T tgt

## Visual Content

### Page Preview

![Page 7](/projects/nmn/images/MART_Improving_LLM_Safety_with_Multiround_Automatic_RedTeaming_page_7.png)

## Tables

### Table 1

| 0.9
0.8 erocS
0.7 MR
0.6 ytefaS
80%
0.5 60%
0.4 40%
20%
Vanilla Iter1 Iter2 Iter3 Iter4 |  |  |  |  |  | 1.0
0.8 erocS
0.6 MR
ssenlufpleH
0.4
0.2
0.0
Vanilla Iter1 Iter2 Iter3 Iter4 |  |  |  |  |  |  | 0.9
0.8 erocS
0.7 MR
0.6 ytefaS
80%
0.5 60%
0.4 40%
20%
Vanilla Iter1 Iter2 Iter3 Iter4 |  |  |  |  |  | 1.0
0.8 erocS
0.6 MR
ssenlufpleH
0.4
0.2
0.0
Vanilla Iter1 Iter2 Iter3 Iter4 |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| None |  |  |  |  |  | None | None | None | None | None | None | None | None |  |  |  |  |  | None | None | None | None | None | None | None |
| None | None | None | None | None | None | None |  |  |  |  |  |  | None | None | None | None | None | None | None |  |  |  |  |  |  |
| None |  |  |  |  |  | None | None | None | None | None | None | None | None |  |  |  |  |  | None | None | None | None | None | None | None |
| None |  |  |  |  |  | None |  |  |  |  |  |  | None |  |  |  |  |  | None |  |  |  |  |  |  |
| None |  |  |  |  | 80% | None |  |  |  |  |  |  | None |  |  |  |  | 80% | None |  |  |  |  |  |  |
| None |  |  |  |  | 60% | None | None | None | None | None | None | None | None |  |  |  |  | 60% | None | None | None | None | None | None | None |
| None |  |  |  |  | 40%
20% | None |  |  |  |  |  |  | None |  |  |  |  | 40%
20% | None |  |  |  |  |  |  |
