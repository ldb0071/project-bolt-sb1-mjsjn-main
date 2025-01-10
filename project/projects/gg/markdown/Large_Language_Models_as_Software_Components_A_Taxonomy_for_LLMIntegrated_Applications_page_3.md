Page 3

LLM-integrated applications engineering is emerging as a research field. E.g., [10] proposes LLM Systems Engineering (LLM-SE) as a novel discipline, and [44, 8, 7] discuss experiences and challenges that developers of such systems encounter in practice.

This study develops a taxonomy that provides a structured framework for categorizing and analyzing LLM-integrated applications across various domains. To develop and evaluate the taxonomy, we collected a sample of LLM-integrated applications, concentrating on technical and industrial domains. These applications showcase a broad range of opportunities to leverage LLMs, often integrating LLMs in multiple ways for distinct purposes. In developing the taxonomy, we found that examining each of these integrations, termed 'LLM components', separately is

crucial for a clear understanding of an application's architecture.

The taxonomy adopts an original architectural perspective, focusing on how the application interacts with the LLM while abstracting from the specifics of application domains. For researchers, the taxonomy contributes to shape a common understanding and terminology, thus aiding theory building in this emerging domain [29, 50, 18]. For practitioners, the taxonomy provides inspiration for potential uses of LLMs in applications, presents design options, and helps identify challenges and approaches to address them.

Objectives. In this study, a taxonomy is understood as a set of dimensions divided into characteristics. The objective is to identify dimensions that are useful for categorizing the integration of LLMs in applications from an architectural perspective. To be most effective, the taxonomy should be easy to understand and apply, yet distinctive enough to uncover the essential aspects. Additionally, we aim to develop a visual representation tailored to the taxonomy's intended purposes.

Overview. The following section 2 provides background on LLMs and introduces relevant concepts. Section 3 presents an overview of related work. The study design adheres to a Design Science Research approach [46]. We apply established methods for taxonomy design [42, 48] as described in Section 4. This section also presents the sample of LLM-integrated applications used for this study. The developed taxonomy is presented, demonstrated and formally evaluated in section 5. In section 6, we discuss its usability and usefulness. Section 7 summarizes the contributions, addresses limitations, and concludes.

## 2. Large Language Models

## 2.1. Background

State-of-the-art LLMs such as GPT-3.5, GPT-4, Llama, PALM2, etc., are artificial neural networks consisting of neurons, i.e., very simple processing