Page 11

ExcelCopilot is accessible in a task bar alongside the Excel worksheet. It features buttons with context-dependent suggestions of actions and a text box for users to type in commands in natural language. ExcelCopilot only works with data tables, so its initial suggestion is to convert the active worksheet's data into a data table. Copilot functions activate when a data table or part of it is selected. It then presents buttons for four top-level tasks: 'add formula columns', 'highlight', 'sort and filter', and 'analyze'. The 'analyze' button triggers the copilot to display more buttons, e.g., one that generates a pivot chart from the selected data. ExcelCopilot can also add a formula column to the data table and explain the formula in plain language.

When a user inputs a free-text command, ExcelCopilot may communicate its inability to fulfill it. This constantly occurs with commands requiring multiple steps, indicating that ExcelCopilot lacks a planning LLM component as seen in, for example, MatrixProduction . This observation, along with its mention in [44], suggests that ExcelCopilot employs an intent detection-skill routing architecture. This architecture includes an LLM component that maps free-text user commands to potential intents and then delegates to other LLM components tasked with generating actions to fulfill those intents. Ac-

cordingly, ExcelCopilot comprises several types of LLM components:

- · Several distinct Action Executor s generate code for specific application actions, such as creating a pivot table, designing a worksheet formula, inserting a diagram, and so on.
- · An Advisor suggests meaningful next actions. Its outputs serve to derive button captions and prompts for ActionExecutor s.
- · When a user inputs a free-text command, the IntentDetector is invoked to determine and trigger a suitable ActionExecutor . The IntentDetector communicates its actions to users and informs them when it cannot devise a suitable action.
- · The Explainer generates natural language explanations of formulae designed by ExcelCopilot . It is unclear whether under the hood, the ActionExecutor is generating both the formula and the explanation, or if two separate LLM components are being invoked. We assume the latter, i.e., that a separate Explainer LLM component exists.

While users interact repeatedly with ExcelCopilot , each interaction adheres to a single-turn pattern, with the user providing a command and ExcelCopilot executing it [44].

## 5. A Taxonomy for LLM Components and LLM-Integrated Applications

When developing the taxonomy, it emerged that analyzing an LLM-integrated application should begin with identifying and describing its distinct LLM components. Analyzing each LLM component separately helps capture details and provides a clear understanding of how the application utilizes LLM capabilities. The LLM-integrated application can then be described as a combination of the LLM components it employs.

Table 2: Dimensions and characteristics of the taxonomy. Codes of characteristics are printed in uppercase. 'Meta' means 'metadimension'. 'MuEx' means 'mutual exclusiveness'.

| Meta       | Dimension             | Characteristics                                              | MuEx         |
|------------|-----------------------|--------------------------------------------------------------|--------------|
| Invocation | Interaction Frequency | A pp , C ommand , D ialog S ingle , I terative               | enforced yes |
| Function   | Logic                 | c A lculate , C ontrol                                       | yes          |
|            | UI                    | none , I nput , O utput , B oth                              | yes          |
|            | Data                  | none , R ead , W rite , B oth                                | yes          |
| Prompt     | Instruction           | none , U ser , L LM , P rogram                               | enforced     |
|            | State                 | none , U ser , L LM , P rogram                               | enforced     |
|            | Task                  | none , U ser , L LM , P rogram                               | yes          |
|            | Check                 | none , U ser , L LM , P rogram                               | enforced     |
|            | Skills                | re W rite , C reate , con V erse , I nform , R eason , P lan | no           |
| Output     | Format                | F reeText , I tem , C ode , S tructure                       | no           |
|            | Revision              | none , U ser , L LM , P rogram                               | enforced     |
|            | Consumer              | U ser , L LM , P rogram , E ngine                            | enforced     |