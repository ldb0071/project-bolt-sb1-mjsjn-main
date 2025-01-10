Page 5

Figure 3. The anomaly detection process of the proposed method. First anomalous regions are implicitly detected and inpainted by the reconstructive sub-network trained using L rec . The output of the reconstructive sub-network and the input image are then concatenated and fed into the discriminative sub-network. The segmentation network, trained using the Focal loss L focal [14], localizes the anomalous region and produces an anomaly map. The image level anomaly score η is acquired from the anomaly score map.

<!-- image -->

of 3 random augmentation functions sampled from the set: { posterize, sharpness, solarize, equalize, brightness change, color change, auto-contrast } . The augmented texture image A is masked with the anomaly map M a and blended with I to create anomalies that are just-out-ofdistribution, and thus help tighten the decision boundary in the trained network. The augmented training image I a is therefore defined as

I a = M a glyph[circledot] I +(1 -β )( M a glyph[circledot] I ) + β ( M a glyph[circledot] A ) , (4)

where M a is the inverse of M a , glyph[circledot] is the element-wise multiplication operation and β is the opacity parameter in blending. This parameter is sampled uniformly from an interval, i.e., β ∈ [0 . 1 , 1 . 0] . The randomized blending and augmentation afford generating diverse anomalous images from as little as a single texture (see Figure 5).

The above described simulator thus generates training sample triplets containing the original anomaly-free image I , the augmented image containing simulated anomalies I a and the pixel-perfect anomaly mask M a .

## 3.4. Surface anomaly localization and detection

The output of the discriminative sub-network is a pixellevel anomaly detection mask M o , which can be interpreted in a straight-forward way for the image-level anomaly score estimation, i.e., whether an anomaly is present in the image.

First, M o is smoothed by a mean filter convolution layer to aggregate the local anomaly response information. The final image-level anomaly score η is computed by taking the maximum value of the smoothed anomaly score map:

η = max ( M o ∗ f s f × s f ) , (5)

where f s f × s f is a mean filter of size s f × s f and ∗ is the convolution operator. In a preliminary study, we trained a classification network for the image-level anomaly classification, but did not observe improvements over the direct score estimation method (5).