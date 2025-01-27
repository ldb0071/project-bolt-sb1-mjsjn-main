# Page 3

## Page Information

- **Type**: table_page
- **Word Count**: 252
- **Has Tables**: False
- **Has Figures**: False

## Content

# Page 3

## 1 Introduction

AI has shown promise to simulate human behavior and social interaction (Wooldridge and Jennings, 1995; Macal and North, 2005), which can empower applications ranging across prototyping social theories (Aher et al., 2023; Horton, 2023; Kovaˇc et al., 2023), generating synthetic research data (Hämäläinen et al., 2023; Wang et al., 2023a) and building non-player characters (Laird and VanLent, 2001). These applications necessitate the simulated human behavior to possess a convincing level of believability , which allows the users to suspend their

Figure 1: An illustrative example of the 'Consistency', and 'Robustness'. Consistency measures whether the LLMs' generated human behavior accurately depicts the profile information; Robustness measures whether the generated human behavior will be influenced by the perturbation in the profile.

<!-- image -->

disbelief (Ortony et al., 2003). Such believability is crucial as it facilitates users in establishing trust in the AI and streamlines the fulfillment of the AI's goals in these applications.

Recently, the rapid development of LLM has accelerated the realization of human behavior simulation (Park et al., 2023), commonly achieved by providing the LLM with a relevant identity profile in the prompt. Despite the initial progress achieved by now, some challenging issues of LLMs pose a significant threat to the believability of LLMs: (1) Current LLMs cannot effectively process long input context (Liu et al., 2023). This could impede LLMs from capturing crucial information about characters in the profile, as the provided

profile is usually long and complex, consisting of personal data such as identity information, social roles (Wasserman, 1994), and relationships (Hinde, 1976), to facilitate a comprehensive simulation. (2) LLMs lack robustness when confronted with perturbation to the input (Perez and Ribeiro, 2022). This could result in varying behaviors in the same scenarios. Especially when the environment where the LLMs are situated is dynamically changing, causing the profile information to be inevitably updated. LLMs' believability would be compromised if they cannot effectively handle the constantly changing profile when simulating human behavior. Nevertheless, current studies (Park et al., 2023; Wang et al., 2023b; Shao et al., 2023; Cheng et al., 2023) fail to investigate the above two issues comprehensively. Firstly, these works only evaluate the LLMs' capability to simulate very brief profile information, which is far from sufficient to simulate a person effectively. Moreover, there is little or no mechanism to thoroughly examine the potential impact of perturbations on the believability of LLMs and how these perturbations specifically affect their believability.

To assess the negative impact brought by LLMs' deficiency in processing long profile input and lack of robustness, we propose two dimensions to evaluate the believability of LLMs, as shown in Figure 1: (1) consistency : to what extent does the generated human behavior accurately depict the identity information, social roles, and relationships presented in the long profile input? (2) robustness : to what extent do the LLMs' behaviors maintain robustness when faced with updates or perturbations in the profile? To measure consistency and robustness, we introduce SimulateBench, a benchmark for character data collection and evaluation of consistency and robustness. SimulateBench consists of four parts: the profile descriptive framework, the character profile dataset, the consistency dataset, and the robustness dataset. The profile descriptive framework is proposed to document the information about a person comprehensively. Based on the framework, we collect a character profile dataset, including the profiles of 65 characters. To measure the consistency, we assess whether the LLMs can correctly answer multi-choice questions about the character in the consistency dataset. To correctly answer these questions, the LLMs have to participate in logical reasoning based on the profile information. To measure the robustness, we perturb the profile of the assigned character and compare

how the LLMs' consistency ability changed based on the robustness dataset.

Through the SimulateBench, we evaluate the level of believability of ten widely used LLMs. Our findings show that 1) LLMs perform poorly for consistency: they can not accurately depict the information in the long profile input, even if they are equipped with long context size; 2) LLMs exhibit a lack of robustness when faced with even nuanced profile perturbation; 3) LLMs exhibit similar poor robustness performance to different profile perturbations. In further studies, we examine four influential factors that will greatly influence the LLMs' believability.

In summary, we propose two novel dimensions of consistency and robustness to measure LLMs' believability. To facilitate the assessment, we introduce the SimulateBench. We hope our work will inspire further research into the believability of human behavior simulation.

## Visual Content

### Page Preview

![Page 3](/projects/nmn/images/How_Far_Are_LLMs_from_Believable_AI_A_Benchmark_for_Evaluating_the_Believability_of_Human_Behavior_S_page_3.png)
