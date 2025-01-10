Page 21

<!-- image -->

As can be seen from Figure 3, DeiT adds a Distillation token based on ViT, which interacts with the class token and patch token of the original ViT in each multihead self-attention (MSA) layer of the Transformer. However, the goal of the class token in ViT is to be consistent with the ground truth label, while the goal of the distillation token is to be consistent with the label predicted by the teacher model. Here, the teacher model is a high-performance classifier, such as a trained CNN model or Transformer model.

The distillation loss in DeiT can be divided into two categories, which are soft distillation loss and hard distillation loss. The equation for soft distillation is as follows:

L softDistill global = (1 -λ ) L CE ( ψ ( Z s ) , y ) + λτ 2 KL ( ψ ( Z s τ ) , ψ ( Z t τ )) (8)

The equation for hard distillation is as follows: