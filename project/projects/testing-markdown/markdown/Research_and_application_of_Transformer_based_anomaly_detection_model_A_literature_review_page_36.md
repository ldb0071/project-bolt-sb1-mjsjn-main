Page 36

The SSMCTB method proposed by Madan et al. [99] combines Transformer with CNN architecture. The enhanced Transformer Block can be simultaneously applied to multiple downstream tasks including image and video anomaly detection. ITran [100] combines a multi-level feature extractor (ResNet-18 + multi-level jump connections) with Transformer encoder to put the anomaly detection work into the feature space and thus widen the generality gap between the reconstructed and original images. The TransCNN [101] proposed by Ullah et al. utilizes a backbone CNN model to extract spatial features in the video and passes the features from the improved Transformer model to learn the long-term temporal relationships between various complex surveillance events. Kim et al. [102] proposed a composite architecture for unsupervised time series anomaly detection tasks, combining a Transformer encoder with a decoder containing a 1D convolution layer. This architecture is capable of predicting input sequences taking into account both global trends and local variables.

For Conformer and convolutional Transformer models, the key drawback is that the introduction of convolutional operations further increases the complexity of the algorithm. Therefore, optimizing performance and improving efficiency for real-time online detection deployment is the pain point problem that these approaches should address.

## 4.8 Anomaly detection based on Performer

Performer [103] is also designed to improve the performance and running efficiency of the Transformer. But unlike Informer, it does not rely on the sparsity feature of attention or low-rank matrices but uses Fast Attention Via positive Orthogonal

Random features approach (FAVOR+) to reduce the computational complexity to a linear level.