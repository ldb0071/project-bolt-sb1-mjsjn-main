Page 7

## 4.2 Task

Suppose that we are given a set of inexact anomaly sets S and a set of non-anomalous instances N for training. Our task is to estimate anomaly scores of test instances, which are not included in the training data, so that the anomaly score is high when the test instance is anomalous, and low when it is non-anomalous.

## 4.3 Anomaly scores

For the anomaly score function, we use the following reconstruction error with deep autoencoders:

a ( x ; θ ) = ‖ x -g ( f ( x ; θ f ); θ g ) ‖ 2 , (9)

where f ( · ; θ f ) is an encoder modeled by a neural network with parameters θ f , g ( · ; θ g ) is a decoder modeled by a neural network with parameters θ g , and θ = { θ f , θ g } is the parameters of the anomaly

score function. The reconstruction error of an instance is likely to be low when instances similar to it often appear in the training data, and the reconstruction error is likely to be high when no similar instances are contained in the training data. With the proposed method, we can use other anomaly score functions that are differentiable with respect to parameters, such as Gaussian mixtures (Eskin, 2000; An and Cho, 2015; Suh et al., 2016; Xu et al., 2018), variational autoencoders (Kingma and Wellniga, 2014), energy-based models (Zhai et al., 2016), and isolation forests (Liu et al., 2008).

## 4.4 Objective function