Page 4

units, that are organized in layers and connected by weighted links. Training a neural network means adapting these weights such that the neural network shows a certain desired behavior. Specifically, an LLM is trained to predict the likelihoods of pieces of text termed, tokens , to occur as continuations of a given text presented as input to the LLM. This input is referred to as prompt . The prompt combined with the produced output constitutes the context of an LLM. It may comprise more than 100k tokens in state-of-the-art LLMs 2 . Still, its length is limited and determines the maximum size of prompts and outputs that an LLM is capable of processing and generating at a time.

Training of an LLM optimizes its parameters such that its computed likelihoods align with real text examples. The training data is a vast body of text snippets extracted, processed, and curated from sources such as Wikipedia, Github code repositories, common websites, books, or news archives. An LLM trained on massive examples is termed a foundation model or pre-trained model . During training, an LLM not only learns to produce correct language but also absorbs and stores information and factual knowledge. However, it is well known that LLMs frequently pick up biases, leading to ethical problems. They may also produce factually incorrect outputs that sound plausible and convincing, termed hallucinations .

Recent findings show that LLMs can be applied to a wide range of tasks by appropriately formulating prompts. Different prompt patterns succeed in different tasks. Basic approaches rely on instructing the LLM to solve a task described or explained in the prompt. In few-shot prompting (also known as few-shot learning), the prompt is augmented with example input-output pairs illustrating how to solve the task, e.g., the requested output format. The number of examples can vary. Prompting with one example is called one-shot prompting, while prompting without any examples is called zero-shot prompting. One-shot and few-shot prompting fall under the broader category of in-context learning . Prompt patterns such

as chain-of-thought and thinking-aloud aim to elicit advanced reasoning capabilities from LLMs.

As effective prompts are crucial for unlocking the diverse capabilities of an LLM, the discipline of prompt engineering is evolving, focusing on the systematic design and management of prompts [66, 9, 53, 31].

## 2.2. Definitions

Invoking an LLM results in an input-processingoutput sequence: Upon receiving a prompt, the LLM processes it and generates an output. We refer to an individual sequence of input-processing-output performed by the LLM as LLM invocation , and define an LLM-integrated application as a system in which the software generates the prompt for the LLM and processes its output. The concept of an application is broad, encompassing service-oriented architectures and systems with components loosely coupled via API calls.

Given an LLM's versatility, an application can utilize it for different tasks, each demanding a specific approach to create the prompt and handle the result. This paper defines a particular software component that accomplishes this as an LLM-based software component or, simply, LLM component . An LLMintegrated application can comprise several LLM components. The study develops a taxonomy for LLM components. LLM-integrated applications are described as combinations of their LLM components.

## 3. Related Work