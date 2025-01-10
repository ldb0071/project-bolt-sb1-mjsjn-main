Page 28

## B.2 ANOMALY GENERATION PROCESS

The detailed algorithm is outlined in Algorithm 1.

## C OTHER FINDINGS

## Observation 7 on BPE tokenization

Only OpenAI GPT with the BPE tokenization can occasionally benefits from Token-perDigit representation of input.

Figure 9: TPD/Non-TPD, Two TPD variants vs counterparts

<!-- image -->

Gruver et al. (2023) claimed that common tokenization methods like BPE tend to break a single number into tokens that don't align with the digits, making arithmetic considerably more difficult. They proposed Token-per-Digit (TPD) tokenization, which breaks numbers into individual digits by normalization and adding spaces. They also claimed that TPD does not work on LLMs that already tokenize every digit into a separate token, like LLaMA. Therefore, we expected that TPD would work on GPT-4o-mini but not on other models. However, the results show that TPD only improves the GPT-4omini performance on the trend dataset but not on others, as seen in Figure 9. As expected, TPD does not work with all other LLMs. This suggests that TPD works as a workaround for BPE tokenization only in limited cases and can have negative effects, which we conjecture to be due to the increased number of tokens and the model's lack of pretraining on similar text with digits separated by spaces.

## Observation 8 on LLM Performance