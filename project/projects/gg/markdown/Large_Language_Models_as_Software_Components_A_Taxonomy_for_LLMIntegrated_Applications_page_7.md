Page 7

LowCode comprises two LLM components termed Planning and Executing . Planning operates in the prompt-definition section, where a user roughly describes a complex task, and Planning designs a workflow for solving it. The prompt-definition section offers a low-code development environment where the LLM-generated workflow is visualized as a graphical flowchart, allowing a user to edit and adjust the logic of the flow and the contents of its steps. For instance, in essay-writing scenarios, this involves inserting additional sections, rearranging sections, and refining the contents of sections. Once approved by the user, LowCode translates the modified workflow back into natural language and incorporates it into a prompt for Executing . In the dialogue section, users converse in interactive, multi-turn dialogues with Executing . As defined in the prompt, it acts as an assistant for tasks such as writing an essay or resume, or as a hotel service chatbot. While the idea of the LLM planning a workflow might suggest using the LLM for application control, LowCode Planning actually serves as a prompt generator that supports developing prompts for complex tasks.

MyCrunchGpt . MyCrunchGpt acts as an expert system within the engineering domain, specifically for airfoil design and calculations in fluid mechanics. These tasks require complex workflows comprising several steps such as preparing data, parameterizing tools, and evaluating results, using various software systems and tools. The aim of MyCrunchGpt is to facilitate the definition of these workflows and automate their execution [28].

MyCrunchGpt offers a web interface featuring a dialogue window for inputting commands in plain English, along with separate windows displaying the

Table 1: Example instances selected for development (top 6) and evaluation (bottom 5)

| Application       | References   | LLM components                                        |
|-------------------|--------------|-------------------------------------------------------|
| Honeycomb         | [7, 8]       | QueryAssistant                                        |
| LowCode           | [5],[35]     | Planning , Executing                                  |
| MyCrunchGpt       | [28]         | DesignAssistant , SettingsEditor , DomainExpert       |
| MatrixProduction  | [69]         | Manager , Operator                                    |
| WorkplaceRobot    | [37]         | TaskPlanning                                          |
| AutoDroid         | [64]         | TaskExecutor , MemoryGenerator                        |
| ProgPrompt        | [51]         | ActionPlanning , ScenarioFeedback                     |
| FactoryAssistants | [26]         | QuestionAnswering                                     |
| SgpTod            | [71]         | DstPrompter , PolicyPrompter                          |
| TruckPlatoon      | [70]         | Reporting                                             |
| ExcelCopilot      | [16, 44]     | ActionExecutor , Advisor , IntentDetector , Explainer |

output and results of software tools invoked by MyCrunchGpt in the backend. MyCrunchGpt relies on predefined workflows, not supporting deviations or cycles. By appending a specific instruction to the dialogue history in the prompt for each step of the workflow, it uses the LLM as a smart parser to extract parameters for APIs and backend tools from user input. APIs and tools are called in the predefined order [28, p. 56].

MyCrunchGpt is still in development. The paper [28] explains the domain as well as the integration of the LLM, but does not fully detail the implementation of the latter. Still, MyCrunchGpt illustrates innovative applications of an LLM in a technical domain. We categorize three LLM components solving tasks within MyCrunchGpt : a DesignAssistant guiding users through workflows and requesting parameters for function and API calls; a SettingsEditor updating a JSON file with settings for a backend software tool; and a DomainExpert which helps evaluating results by comparing them to related results, e.g., existing airfoil designs, which it derives from its trained knowledge.

MatrixProduction . MatrixProduction employs an LLM for controlling a matrix production system [69]. While in a classical line production setup, workstations are arranged linearly and the manufacturing steps follow a fixed sequence, matrix production is oriented towards greater flexibility.

Autonomous transport vehicles carry materials and intermediate products to workstations, termed automation modules, each offering a spectrum of manufacturing skills that it can contribute to the production process. Compared to line production, matrix production is highly adaptable and can manufacture a variety of personalized products with full automation. This requires intelligent production management to (a) create workplans that orchestrate and schedule the automation modules' skills, and (b) program the involved automation modules such that they execute the required processing steps.