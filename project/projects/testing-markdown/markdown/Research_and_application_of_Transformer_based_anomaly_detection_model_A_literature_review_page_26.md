Page 26

In Stage 1, similar to ViT, a linear embedding is done first to transform 48 dimensions into C dimensions. So the dimension of the tensor becomes h/ 4 × W/ 4 × C . The tensor is then fed into the Swin-Transformer block, whose structure is shown in Figure 5(b). The first Swin-Transformer block is composed of a window-based MSA with two MLP layers, and the other is composed of a shifted window-based MSA with two MLP layers. It can be seen that the biggest improvement of the SwinTransformer block compared with the Transformer block in ViT is the replacement

of MSA with W-MSA and SW-MSA. MSA in ViT uses a global attention mechanism, which will greatly increase the computational cost in high-resolution images. W-MSA computes self-attention in each window. Assuming that each window contains M × M image patches, the computational volume of MSA and W-MSA can be expressed as:

Ω( MSA ) = 4 hωC 2 +2( hω ) 2 C (10)

Ω( W -MSA ) = 4 hωC 2 +2 M 2 hωC (11)

Although W-MSA reduces the computation, it only has a local receptive field of window size, not the global receptive field of the whole image. Hence, SW-MSA is specifically designed to address this issue. It accomplishes this by employing an attention mechanism that establishes connections between different windows, enabling information exchange. Additionally, SW-MSA introduces connections between adjacent non-coincidence windows in the upper layer through a shifting division of windows. This approach significantly enhances the receptive field, allowing for a broader capture of contextual information. Meanwhile, W-MSA further ensures the constant number of windows by the cycle shift method. Therefore, the computational flow expression of the whole Swin-Transformer Block is as follows: