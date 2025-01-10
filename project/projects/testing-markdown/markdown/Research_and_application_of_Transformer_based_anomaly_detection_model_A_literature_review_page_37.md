Page 37

Performer first modifies the attention calculation method in Transformer and adopts another equivalent expression, as shown in the following equation:

Att ( Q,K,V ) = D -1 AV (23)

Where A = exp ( QK T / √ d ), D = diag ( A 1 L ). diag is the operation of converting to diagonal matrix, 1 L is a vector with length L of all 1s. Performer then introduces the kernel technique to approximate the attention matrix A . For any vector q i and k j in matrix Q and matrix K , the kernel method is computed as:

K ( x, y ) = E [ ϕ ( x ) T ϕ ( y )] (24)

Where ϕ is a mapping from D to R dimensions. Therefore the key problem is finding a mapping of the function ϕ to reduce the computational complexity. In Performer, the function mapping ϕ is further defined as follows: