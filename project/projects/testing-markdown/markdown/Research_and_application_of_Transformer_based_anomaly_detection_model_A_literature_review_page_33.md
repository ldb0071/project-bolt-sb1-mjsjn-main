Page 33

Conformer [92] is a model proposed by Google for Automatic Speech Recognition (ASR) tasks. Since Vanilla Transformer is more effective in dealing with long sequence dependencies, while convolution is good at extracting local features, Conformer can improve both the long sequence and local features of the model by applying convolution to the Encoder layer of Transformer. The overall structure of Conformer is shown in Figure 7:

Fig. 7 The overall structure of Conformer

<!-- image -->

Conformer first carries out downsampling through the convolutional network, then passes through several Conformer blocks, each consisting of a FFN , MSA, and convolution module. For the convolution module, a gating mechanism (including point-by-point Convolution and linear gating unit) is first adopted, followed by a onedimensional depth-separated convolution, and Batchnorm is used to help train deeper models. The convolution module can effectively extract local correlation. Finally, the feed-forward module consists of two layers of linear transformation and a nonlinear activation function, with additional use of the pre-norm residual unit and Swish activation function. Therefore, assume that the i th input of the entire layer is ˜ x i , then the output y i is obtained by the following calculation method:

˜ x i = x i + 1 2 FFN ( x i ) (19)