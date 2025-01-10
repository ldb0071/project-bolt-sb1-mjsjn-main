Page 5

With the recent progress in generative AI and LLMs, the interest in these techniques has increased, and numerous surveys have been published, providing an extensive overview of technical aspects of LLMs [72], reviewing LLMs as tools for software engineering [22], and discussing the technical challenges of applying LLMs across various fields [25]. Further studies address the regulatory and ethical aspects of Generative AI and ChatGPT, with a particular focus on AI-human collaboration [41], and Augmented Language Models (ALMs), which are LLMs that enhance

their capabilities by querying tools such as APIs, databases, and web search engines [38].

Taxomonies related to LLMs include a taxonomy for prompts designed to solve complex tasks [49] and a taxonomy of methods for cost-effectively invoking a remote LLM [60]. A comparative analysis of studies on applications of ChatGPT is provided by [27], whereas LLMs are compared based on their application domains and the tasks they solve in [20]. Most closely related to the taxonomy developed here is a taxonomy for LLM-powered multiagent architectures [21] which focuses on autonomous agents with less technical detail. Taxonomies of applications of AI in enterprises [48] and applications of generative AI, including but not limited to LLMs [52], are developed using methods similar to those in our study.

Several taxonomies in the field of conversational agents and task-oriented dialog (TOD) systems address system architecture [1, 40, 12, 3]. However, they omit detailed coverage of the integration of generative language models.

## 4. Methods

We constructed the taxonomy following established guidelines [42, 48, 29], drawing from a sample of LLM-integrated applications. These applications are detailed in section 4.1.

## 4.1. Development

Taxonomy. We derived an initial taxonomy from the standard architecture of conversational assistants described in [3], guided by the idea that conversational assistants are essentially 'chatbots with tools', i.e., language-operated user interfaces that interact with external systems. This approach proved unsuccessful. The second version was based on the classical threetier software architecture, and then extended over several development cycles. By repeatedly applying the evolving taxonomy to the example instances, we identified dimensions and characteristics using an 'empirical-to-conceptual' approach. When new dimensions emerged, additional characteristics were derived in a 'conceptual-to-empirical' manner. After

five major refinement cycles, the set of dimensions and characteristics solidified. In the subsequent evaluation phase, we applied the taxonomy to a new set of example instances that were not considered while constructing the taxonomy. As the dimensions and characteristics remained stable, the taxonomy was considered complete. In the final phase, we refined the wording and visual format of the taxonomy.