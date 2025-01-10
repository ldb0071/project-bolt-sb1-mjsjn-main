Page 14

ϕ ' ( ω t ) = ϕ ( ω t ) + ⃗ p t (2)

Since it is necessary to ensure correct vector addition, the dimension of the position vector ⃗ p t must be consistent with the input dimension.

## MHA

For each attention head, Query ( Q ), Key ( K ) and Value ( V ) matrices are learnable parameters. Therefore, the scaled dot-product attention defined by Transformer is shown in equation (3):

Attention ( Q,K,V ) = softmax ( QK T √ D k ) V (3)