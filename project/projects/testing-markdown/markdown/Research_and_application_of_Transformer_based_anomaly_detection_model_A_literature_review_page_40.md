Page 40

ISAB m ( X ) = MAB ( X,H ) ∈ R n × d (28) m × d .

Where H = MAB ( I, X ) ∈ R

The process is essentially a projection of X into a lower dimensional space H and then performs a reconstruction output of the higher-dimensional space. For the Decoder of Set Transformer, the equation is as follows:

H = SAB ( PMA k ( Z )) (29)

Where PMA is Pooling by MHA and S ∈ R ( k × d ) , which is to aggregate multiple features. After pooling, the relationship between K outputs can be modeled through SAB . Therefore, the entire Encoder and Decoder can be represented by the following equation: