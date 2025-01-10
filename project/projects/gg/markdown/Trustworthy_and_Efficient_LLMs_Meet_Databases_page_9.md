Page 9

The second part of the tutorial demysti/fies the internals of LLM inference process and explains the e/fforts to make it more e/fficient, using an analogy that LLMs behave as DBMSs. We explain background (Section 2.2.1) and how LLM inference systems resemble DBMSs in improving their e/fficiency (Section 2.2.2). We then explain further work for each dimension of operation (Section 2.2.3), data (Section 2.2.4), hardware (Section 2.2.5), and workload (Section 2.2.6).

2.2.1 Background. The dominant Transformer architecture employs an attention mechanism [274] that calculates similarity scores between a token and its preceding tokens, e/ffectively capturing inter-token relationships and managing extended contexts. This process has quadratic complexity, but key-value (KV) caching [58] optimizes it by storing and reusing these computations, reducing the complexity to linear during inference. Non-attention operations mostly consist of matrix multiplications and activations.

Inference in Large Language Models (LLMs) involves two primary phases: pre/fill and decode. During the pre/fill, the model processes input tokens to generate the initial output token. The attention operates with quadratic complexity due to the absence of precomputed KVs, making it compute-intensive. During the decode, the model generates subsequent tokens sequentially, each time using the last generated token as input. Here, the attention leverages KV caching, resulting in linear complexity relative to the number of processed tokens and reading their KVs, which makes this phase more memory-intensive.

In case of multiple requests, they face a race condition as in multi-tenant systems. If the GPU memory is insu/fficient to keep all requests' KVs, some running requests are preempted (evicted), releasing their KVs from the memory, and restarted (re/filled) later [146]. Due to the low PCIe bandwidth, the released KVs are often recomputed when restarted, instead of o/ffloading to other storage devices and loading back. Multiple requests in either pre/fill or decode steps can be batched to amortize the cost of loading model weights from GPU memory.

Note that the model weights also occupy the GPU memory. When the model size exceeds a single GPU capacity, techniques like model and pipeline parallelism [105, 120, 257] distribute model weights across multiple GPUs. This partitioning introduces data transfer overhead between GPUs.

Target. The audience will understand the KV caching and di/fferent phases of LLM inference requests, and how they compete for the same GPU resource.

2.2.2 LLM Inference Systems: LLMs Behave as DBMSs. LLM inference systems (e.g., /v.scLLM [146]) behave similarly to (in-memory) DBMS. KVs and model weights correspond to the data, which are

maintained in GPU memory. Operators include matrix multiplications, activations, attentions, and data transfers. Compared to OLAP in databases, the operations are simpler yet much more timesensitive, where the requests should be served in real-time.