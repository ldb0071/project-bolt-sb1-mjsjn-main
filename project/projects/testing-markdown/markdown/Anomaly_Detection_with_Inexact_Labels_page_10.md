Page 10

- IF is the isolation forest method (Liu et al., 2008), which is a tree-based unsupervised anomaly detection scheme. IF isolates anomalies by randomly selecting an attribute and randomly selecting a split value between the maximum and minimum values of the selected attribute. The number of base estimators was chosen from { 1 , 5 , 10 , 20 , 30 } .
- AE calculates the anomaly score by the reconstruction error with the autoencoder, which is also used with the proposed method. We used the same parameter setting with the proposed method for AE, which is described in the next subsection. Although the model of the proposed method with λ = 0 is the same with that of AE, early stopping criteria were different, where the proposed method used the inexact AUC, and AE used the AUC.

KNN is the k -nearest neighbor method, which classifies instances based on the votes of neighbors. The number of neighbors was selected from { 1 , 3 , 5 , 15 } .

SVM is a support vector machine (Scholkopf et al., 2002), which is a kernel-based binary classification method. We used the RBF kernel, and the kernel hyperparameter was tuned from { 10 -3 , 10 -2 , 10 -1 , 1 } .

RF is the random forest method (Breiman, 2001), which is a meta estimator that fits a number of decision tree classifiers. The number of trees was chosen from { 5 , 10 , 20 , 30 } .

NN is a feed-forward neural network classifier. We used three layers with rectified linear unit (ReLU) activation, where the number of hidden units was selected from { 5 , 10 , 50 , 100 } .

MIL is a multiple instance learning method based on an autoencoder, which is trained by maximizing the inexact AUC. We used the same parameter setting with the proposed method for the autoencoder. The proposed method with λ = ∞ corresponds to MIL.

SIF is a supervised anomaly detection method based on the isolation forest (Das et al., 2017), where the weights of the isolation forest are adjusted by maximizing the AUC.

SAE is a supervised anomaly detection method based on an autoencoder, where the neural networks are learned by minimizing the reconstruction error while maximizing the AUC. We used the same parameter setting with the proposed method for the autoencoder.