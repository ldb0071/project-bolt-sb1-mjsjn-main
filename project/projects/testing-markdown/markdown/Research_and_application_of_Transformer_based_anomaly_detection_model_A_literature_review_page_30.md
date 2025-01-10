Page 30

M ( q i , K ) = ln L K ∑ j =1 e q i k T j √ d -1 L K L K ∑ j =1 q i k T j √ d (16)

If the i th query has a larger value M , its attention probability p varies from other parts and, therefore has a high probability of being an important part. Thus, the final ProbSparse self-attention calculation equation is as follows:

A ( Q,K,V ) = Softmax ( QK T √ d ) V (17)

Where Q is a sparse matrix containing top U queries ( u = c × log ln LQ , where C is the control factor)

- · Self-attention distillation technology