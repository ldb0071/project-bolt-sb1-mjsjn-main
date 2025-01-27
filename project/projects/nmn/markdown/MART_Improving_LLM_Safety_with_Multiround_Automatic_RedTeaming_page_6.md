# Page 6

## Page Information

- **Type**: figure_page
- **Word Count**: 573
- **Has Tables**: False
- **Has Figures**: False

## Content

# Page 6

## 2.1 Initialization

Model and Instruction Tuning Seed. Wechose LIMA (Zhou et al., 2023) and Open Assistant (Kopf et al., 2023), two supervised finetuning datasets for general instruction tuning. To goal is to establish the foundation of instructionfollowing skills, without which we would not be able to query and analyze the trade-offs between strong instruction-following abilities and safety alignment. We fine-tune the LLaMA model (Touvron et al., 2023a) with 65B parameters on the two datasets and use it to initialize M tgt and M adv .

Red-teaming Seed. Existing training corpora, while extensive, do not sufficiently cover adversarial test cases needed to robustly evaluate model safety. To proactively monitor model vulnerabilities, we manually curated a seed dataset of approximately 2,400 prompts (without responses) to probe known limitations of large language models.

## Visual Content

### Page Preview

![Page 6](/projects/nmn/images/MART_Improving_LLM_Safety_with_Multiround_Automatic_RedTeaming_page_6.png)
