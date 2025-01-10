Page 13

Fig. 2 Relationship between different Transformer variants

<!-- image -->

correctness of position information. In the Vanilla Transformer, Position Encoding information is achieved by sin and cos function, as shown in equation (1):

⃗ p t = f ( t ) ( i ) = { sin ( ω k · t ) , if ( i = 2 k ); cos ( ω k · t ) , if ( i = 2 k +1) . (1)

After the Position Encoding is calculated by the above equation, it also needs to be added to the model input, as shown in equation (2):