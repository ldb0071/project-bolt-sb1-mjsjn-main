Page 39

quantized potential projections through VQ-VAE, and subsequently fed into Performer for feature learning. They further extended the details about the experiments in their subsequent work [105].

## 4.9 Anomaly detection based on Set Transformer

Set Transformer [51] is a Transformer model for processing set data with unrelated element order. (instead of Vanilla Transformer's self-attention for sequential data) Set Transformer uses self-attention to process each element in the dataset, which forms a Transformer-like structure for modeling set-type data and can capture pairs or more complex interactions between elements. Given two matrices X,Y ∈ R n × d for representing two sets with N elements, each of which is a d-dimensional vector, then

MAB ( X,Y ) = LayerNorm ( H + rFF ( H )) (27)

Where H = LayerNorm ( X + Multi -head ( X,Y,Y ; ω )). Here, MAB is Multi-head Attention Block. rFF is a layer that operates on a row, applying the same operation to each element. Set Transformer proposes ISAB , which is the optimized version of MAB , by introducing the matrix I ∈ R m × d , we can get