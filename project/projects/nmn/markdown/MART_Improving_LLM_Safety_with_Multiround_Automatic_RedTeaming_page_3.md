# Page 3

## Page Information

- **Type**: main_content
- **Word Count**: 428
- **Has Tables**: False
- **Has Figures**: False

## Content

# Page 3

## Abstract

Red-teaming is a common practice for mitigating unsafe behaviors in Large Language Models (LLMs), which involves thoroughly assessing LLMs to identify potential flaws and addressing them with responsible and accurate responses. While effective, manual redteaming is costly, and existing automatic redteaming typically discovers safety risks without addressing them. In this paper, we propose a Multi-round Automatic Red-Teaming (MART) method, which incorporates both automatic adversarial prompt writing and safe response generation, significantly increasing red-teaming scalability and the safety of the target LLM. Specifically, an adversarial LLM and a target LLM interplay with each other in an iterative manner, where the adversarial LLM aims to generate challenging prompts that elicit unsafe responses from the target LLM, while the target LLM is fine-tuned with safety aligned data on these adversarial prompts. In each round, the adversarial LLM crafts better attacks on the updated target LLM, while the target LLM also improves itself through safety fine-tuning. On adversarial prompt benchmarks, the violation rate of an LLM with limited safety alignment reduces up to 84.7% after 4 rounds of MART, achieving comparable performance to LLMs with extensive adversarial prompt writing. Notably, model helpfulness on non-adversarial prompts remain stable throughout iterations, indicating the target LLM maintains strong performance on instruction following.

## Visual Content

### Page Preview

![Page 3](/projects/nmn/images/MART_Improving_LLM_Safety_with_Multiround_Automatic_RedTeaming_page_3.png)
