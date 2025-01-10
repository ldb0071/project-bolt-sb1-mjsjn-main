Page 14

Frequency addresses how often the application invokes a specific LLM component to fulfill a goal:

Single : A single invocation of an LLM component is sufficient to produce the result. E.g., in MyCrunchGpt , the application internally invokes distinct LLM components once for each user input by injecting varying prompt instructions.

Iterative : The LLM component is invoked repeatedly to produce the result. E.g., AutoDroid TaskEx-

ecutor is invoked multiple times to fulfill a command with an updated environment description in the State prompt; LowCode Executing is repeatedly prompted by the user to achieve the use goal while the application updates the dialogue history.

## 5.2.2. Function dimensions

The Function dimensions are derived from the classical three-tier software architecture model which segregates an application into three distinct layers: presentation, logic and data [17]. The presentation layer implements the UI. On the input side, it allows users to enter data and commands that control the application. On the output side, it presents information and provides feedback on the execution of commands. The logic layer holds the code that directly realizes the core objectives and processes of an application such as processing data, performing calculations, and making decisions. The data layer of an application manages the reading and writing of data from and to persistent data storage. Due to its versatility, an LLM component can simultaneously implement functionality for all three layers. The taxonomy addresses this with three Function dimensions.

UI indicates whether an LLM component contributes significantly to the user interface of an application, avoiding the need to implement graphical UI controls or display elements:

none : No UI functionality is realized by the LLM. E.g., in ExcelCopilot , the LLM does not replace any UI elements.

Input : Input UI is (partially) implemented by the LLM. E.g., in MatrixProduction Manager , users input their order in natural language, obviating a product configuration GUI.