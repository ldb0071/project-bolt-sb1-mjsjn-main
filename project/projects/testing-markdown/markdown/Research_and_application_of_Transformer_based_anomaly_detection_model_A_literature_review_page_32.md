Page 32

The performance optimization of Informer has led researchers to apply it to anomaly detection tasks. Guo et al. [41] pointed out three performance advantages of the Informer structure in the electrical line trip fault prediction task, that is,

- · The ProbSparse self-attention block has a good performance on sequential alignment;
- · The self-attention distilling draws the main attention by halving the cascading layer to handle long input sequences efficiently;
- · The generative style decoder predicts the long time-series sequence at one forward operation, which drastically improves the inference speed of the long-sequence output.

The GC method improves the training process compared to the Adam optimizer, and the projection gradient descent method with constrained loss function enables more efficient and stable training, further exploiting the performance advantages of Informer. TiSAT [91] feeds a set of nominal historical observations into the Informer for training in an offline manner, and passes in the observations during testing until changes relative to the nominal baseline are detected.

However, in extreme cases, Informer can also suffer from performance degradation. Therefore, researchers should carefully deliberate whether specific task requirements are applicable to the Informer model when performing transfer learning tasks.

## 4.7 Anomaly detection based on Conformer & Convolutional Transformer