Page 15

Where matrix Q ∈ R N × D k , K ∈ R M × D k , V ∈ R M × D v . N , M represents the length of Q , K , and D k , D V represents the dimension of matrix K , V . The Softmax function is used to compress the operation results into a smaller feature embedding space. Researchers have found that applying multiple attention heads simultaneously to capture different features has better performance [14]. Thus, the calculation method of MHA is shown in equation (4):

MHA ( Q,K,V ) = Concat ( head 1 , head 2 , ..., head H ) W O (4)

Where head i = Attention ( QW Q i , KW K i , V W V i ), MHA represents multi-head attention.

## Self-Attention Layer

The Self-Attention layer applies the MHA mechanism described in section 4.1 to learn the corresponding long-term dependencies. A key factor affecting the ability to learn such dependencies is the path length that forward and backward signals must traverse in the network. The shorter the path between any combination of positions in the input and output sequence, the easier it is to understand the long-term dependencies [14]. LSTM and GRU neural networks lose some memory information when faced with excessively long input sequences, while Transformer's self-attention layer achieves better performance than LSTM and GRU through the MHA mechanism.