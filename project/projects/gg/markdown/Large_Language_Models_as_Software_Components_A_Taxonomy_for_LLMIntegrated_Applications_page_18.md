Page 18

Program : The application comprises code to check or revise the prompt. E.g., AutoDroid removes personal data, such as names, to ensure privacy before invoking the TaskExecutor ; Honeycomb QueryAssistant incorporates a coded mechanism against prompt injection attacks.

Table 3: Terms used for prompt parts. Expressions specific to a domain are printed in italics, 'examples' indicates a one-shot or few-shot prompt pattern. Terms adopted for the taxonomy are underlined.

| Source   | Instruction                                                 | State                                | Task                   |
|----------|-------------------------------------------------------------|--------------------------------------|------------------------|
| [72]     | task description + examples                                 |                                      | test instance          |
| [34]     | instruction prompt                                          |                                      | data prompt            |
| [32]     | predefined prompt                                           |                                      | user prompt            |
| [45]     | prompt template + examples                                  | DB schema                            | user input question    |
| [45]     | examples                                                    |                                      | SQL query result       |
| [37]     | prompt context, i.e., examples                              | environment state, scene             | input task commands    |
| [5]      | education prompt                                            | dialogue history                     | user input task prompt |
| [5]      | education prompt                                            | dialogue history + provided workflow | (circumscribed)        |
| [69]     | role and goal + instruction + examples                      | context                              | current task           |
| [26]     | predefined system instruction + domain-specific information | query results from knowledge graph   | the user's request     |

Most example instances omit prompt checks. There are no examples where a Check is performed by a User or an LLM .

## 5.2.4. Skills dimensions

The Skills dimension captures the types of LLM capabilities that an application utilizes. It is designed as a dimension with six non-mutually exclusive characteristics.

Skills is decomposed into six specific capabilities:

reWrite : The LLM edits or transforms data or text, such as rephrasing, summarizing, reformatting, correcting, or replacing values. E.g., MyCrunchGpt SettingsEditor replaces values in JSON files; TruckPlatoon converts measurements into textual explanations.

Create : The LLM generates novel output. E.g., LowCode Executing generates substantial bodies of text for tasks like essay writing.