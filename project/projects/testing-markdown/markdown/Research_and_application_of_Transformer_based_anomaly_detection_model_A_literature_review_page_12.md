Page 12

In this paper, we divide the research in this area into anomaly detection based on Vanilla Transformer, anomaly detection based on Transformer variants, and anomaly detection based on hybrid methods. (Note: Hybrid methods refer to the combination of Transformer or attention mechanism with other methods, such as Transformer + GAN, Transformer + VAE, attention + LSTM, etc.) The relationship between various Transformer variants is shown in Figure 2. We provide a concise overview of the operation principle of each Transformer variant model, analyzing their respective advantages and shortcomings.

## 4.1 Anomaly detection based on Vanilla Transformer

Google first proposed the Vanilla Transformer [14] in 2017 as the basis for many subsequent variants, whose core is mainly composed of Position Encoding, Multihead Attention (MHA) mechanism, Self-Attention Layer, Feed-Forward and Residual Network.

## Position Encoding

Since Transformer does not have a linear input/output structure like LSTM and RNN neural networks, Position Encoding is introduced in Transformer to ensure the