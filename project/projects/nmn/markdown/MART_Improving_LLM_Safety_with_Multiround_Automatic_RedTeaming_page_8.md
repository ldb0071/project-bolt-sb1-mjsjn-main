# Page 8

## Page Information

- **Type**: figure_page
- **Word Count**: 438
- **Has Tables**: True
- **Has Figures**: False

## Content

# Page 8

## Algorithm 2: MART Training Data Selection Select ()

Input: Prompt set P i , Response set A i , Safety RM S s , helpfulness RM S h

Parameter: Target model safety and helpfulness RM score threshold θ tgt and θ tgt model safety RM score threshold θ s

gen tgt s h , adversarial adv

Output: Adversarial training prompt set P i adv , safety alignment response set R i tgt

- 1 for ( p, a ) ∈ ( P i gen , A i tgt ) do
- 2 s s ← Eval ( S s , ( p, a )) // s s :safety score
- 3 s h ← Eval ( S h , ( p, a )) // s h :helpfulness score
- 4 if s s < θ s adv then
- 5 P i adv ←P i adv ∪ { p } // Add p to adversarial training set P i adv
- 6 else if s s > θ s tgt ∧ s h > θ h tgt then
- 7 R i tgt ←R i tgt ∪ { a } // Add a to safety alignment response set R i tgt
- 8 return P i adv , R i tgt

These prompts are divided into training (1,700) and evaluation (700) sets. The data collection process followed Llama 2 (Touvron et al., 2023b) We derisk the model according to two aspects: a violation category, namely a potential topic about which the LLM could produce unsafe content; and an attack style, namely an expression technique to cover different varieties of prompts that could elicit bad model behaviors. Detailed information on categories and styles can be found in Touvron et al. (2023b).

The red-teaming seed is used to warm up the adversarial LLM for prompt generation, which will be explained in detail in the following Section.

Feedback. As collecting exhaustive human feedback for model outputs could be costly and nontrivial, we follow previous work to use a trained reward model as a proxy for human preference. We further verify the plausibility of using reward model by comparing it with human

feedback in Section 3.2. The reward model takes a (prompt, response) pair as input and outputs a scalar score to indicate the quality (e.g., helpfulness and safety) of the model response. We use two existing reward models from Touvron et al. (2023b), helpfulness RM S h and safety RM S s , to provide feedback signals for the target and adversarial models. We further evaluate their alignment with human annotation in Section 3.2 to prove the suitability of using them in our setting.

## Visual Content

### Page Preview

![Page 8](/projects/nmn/images/MART_Improving_LLM_Safety_with_Multiround_Automatic_RedTeaming_page_8.png)

## Tables

### Table 1

| MART-1shot
45%
MART-3shot
40% GCG-multiple
GCG-transfer
35%
etaR Few-shot Prompt
30%
25% efasnU
20%
15%
10%
5%
Iter1 Iter2 Iter3 Iter4 |  |  |  | None | MART-1shot |  |
| --- | --- | --- | --- | --- | --- | --- |
| None |  |  |  |  | MART-3shot |  |
| None |  |  |  |  | GCG-multiple
GCG-transfer |  |
| None |  |  |  |  | Few-shot Promp | t |
| None |  |  |  | None |  |  |
| None |  |  |  | None |  |  |
| None |  |  |  | None |  |  |
| None |  |  |  | None |  |  |
| None |  |  |  | None |  |  |
| None |  |  |  | None |  |  |

### Table 2

| MART-1shot GCG-transfer
MART-3shot Few-shot Prompt
20% GCG-multiple
etaR
15%
efasnU
10%
5%
Iter1 Iter2 Iter3 Iter4 |  | MART-1
MART-3 | None | shot
shot | GCG-transfer
Few-shot Promp | t |
| --- | --- | --- | --- | --- | --- | --- |
| None |  | GCG-m | GCG-m | ultiple |  |  |
| None | None | None | None |  |  | None |
| None |  |  | None |  |  |  |
| None |  |  | None |  |  |  |
| None |  |  | None |  |  |  |
