Page 16

det

0.01 0.02 0.05 0.1

0.2

0.5

97.5 98.0 98.2 97.7 97.1 95.5

Table 5. Results on MVTec using various similarity bound λ s values.

Reconstruction loss components. Table 6(c) shows the impact of individual reconstruction loss components of Eq. (3), where the reconstruction is conditioned both on the feature L feat and image L img reconstruction losses, which are the second and the third components in Eq. (3), respectively. During training DSR L img uses only the image reconstruction loss and DSR L feat uses only the feature reconstruction loss. There is a significant loss in performance when using only individual loss components. Relying on both image and feature reconstruction losses during training results in a more robust normality reconstruction model leading to a 2 p.p. higher average image-level AUROC as well as significantly higher localization AP scores.

Upsampling module Table 6(d) shows the effect of removing the Upsampling module of the network, leading to a drop in localization performance. The anomaly detection performance remains the same as the image-level score is extracted from the lower resolution output anomaly map M .

## 5 Conclusion

We proposed DSR, a discriminative surface anomaly detection method based on dual image reconstruction branch architecture with discretized latent representation. Such representation allows controlled generation of synthetic anomalies in feature space, which, in contrast to the state-of-the-art methods that generate anomalies in image space, makes no assumption about the anomaly ap-

Table 6. Ablation study results on MVTec: (a) using out-of-distribution texturebased anomalies (DSR img ) in training; (b) unconstrained uniform anomaly sampling (DSR random ); (c) training with only image reconstruction loss (DSR L img ) and with only the feature reconstruction loss (DSR L feat ); (d) Performance without the Upsampling module (DSR U -).

|                    | (a)   |         | (b)    | (c)       |            | (d)     |
|--------------------|-------|---------|--------|-----------|------------|---------|
| Experiment DSR DSR |       | img DSR | random | DSR L img | DSR L feat | DSR U - |
| AUROC det          | 98.2  | 97.8    | 95.6   | 96.3      | 95.2       | 98.2    |
| AP loc             | 70.2  | 67.5    | 62.5   | 67.0      | 61.8       | 65.2    |

pearance and does not rely on image-level heuristics. Our anomaly generation approach produces near-in-distribution synthetic anomalies resulting in more robustly trained reconstruction capabilities and detection of anomalies whose appearance is close to the normal appearance.

On the recent challenging real-world KSDD2 dataset [6], it outperforms all other unsupervised surface anomaly detection methods by 10% AP in anomaly detection and 35% AP in anomaly localization tasks. DSR also significantly outperforms the weakly-supervised model presented in [6]. Moreover, we showed that the proposed approach can be extended to utilise also pixel-wise annotated anomalous training samples. When used in such supervised settings, it considerably improves the results of related supervised methods [6] when only a few annotated examples are available. This demonstrates the potential of DSR to be used in real-world settings where the number of available anomalous images is typically too low to train fully supervised methods. DSR also achieves state-ofthe-art results on the standard MVTec anomaly detection dataset [3].

The ablation study shows that the sampling method used for anomaly generation impacts the final anomaly detection results significantly, which suggests that a more complex feature sampling method may improve results further, which we leave for our future research endeavours.

In addition to it's good performance across several tasks and it's ability to utilize anomalous training samples that are available in some practical scenarios, DSR is fast, running at 58 FPS, making it a good choice for real-world industrial applications with real-time requirements.

Acknowledgement This work was supported by Slovenian research agency programs J2-2506, L2-3169, P2-0214. Vitjan Zavrtanik was supported by the Young researcher program of the ARRS.

## References

- 1. Akcay, S., Atapour-Abarghouei, A., Breckon, T.P.: GANomaly: Semi-supervised anomaly detection via adversarial training. In: Asian Conference on Computer Vision. pp. 622-637. Springer (2018)
- 2. Ak¸cay, S., Atapour-Abarghouei, A., Breckon, T.P.: Skip-GANomaly: Skip connected and adversarially trained encoder-decoder anomaly detection. In: 2019 In-

