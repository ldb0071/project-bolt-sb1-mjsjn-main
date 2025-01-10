Page 9

as 'scroll down, then press button x' in the calendar app. AutoDroid employs an LLM component TaskExecutor to plan these sequences of operations. The challenge is that the next operation to execute depends on the current state of the Android app which continuously changes as the app is operated. AutoDroid solves this by invoking the TaskExecutor repeatedly after each app operation with the prompt comprising the updated state of the Graphical User Interface (GUI) along with the user's complex order.

Before executing irrevocable operations, such as permanently deleting data or calling a contact, AutoDroid prompts the user to confirm or adjust the operation. TaskExecutor is instructed to include a 'confirmation needed' hint in its output for such operations.

The prompt for TaskExecutor comprises an extract from a knowledge base which is built automatically in an offline learning phase as follows: In a first step, a 'UI Automator' (which is not an LLM component) automatically and randomly operates the GUI elements of an Android app to generate a UI Transition Graph (UTG). The UTG has GUI states as nodes and the possible transitions between GUI states as edges. As next steps, AutoDroid invokes two LLM components referred to as MemoryGenerator s to analyze the UTG.

The first MemoryGenerator is prompted repeatedly for each GUI state in the UTG. Its task is to explain the functionality of the GUI elements. Besides instructions and examples of the table format desired as output, its prompt includes an HTML representation of the GUI state, the GUI actions preceding this state, and the GUI element operated next. Its output consists of tuples explaining the functionality of a GUI element by naming the derived functionality (e.g., 'delete all the events in the calendar app') and the GUI states and GUI element actions involved. Similarly, the second MemoryGenerator is prompted to output a table listing GUI states and explanations of their functions. These tables constitute AutoDroid 's knowledge base.

ProgPrompt . ProgPrompt [51] is an approach to LLM-based robot task planning similar to

WorkplaceRobot . Its robot is controlled by Python code and works in a real and a simulated household environment.

ProgPrompt comprises two LLM components. ActionPlanning generates Python scripts for tasks such as 'microwave salmon' using basic operations like grab('salmon') , open('microwave') , and putin('salmon', 'microwave') , notably without considering the current state of the environment. To establish a feedback loop with the environment, ActionPlanning adds assert statements. These statements verify the preconditions of basic operations and trigger remedial actions when preconditions are not met. For instance, a script for 'microwave salmon' comprises the following code fragment:

if assert('microwave' is 'opened') else: open('microwave') putin('salmon', 'microwave')

When operating in the simulated environment, ProgPrompt can verify an assert statement through its second LLM component, ScenarioFeedback . Prompted with the current state of the environment and the assert statement, ScenarioFeedback evaluates it and outputs True or False .