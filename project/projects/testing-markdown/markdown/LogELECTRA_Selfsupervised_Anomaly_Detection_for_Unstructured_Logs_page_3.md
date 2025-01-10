Page 3

## III. PROPOSED METHOD

In this section, we describe our proposed method, LogELECTRA. We also introduce ELECTRA, the method on which LogELECTRA is based.

## A. ELECTRA

ELECTRA is a natural language processing (NLP) model consisting of two Transformers: generator and discriminator) [13], [17]. ELECTRA is pre-trained by a task called Replaced Token Detection (RTD) as shown in Fig.1. In this task, the generator replaces tokens in the sequence, and the discriminator attempts to identify which tokens are replaced by the generator in the sequence. This task replaces Masked Language Modeling (MLM), which is widely used in NLP to train Transformer-based models such as BERT [32]. MLM is a selfsupervised pre-training objective, masking some tokens in the input sequence and predicting the masked tokens. Since RTD pre-training makes predictions for all tokens in a sequence, it is sample-efficient compared with MLM pre-training, which only makes predictions for a subset of the tokens in a sequence. For the same computational complexity, the pre-training model with RTD has been shown to significantly outperform that with MLM in terms of the GLUE score [33].

The generator is a small Transformer model and is trained by MLM. It receives masked sequences with some tokens replaced by a special token, [MASK]. The generator attempts to recover the original tokens in the masked index, but since the generator has only a small number of parameters, token recovery is not always successful. This incorrect restoration of the masked token is used as a token replacement. Let x = [ x 1 , x 2 , . . . , x N ] be the input sequence of length N and replace k of these tokens with [MASK]. Denoting the masked sequence as x masked and the masked indices as m i ( i = 1 . . . k ) , the objective function for the generator is as follows.

L g ( x , θ g ) = E ( -k ∑ i =1 log p G ( x m i | x masked ) ) , (1)

where θ g is the parameter of generator and p G ( x i | x masked ) represents the probability that token x i is predicted by the generator.

The discriminator is a Transformer model and receives the sequences x corrupt , where the masked part is replaced by the token predicted by the generator. Then, for each token, the discriminator predicts whether the token is the original or a replacement. Let h d ( x ) be the output of the hidden layer of

the discriminator and w be the parameter of the sigmoid layer, the objective function for the discriminator is as follows.

D ( x i ) = sigmoid( w T h d ( x ) i ) , (2)

̸

L d ( x , θ d ) = E ( N ∑ i =1 -✶ ( x corrupt i = x i ) log( D ( x corrupt i )) -✶ ( x corrupt i = x i ) log(1 -D ( x corrupt i )) ) , (3)

where θ g is the parameter of discriminator and ✶ is an indicator function, a binary function that returns 1 if the condition is satisfied and 0 otherwise.