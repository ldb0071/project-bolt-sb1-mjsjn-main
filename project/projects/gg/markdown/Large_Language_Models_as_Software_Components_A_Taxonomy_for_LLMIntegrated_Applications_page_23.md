Page 23

## 6.1. Applicability and ease of use

The taxonomy was effectively applied to LLMintegrated applications based on research papers, source code blog posts, recorded software demonstrations, and developer experiences. The analysis of LowCode revealed it to be a prompt definition tool combined with an LLM-based chatbot, which deviates from the strict definition of an LLM-integrated application. Still, the taxonomy provided an effective categorization and led to a clear understanding of the system's architecture.

Obviously, the ease of categorization depends on the clarity and comprehensiveness of the available information, which varies across analyzed systems. Analyzing applications of LLMs in novel and uncommon domains can be challenging. While these papers present inspiring and innovative ideas for LLM integration, such as MyCrunchGpt and TruckPlatoon , they may prioritize explaining the application area and struggle to detail the technical aspects of the LLM integration. A taxonomy for LLM-integrated applications can guide and facilitate the writing process and lead to more standardized and comparable descriptions.

Applying the taxonomy is often more straightforward for research-focused systems. Omitting the complexities required for real-world applications, such as prompt checks and output revisions, their architectures are simpler and easier to describe. A taxonomy can point out such omissions.

A fundamental challenge in applying the taxonomy arises from the inherent versatility of LLMs, which allows to define LLM components serving multiple purposes. This is exemplified by SgpTod Poli-

cyPrompter , where the prompt is designed to produce a structure with two distinct outcomes (a class label and a chatbot response), and similarly by MatrixProduction , as detailed section 4.2. Drawing an analogy to 'function overloading' in classical programming, such LLM components can be termed 'overloaded LLM components'.

A taxonomy can handle overloaded LLM components in several ways: (1) define more dimensions as nonmutually exclusive, (2) label overloaded LLM components as 'overloaded' without a more detailed categorization, or (3) categorize them by their predominant purpose or output. While the first approach allows for the most precise categorization, it complicates the taxonomy. Moreover, it will likely result in nearly all characteristics being marked for some LLM components, which is ultimately not helpful. The second approach simplifies categorization but sacrifices much detail. Our taxonomy adopts the third approach, enforcing simplification and abstraction in descriptions of overloaded LLM components while retaining essential detail. The taxonomy can easily be extended to include approach (2) as an additional binary dimension.

## 6.2. Usefulness

The search for instances of LLM-integrated applications uncovered activities across various domains. Substantial research involving LLM integrations, often driven by theoretical interests, is notable in robot task planning [37, 51, 61, 33, 63] and in the TOD field [23, 71, 4, 6, 56]. Research exploring LLM potentials from a more practical perspective can be found in novel domains, such as industrial production [69, 26] and other technical areas [28, 70]. Fur-