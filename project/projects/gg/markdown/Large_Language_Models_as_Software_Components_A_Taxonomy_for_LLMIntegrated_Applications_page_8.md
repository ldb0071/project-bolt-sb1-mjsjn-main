Page 8

MatrixProduction incorporates two LLM components: Manager creates workplans as sequences of skills (a), while Operator generates programs for the involved automation modules (b).

MatrixProduction prompts Manager and Operator to provide textual explanations in addition to the required sequences of skills or automation module programs. The LLM output is processed by a parser before being used to control the physical systems. Manager relies on built-in productionspecific knowledge of the LLM such as 'a hole is produced by drilling'.

Noteworthy in this approach is its tight integration into the system landscape of Industry 4.0. The few-shot Manager and Operator prompts are generated automatically using Asset Administration Shells , which are standardized, technology-

independent data repositories storing digital twins of manufacturing assets for use in Industry 4.0 [2].

WorkplaceRobot . An experimental robot system is enhanced with LLM-based task planning in [37]. The robot operates in a workplace environment featuring a desk and several objects. It has previously been trained to execute basic operations expressed in natural language such as 'open the drawer' or 'take the pink object and place it in the drawer'. LLM-based task planning enables the robot to perform more complex orders like 'tidy up the work area and turn off all the lights'. To this end, an LLM is prompted to generate a sequence of basic operations that accomplish the complex order.

Although the robot expects operations phrased in natural language, the LLM is prompted with a Python coding task. For instance, the basic operation 'turn on the green light' corresponds to a Python command push\_button('green') . The prompt for the LLM includes several examples each consisting of a description of an environment state, a complex order formatted as a comment, and a sequence of Python robot commands that accomplish the complex order. When invoking the LLM to generate the Python program for a new order, the prompt is augmented with a description of the environment's current state and the new order as a comment.

The Python code produced by the LLM is translated back to a sequence of basic operations in natural language. When the robot executes these operations, there is no feedback about successful completion. Rather, the system assumes that all basic operations require a fixed number of timesteps to complete.

AutoDroid . The goal of mobile task automation is hands-free user interaction for smartphones through voice commands. AutoDroid is a voice control system for smartphones that can automatically execute complex orders such as 'remind me to do laundry on May 11th' or 'delete the last photo I took' [64, 65].

Such complex orders are fulfilled by performing sequences of basic operations in an Android app, such