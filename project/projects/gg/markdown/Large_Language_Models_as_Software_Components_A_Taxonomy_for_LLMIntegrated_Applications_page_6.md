Page 6

Visualization. Developing a taxonomy involves creating a representation that effectively supports its intended purpose [29]. Taxonomies can be represented in various formats, with morphological boxes [54, 55] or radar charts [21] being well-established approaches. We evaluated morphological boxes, because they effectively position categorized instances within the design space. However, we found that they make it difficult to perceive a group of categorized instances as a whole since they occupy a large display area. This drawback is significant for our purposes, as LLM-integrated applications often comprise multiple LLM components. Therefore, we developed a more condensed visualization of the taxonomy based on feature vectors.

Example instances. We searched for instances of LLM-integrated applications for taxonomy development that should meet the following criteria:

- · The application aims for real-world use rather than focusing on research only (such as testbeds for experiments or proofs-of-concept). It demonstrates efforts towards practical usability and addresses challenges encountered in real-world scenarios.
- · The application's architecture, particularly its LLM components, is described in sufficient detail for analysis.
- · The sample of instances covers a diverse range of architectures.
- · The example instances are situated within industrial or technical domains, as we aim to focus on LLM-integrated applications beyond well-known fields like law, medicine, marketing, human resources, and education.

The search revealed a predominance of theoretical research on LLM-integrated applications while papers focusing on practically applied systems were scarce. Searching non-scientific websites uncovered commercially advertised AI-powered applications, but their internal workings were typically undisclosed, and reliable evaluations were lacking. Furthermore, the heterogeneous terminology and concepts in this emerging field make a comprehensive formal literature search unfeasible. Instead, by repeatedly searching Google Scholar and non-scientific websites using terms 'LLM-integrated applications', 'LLM-powered applications', 'LLM-enhanced system', 'LLM' and 'tools', along similar variants, we selected six suitable instances. Some of them integrate LLMs in multiple ways, totaling eleven distinct LLM components.

For a thorough evaluation, we selected new instances using relaxed criteria, including those intended for research. Additionally, we included a real-world example lacking explicit documentation to broaden the diversity of our sample and assess the taxonomy's coverage. Within the five selected instances, we identified ten LLM components.

## 4.2. Sample of LLM-integrated applications

Table 1 gives an overview of the sample. Names of applications and LLM components are uniformly written as one CamelCase word and typeset in small caps, deviating from the format chosen by the respective authors.

Honeycomb . Honeycomb is an observability platform collecting data from software applications in distributed environments for monitoring. Users define queries to retrieve information about the observed software systems through Honeycomb 's Query Builder UI. The recently added LLM-based QueryAssistant allows users to articulate inquiries in plain English, such as 'slow endpoints by status code' or 'which service has the highest latency?' The QueryAssistant converts these into queries in Honeycomb 's format, which users can execute and manually refine [7, 8].

LowCode . LowCode is a web-based application consisting of a prompt-definition section and a dialogue section. The prompt-definition section supports the design of prompts for complex tasks, such as composing extensive essays, writing resumes for job applications or acting as a hotel service chatbot [5]. In the dialogue section, users converse with an LLM to complete the complex task based on the defined prompt.