Page 31

The self-attention distillation can reduce the network parameters and 'distill' the outstanding features as the number of stacked layers increases. The operational distillation equation from layer J to layer J +1 is as follows:

X t j +1 = MaxPool ( ELU ( Conv 1 d ([ x t j ] AB ))) (18)

The operation of distillation here is slightly different from DeiT. It mainly uses 1D convolution and maximum pooling to build dimension and reduce memory usage before sending the output of the previous layer to the MHA module.

- · Generative Decoder

The structure of the generative decoder deviates from the standard decoder of Vanilla Transformer. Rather than following the conventional step-by-step approach, the generative decoder directly produces multi-step predictions in a single step. To achieve this, the output of the generative decoder is connected to a fully connected layer. The size of the output depends on whether univariate or multivariate prediction is needed.