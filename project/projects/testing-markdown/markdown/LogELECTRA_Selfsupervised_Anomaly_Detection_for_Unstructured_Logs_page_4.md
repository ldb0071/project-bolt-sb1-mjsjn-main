Page 4

The final objective function is the sum of the following MLM objective function for the generator and the RTD objective function for the discriminator.

min θ g , θ d ∑ x ∈X L g ( x , θ g ) + λL d ( x , θ d ) , (4)

where X is a large corpus of raw text and λ is the hyperparameter of the weight coefficient of the objective functions. Note that the generator and the discriminator do not compete as in generative adversarial network (GAN), but rather maximize their likelihood [34].

## B. LogELECTRA

Self-supervised anomaly detection is one of the anomaly detection methods that have attracted attention in recent years and is known to show high performance. LogELECTRA considers RTD, the ELECTRA pre-training method, as selfsupervised learning and utilizes it to detect anomalous logs. This enables LogELECTRA to deeply analyze a single line of a log message and to detect anomalous log lines as point anomalies with high accuracy. LogELECTRA proposed in this paper can be divided into three steps: preprocessing, training, and anomaly score calculation.

In the preprocessing step, the standard NLP steps are performed such as lowercasing, removal of stop words, and replacement of structured data such as numbers, dates, IP addresses, and file paths using regular expressions. Next, we used WordPiece [35] to perform tokenization, a method of separating a piece of text into smaller units called tokens. The tokenizers were trained on a log dataset to ensure that they learn the vocabulary that appears in the log messages of the monitored system. At the time of testing, we used the tokenizers created in training. Thus, our method does not use a log parser, the missing information associated with the preprocessing process is minimal, and the detection performance is independent of the performance of the log parser.

In the training step, LogELECTRA learns the same two Transformers as ELECTRA. The generator and the discriminator are trained by using the normal log dataset after preprocessing. By using only normal log messages for training, the discriminator can correctly identify the context of normal log messages. As a result, the discriminator is expected to judge

Fig. 1. An overview of Replaced Token Detection [17].

<!-- image -->

all tokens as original when normal log messages without token replacement are input to the model. On the other hand, when anomalous log messages are input to the discriminator model, it is expected that some tokens will be judged to have been replaced because anomalous log messages have a different context from normal log messages. In our proposed method, anomaly detection is based on the difference in judgment of this prediction.

In the step of calculating the anomaly score, the degree of anomaly of the log messages input to the discriminator is calculated. The anomaly score is designed to be higher the greater the number of tokens judged by the discriminator to have been replaced in the log message. Let x = [ x 1 , x 2 , . . . , x N ] for a single line of log messages with length N , where x i is each token in the log message. The anomaly score for the log message x is defined as

Score ( x ) = -1 N N ∑ i =1 log(1 -D ( x i )) . (5)

This is the average of the objective function of the discriminator if all tokens are original. This score is expected to be low for normal log messages and high for abnormal log messages. For each log message, an anomaly score is calculated, and the logs that exceed a certain threshold are marked as abnormal.