Page 25

| Application       | Used or best LLM   | Evals   | Comments                                        |
|-------------------|--------------------|---------|-------------------------------------------------|
| Honeycomb         | GPT-3.5            | yes     | GPT-4 far too slow                              |
| LowCode           | GPT-3.5-turbo      |         |                                                 |
| MyCrunchGpt       | GPT-3.5            |         | then awaiting the publication of GPT-4          |
| MatrixProduction  | text-davinci-003   |         |                                                 |
| WorkplaceRobot    | GPT-3              |         |                                                 |
| AutoDroid         | GPT-4              | yes     | GPT-4 best for tasks requiring many steps       |
| ProgPrompt        | GPT-3              |         | CODEX better, but access limits prohibitive     |
| FactoryAssistants | GPT-3.5            |         |                                                 |
| SgpTod            | GPT-3.5            | yes     | GPT-3.5 best more often than others combined    |
| TruckPlatoon      | GPT-3.5-turbo      |         |                                                 |
| ExcelCopilot      | N/A                |         | combined LLMs in Copilot for Microsoft 365 [43] |

## 7. Conclusion

This paper investigates the use of LLMs as software components. Its perspective differs from current software engineering research, which investigates LLMs as tools for software development [14, 22] and from research examining LLMs as autonomous agents [11, 62, 57, 21]. This paper defines the concept of an LLM component as a software component that realizes its functionality by invoking an LLM. While LLM components implicitly appear in various works, termed, for example, 'prompters', 'prompted LLM', 'prompt module', or 'module' [30, 71, 6, 7], to our knowledge, this concept has not yet been formalized or systematically investigated.

The main contribution of this study is a taxonomy for the analysis and description of LLM components, extending to LLM-integrated applications by characterizing them as combinations of LLM components. In addition to the dimensions and characteristics of the taxonomy, the study contributes a taxonomy visualization based on feature vectors, which is more compact than the established visualizations such as morphological boxes [55] or radar charts. It represents an LLM-integrated application as one visual entity in a tabular format, with its LLM components displayed as rows.

The taxonomy was constructed using established methods, based on a set of example instances, and evaluated with a new set of example instances. The

combined samples exhibit broad variation along the identified dimensions. For some instances, information was not available, necessitating speculative interpretation. However, since the sample is used for identifying options rather than quantitative analysis, this issue and the representativeness of the sample are not primary concerns. The evaluation was conducted by the developer of the taxonomy, consistent with recent related work [21, 52, 48]. Using a new sample for evaluation strengthens the validity of the results.

A further significant contribution of the paper is a systematic overview of a sample of LLM-integrated applications across various industrial and technical domains, illustrating a spectrum of conceptual ideas and implementation options.

As the examples show, LLM components can replace traditionally coded functions in software systems and enable novel use cases. However, practical challenges persist. Developers report that new software engineering methods are required, e.g., for managing prompts as software assets and for testing and monitoring applications. For instance, the costs of LLM invocations prohibit the extensive automated testing that is standard in software development practice [44, 7]. Challenges also arise from the inherent indeterminism and uncontrollability of LLMs. Small variations in prompts can lead to differences in outputs, while automated output processing

in LLM-integrated applications requires the output to adhere to a specified format.