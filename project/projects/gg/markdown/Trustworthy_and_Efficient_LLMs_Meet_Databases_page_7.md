Page 7

Other than the training methods, a new model architecture of di/fferential Transformer [315] reduces the distractions of the models to focus on unnecessary information in the long context, which works similarly to robust decoding strategies [91, 276].

Target. The audience will learn about tuning LLMs to make them more trustworthy and aligned with user intentions.

2.1.3 Making LLMs Interact with the World: Adding Eyes and Hands. LLMs alone can encounter knowledge, memory, and capability limitations [326]. Their knowledge is con/fined to the static information encoded during training, leading to potential inaccuracies over time. Memory constraints arise from limited context windows, hindering the handling of extended conversations. Additionally, their text-based nature restricts interactions with the physical world. To address these challenges, LLMs can retrieve knowledge, memory, and tools.

This section focuses on what and how to retrieve. When to retrieve is the key to autonomy and will be detailed in the next section.

Knowledge retrieval is represented by well-known retrievalaugmented generation (RAG) [76, 90, 126, 154, 166]. Based on the data type, it can fetch knowledge from knowledge graphs [38, 109, 169, 211, 225, 245, 266, 301, 309], tables [9, 22, 40, 45, 96, 98, 115, 128, 150, 158, 190, 265, 320], images [41, 42, 314], not just documents. The data may be chunked/vectorized, stored in vector databases, then similar chunks are searched online. While vector similarities are typically used, more advanced similarity scores are possible, e.g., using dual or cross encoders [203, 239].

Memory retrieval attempts to overcome the limited context size of LLMs by storing previously seen tokens as key-value pairs [25, 183, 193, 281, 294] and fetching relevant pairs in upcoming requests, managing memory stores in hierarchical or partitioned way [145, 287] or even as a database [118]. Fetching information from long input can also be done without maintaining a separate

memory store, but by sparsifying the model layers [15, 186]. One can relate low-rank adapters and mixture-of-experts [29, 71, 78, 110, 119, 155, 228, 292] with memory retrieval since lightweight model parameters are /fine-tuned per speci/fic task and domain, and dynamically fetched at online inferences.

Tool retrieval searches for the APIs to interact with external environments [188, 197, 218, 229, 232, 246, 286, 300]. One can connect LLMs with databases to call SQLs that can help answering user questions [22]. Constrained decoding [20, 69, 92, 93] allows output to follow speci/fic structure which can increase correctness and e/fficiency.