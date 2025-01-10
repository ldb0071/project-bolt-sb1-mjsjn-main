Page 16

## Feed-forward and Residual Network

The feed-forward neural network is a neural network with a fully connected structure, which is used to transfer information to the next neural network layer, as shown in equation (5):

FFN ( H ' ) = ReLU ( H ' W 1 + b 1 ) W 2 + b 2 (5)

Where H ' is the output of the previous neural network layer, FFN refers to the Feed-forward neural network. W 1 ∈ R D m × D f , W 2 ∈ R D f × D m , b 1 ∈ R D f , b 2 ∈ R D m are all trainable parameters. In the deeper model, to prevent the information bottleneck, Transformer applies the residual connection modules, as shown in equation (6) and (7):

H ' = LN ( SelfAttn ( X ) + X ) (6)