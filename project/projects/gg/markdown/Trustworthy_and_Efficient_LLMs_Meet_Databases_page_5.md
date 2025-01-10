Page 5

Figure 1: Tutorial outline (each subsection with keywords).

<!-- image -->

Figure 1 visualizes the outline with keywords for each subsection. Section 2.1 focuses on improving the trustworthiness of LLMs, exploring challenges such as hallucination and context limitations while presenting state-of-the-art solutions to improve the accuracy and reliability of generated outputs. Section 2.2 emphasizes e/fficiency, covering optimization strategies for inference, data management, and hardware utilization. Finally, Section 2.3 highlights the convergence of LLMs and databases, exploring opportunities for integration, new workloads, and emerging system designs. Since the /field is changing fast, we will regularly re/flect new information until the tutorial date.

## 2.1 Trustworthy LLMs

The /first part of the tutorial explains the e/fforts to reduce hallucinations and make LLMs more trustworthy, using an analogy that LLMs resemble humans. We explain background (Section 2.1.1), how LLMs can solely improve (Section 2.1.2), how LLMs can improve by interacting with the external world (Section 2.1.3), and how LLMs can automatically make such decisions and interact with other LLMs (Section 2.1.4).

2.1.1 Background. Large Language Models (LLMs) function as text-in, text-out systems, generating texts based on their training. Training an LLM is akin to nurturing a child: by exposing it to extensive text data, the model acquires world knowledge and reasoning abilities. This process involves predicting the most probable next token in a sequence, a type of self-supervised learning. For a sequence of tokens, the model learns to predict the latter tokens based on the preceding ones, enabling it to generate coherent text continuations.

Fine-tuning re/fines this process for speci/fic tasks or domains, similar to how individuals specialize in particular professions. In contrast, in-context learning provides additional information or examples within the input without altering the model's parameters, akin to consulting external references during an open-book exam. Many prompting techniques [19, 34, 112, 240, 247, 258, 275, 319] including chain-of-thought prompting [144, 289] and its variants [18, 312] may leverage in-context learning to enhance performance.

During inference, LLMs generate texts autoregressively, producing one token at a time. This process may involve deterministic methods like greedy or beam search, or probabilistic approaches such as nucleus sampling [80, 114], which helps avoid selecting low-probability tokens.