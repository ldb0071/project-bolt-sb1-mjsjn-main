Page 19

conVerse : The application relies on the LLM's capability to engage in purposeful dialogues with humans. E.g., MyCrunchGpt DesignAssistant asks users for missing parameters; SgpTod PolicyPrompter decides how to react to user inputs and formulates chatbot responses.

Inform : The application depends on knowledge that the LLM has acquired during its training, unlike applications that provide all necessary information within the prompt. E.g., MyCrunchGpt DomainExpert provides expert knowledge on airfoil designs; MatrixProduction relies on built-in knowledge of production processes, such as 'a hole is produced by drilling'; LowCode Executing uses its learned knowledge for tasks like essay writing.

Reason : The LLM draws conclusions or makes logical inferences. E.g., FormulaExplainer in ExcelCopilot explains the effects of Excel functions in formulas; AutoDroid MemoryGenerator s explain the effects of GUI elements in Android apps.

Plan : The LLM designs a detailed method or course of action to achieve a specific goal. E.g., AutoDroid TaskExecutor and WorkplaceRobot TaskPlanning devise action plans to achieve goals. The Plan and Reason characteristics are interrelated, as planning also requires reasoning. The intended handling of these characteristics is to categorize an LLM component as Plan only and understand Plan as implicitly subsuming Reason .

The effectiveness of LLMs as components of software applications relies on their commonsense knowledge and their ability to correctly interpret and handle a broad variety of text inputs, including instructions,

examples, and code. It is reasonable to assume that a fundamental capability, which might be termed Unterstand , is leveraged by every LLM component. As it is not distinctive, the taxonomy does not list it explicitly in the Skills dimension.

Applying this taxonomy dimension requires users to determine which skills are most relevant and worth highlighting in an LLM component. Given the versatility of LLMs, reducing the focus to few predominant skills is necessary to make categorizations distinctive and expressive.

## 5.2.5. Output-related dimensions

Output Format characterizes the format of the LLM's output. As an output may consist of several parts in diverse formats, this dimension is designed as nonmutually exclusive, same as the Skills dimension. It distinguishes four characteristics that are distinctive and well discernible: