Page 10

Finally, the Upsampling module is trained. After the anomaly detection network has been trained, images with copy-pasted smudges are generated and the low-resolution anomaly masks are computed as detection network outputs. Since the full-resolution masks are known from the smudge pasting on the original image, the upsampling network can be trained with a focal loss.

## 4 Experiments

## 4.1 Implementation details

In the first training stage (Section 3.7) quantized latent space encoder, general object appearance decoder and the latent vector codebook are trained for image reconstruction on ImageNet [8] for 200 , 000 iterations with a batch size of 32 and a learning rate of 0 . 0002. The codebooks K hi and K lo each contain 4096 latent vectors of dimension 128. In the second training stage (Section 3.7) the object-specific appearance decoder and the anomaly detection model are trained for 100 , 000 iterations with a batch size of 8 with a learning rate of 0 . 0002. The learning rate is decreased by a factor of 10 after 80 , 000 iterations. The λ 2 and λ 3 values in Eq.3 are set to 1 and 10, respectively. In the third stage the Upsampling module is then trained for 20 , 000 iterations with a learning rate of 0 . 0002 and a batch size of 8. The training hyperparameters and network architectures remain constant throughout our experiments.

## 4.2 Experimental results on KSDD2

The recently proposed KSDD2 [6] surface anomaly detection dataset is currently the most challenging dataset with near-in-distribution surface anomalies (see Figure 6). KSDD2 was acquired on real industrial production lines and contains a wide variety of anomalies, many of which are particularly challenging due to their similarity to the normal appearances in the training set.

The dataset contains 2085 anomaly-free and 246 anomalous training images to test anomaly detection under unsupervised and supervised setups. For example, in the unsupervised setup, only anomaly-free training images may be