- ernational Joint Conference on Neural Networks (IJCNN). pp. 1-8. IEEE (jul 2019)
- 3. Bergmann, P., Fauser, M., Sattlegger, D., Steger, C.: MVTec AD - A Comprehensive Real-World Dataset for Unsupervised Anomaly Detection. In: Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition. pp. 9592-9600 (2019)
- 4. Bergmann, P., Fauser, M., Sattlegger, D., Steger, C.: Uninformed students: Student-teacher anomaly detection with discriminative latent embeddings. In: Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition. pp. 4183-4192 (2020)
- 5. Bergmann, P., Lowe, S., Fauser, M., Sattlegger, D., Steger, C.: Improving unsupervised defect segmentation by applying structural similarity to autoencoders. In: 14th International Joint Conference on Computer Vision, Imaging and Computer Graphics theory and Applications. vol. 5, pp. 372-380 (2018)
- 6. Boˇziˇc, J., Tabernik, D., Skoˇcaj, D.: Mixed supervision for surface-defect detection: from weakly to fully supervised learning. Computers in Industry 129 , 103459 (2021)
- 7. Defard, T., Setkov, A., Loesch, A., Audigier, R.: Padim: A patch distribution modeling framework for anomaly detection and localization. In: International Conference on Pattern Recognition. pp. 475-489. Springer (2021)
- 8. Deng, J., Dong, W., Socher, R., Li, L.J., Li, K., Fei-Fei, L.: Imagenet: A largescale hierarchical image database. In: 2009 IEEE conference on computer vision and pattern recognition. pp. 248-255. Ieee (2009)
- 9. Esser, P., Rombach, R., Ommer, B.: Taming transformers for high-resolution image synthesis. In: Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR). pp. 12873-12883 (June 2021)
- 10. Lei, L., Sun, S., Zhang, Y., Liu, H., Xu, W.: PSIC-Net: Pixel-wise segmentation and image-wise classification network for surface defects. Machines 2021 9 , 221 (2021). https://doi.org/10.3390/MACHINES9100221, https://www.mdpi. com/2075-1702/9/10/221/htmhttps://www.mdpi.com/2075-1702/9/10/221
- 11. Li, C.L., Sohn, K., Yoon, J., Pfister, T.: Cutpaste: Self-supervised learning for anomaly detection and localization. In: Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition. pp. 9664-9674 (2021)
- 12. Lv, C., Shen, F., Zhang, Z., Xu, D., He, Y.: A novel pixel-wise defect inspection method based on stable background reconstruction. IEEE Transactions on Instrumentation and Measurement 70 , 1-13 (2021). https://doi.org/10.1109/TIM.2020.3038413
- 13. van den Oord, A., Vinyals, O., kavukcuoglu, k.: Neural discrete representation learning. In: Guyon, I., Luxburg, U.V., Bengio, S., Wallach, H., Fergus, R., Vishwanathan, S., Garnett, R. (eds.) Advances in Neural Information Processing Systems. vol. 30, pp. 6306-6315. Curran Associates, Inc. (2017), https://proceedings.neurips.cc/paper/2017/file/ 7a98af17e63a0ac09ce2e96d03992fbc-Paper.pdf
- 14. Perlin, K.: An image synthesizer. ACM Siggraph Computer Graphics 19 (3), 287296 (1985)
- 15. Ramesh, A., Pavlov, M., Goh, G., Gray, S., Voss, C., Radford, A., Chen, M., Sutskever, I.: Zero-shot text-to-image generation. arXiv preprint arXiv:2102.12092 (2021)
- 16. Razavi, A., van den Oord, A., Vinyals, O.: Generating diverse high-fidelity images with vq-vae-2. In: Wallach, H., Larochelle, H., Beygelzimer, A., d ' Alch'e-Buc, F.,

- Fox, E., Garnett, R. (eds.) Advances in Neural Information Processing Systems. vol. 32, pp. 14866-14876. Curran Associates, Inc. (2019), https://proceedings. neurips.cc/paper/2019/file/5f8e2fa1718d1bbcadf1cd9c7a54fb8c-Paper.pdf
- 17. Rippel, O., Mertens, P., Merhof, D.: Modeling the distribution of normal data in pre-trained deep features for anomaly detection. ICPR (2020)
- 18. Schlegl, T., Seebock, P., Waldstein, S.M., Langs, G., Schmidt-Erfurth, U.: f-anogan: Fast unsupervised anomaly detection with generative adversarial networks. Medical image analysis 54 , 30-44 (2019)
- 19. Shi, Y., Yang, J., Qi, Z.: Unsupervised anomaly segmentation via deep feature reconstruction. Neurocomputing 424 , 9-22 (2021)
- 20. Wang, Z., Bovik, A.C., Sheikh, H.R., Simoncelli, E.P.: Image quality assessment: from error visibility to structural similarity. IEEE transactions on image processing 13 (4), 600-612 (2004)
- 21. Zavrtanik, V., Kristan, M., Skoˇcaj, D.: Draem - a discriminatively trained reconstruction embedding for surface anomaly detection. In: Proceedings of the IEEE/CVF International Conference on Computer Vision (ICCV). pp. 8330-8339 (October 2021)
- 22. Zavrtanik, V., Kristan, M., Skoˇcaj, D.: Reconstruction by inpainting for visual anomaly detection. Pattern Recognition 112 , 107706 (2021). https://doi.org/https://doi.org/10.1016/j.patcog.2020.107706, https://www.sciencedirect.com/science/article/pii/S0031320320305094