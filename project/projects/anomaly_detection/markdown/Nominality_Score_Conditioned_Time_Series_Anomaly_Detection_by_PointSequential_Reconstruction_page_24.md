## A The Best F1 Score

This section describes the method for calculating the best F1 score ( F1 ∗ ) from a set of anomaly scores a = { a 1 , ..., a T } and a set of labels y = { y 1 , ..., y T } . Firstly, given a and some arbitrary threshold θ a , we can calculate ˆ y = { ˆ y 1 , ... ˆ y T } , where ˆ y t ≜ ✶ a t ≥ θ a . Secondly, ˆ y is used to calculate TP , FP , and FN , which corresponds to the sets of time points for true positives, false positives, and false negatives.

TP ≜ { t | ˆ y t = 1 , y t = 1 } , FP ≜ { t | ˆ y t = 1 , y t = 0 } , FN ≜ { t | ˆ y t = 0 , y t = 1 } (17)

Thirdly, we calculate the precision ( P ) and recall ( R ), and then calculate the F1 score, which is the harmonic mean between R and P .

F1 ≜ 2PR P+R , P ≜ n(TP) n(TP) + n(FP) , R ≜ n(TP) n(TP) + n(FN) (18)

Finally, we calculate F1 ∗ by using the threshold that yields the highest F1 .

F1 ∗ ( a ; y ) ≜ max θ a F1(ˆ y ( a , θ a ); y ) (19)

## B Model Architecture

Performers (an improved variant of Transformers) are competitive in terms of execution speed compared with other Transformer variants [34, 43], hence we use them as the basic building block of our models. For both M pt and M seq , we use a linear layer with input and output dimensions equal to D as the token embedding layer, a fixed positional embedding layer at the beginning, a feature redraw interval of 1, and a tanh activation function immediately before the output. GELUs [44] are used as the activation layer for all linear layers. We do not change any other predefined activation layer inside Performers.