Page 1

## Trustworthy and E/fficient LLMs Meet Databases

Kyoungmin Kim kyoung-min.kim@ep/fl.ch EPFL

Switzerland

## Abstract

In the rapidly evolving AI era with large language models (LLMs) at the core, making LLMs more trustworthy and e/fficient, especially in output generation (inference), has gained signi/ficant attention. This is to reduce plausible but faulty LLM outputs (a.k.a hallucinations) and meet the highly increased inference demands. This tutorial explores such e/fforts and makes them transparent to the database community. Understanding these e/fforts is essential in harnessing LLMs in database tasks and adapting database techniques to LLMs. Furthermore, we delve into the synergy between LLMs and databases, highlighting new opportunities and challenges in their intersection. This tutorial aims to share with database researchers and practitioners essential concepts and strategies around LLMs, reduce the unfamiliarity of LLMs, and inspire joining in the intersection between LLMs and databases.

## 1 Introduction

Large language models (LLMs) have recently transformed various /fields with their ability to understand and generate human-like text. In the database domain, researchers are leveraging LLMs to tackle complex data management tasks [55, 194]. LLMs can function not only as assistants for database administrators (DBAs) [271, 340] but also as internal components of database systems, optimizing query plans [8, 168] and translating natural languages to SQLs [224].

Beyond these applications, key concepts and advancements from the LLM community remain underexplored by database researchers. This tutorial aims to bridge that gap by focusing on enhancing the trustworthiness and e/fficiency of LLMs. Improving trustworthiness involves reducing hallucinations [124] to ensure LLMs generate accurate, factual responses, thereby increasing their reliability in database tasks requiring precise answers and reasoning. Enhancing e/fficiency focuses on decreasing inference latency and boosting throughput.