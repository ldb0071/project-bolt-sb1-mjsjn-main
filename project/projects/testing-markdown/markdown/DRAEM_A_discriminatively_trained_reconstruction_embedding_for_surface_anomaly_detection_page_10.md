Page 10

<!-- image -->

with small anomalies visually very similar to the background, which makes the dataset particularly challenging for the unsupervised methods.

DRÆMistrained only on anomaly-free training samples using the same parameters as in previous experiments. The standard evaluation protocol on this dataset [19, 32, 15, 6] is used - the challenge is to classify whether the image contains the anomaly; localization accuracy is not measured, since the anomalies are only coarsely labeled.

Table 4 shows that the best fully supervised methods nearly perfectly classify anomalous images, while the stateof-the-art unsupervised methods like RIAD [31] and US [4] struggle with subtle anomalies on highly textured regions 1 . DRÆM significantly outperforms these methods, and even the weakly supervised CADN [32] by a large margin, obtaining classification performance close to the best fullysupervised methods, which is a remarkable result.

Furthermore, DRÆM outperforms all supervised methods in terms of anomaly localization accuracy on this dataset. Since the training images are only coarsely annotated with ellipses that approximately cover the surface defects and contain background, the supervised methods produce inaccurate localization in test images as well. In contrast, DRÆM does not use the labels at all, and thus produces more accurate anomaly maps, as shown in Figure 11.

<!-- image -->

Table 4. DRÆM outperforms unsupervised methods on DAGM dataset and performs on par with fully supervised ones.

|                     | Methods AUROC   | TPR   | TNR   | CA   |
|---------------------|-----------------|-------|-------|------|
| RIAD [31]           | 78.6            | 79.2  | 69.1  | 70.4 |
| US [4]              | 72.5            | 72.6  | 65.3  | 66.2 |
| MAD[20]             | 82.4            | 78.7  | 85.7  | 66.2 |
| PaDim [11]          | 95.0            | 83.3  | 97.5  | 95.7 |
| DRÆM                | 99.0            | 96.5  | 99.4  | 98.5 |
| CADN [32]           | -               | -     | -     | 89.1 |
| Raˇcki et al . [19] | 99.6            | 99.9  | 99.5  | -    |
| Lin et al . [15]    | 99.0            | 99.4  | 99.9  | -    |
| Boˇziˇc et al . [6] | 100             | 100   | 100   | 100  |

Figure 11. Supervised methods replicate the approximate ground truth training annotations, leading to a low localization accuracy. DRÆM does not use the ground truth, yet produces far better localization.

<!-- image -->

## 5. Conclusion

A discriminative end-to-end trainable surface anomaly detection and localization method DRÆM was presented. DRÆM outperforms the current state-of-the-art on the MVTec dataset [3] by 2 . 5 AUROC points on the surface anomaly detection task and by 13 . 5 AP points on the localization task. On the DAGM dataset [28], DRÆM delivers anomalous image classification accuracy close to fully supervised methods, while outperforming them in localization accuracy. This is a remarkable result since DRÆM is not trained on real anomalies. In fact, a detailed analysis shows that our paradigm of learning a joint reconstruction-anomaly embedding through a reconstructive sub-network significantly improves the results over standard methods and that an accurate decision boundary can be well estimated by learning the extent of deviation from reconstruction on simple simulations rather than learning either the normality or real anomaly appearance.

## References

- [1] Samet Akcay, Amir Atapour-Abarghouei, and Toby P Breckon. GANomaly: Semi-supervised anomaly detection
- via adversarial training. In Asian Conference on Computer Vision , pages 622-637. Springer, 2018. 1, 2, 3, 5
- [2] Samet Akc¸ay, Amir Atapour-Abarghouei, and Toby P Breckon. Skip-GANomaly: Skip connected and adversarially trained encoder-decoder anomaly detection. In 2019 International Joint Conference on Neural Networks (IJCNN) , pages 1-8. IEEE, jul 2019. 1, 2, 3
- [3] Paul Bergmann, Michael Fauser, David Sattlegger, and Carsten Steger. MVTec AD - A Comprehensive Real-World Dataset for Unsupervised Anomaly Detection. In Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition , pages 9592-9600, 2019. 5, 8
- [4] Paul Bergmann, Michael Fauser, David Sattlegger, and Carsten Steger. Uninformed students: Student-teacher anomaly detection with discriminative latent embeddings. In Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition , pages 4183-4192, 2020. 2, 5, 6, 8
- [5] Paul Bergmann, Sindy Lowe, Michael Fauser, David Sattlegger, and Carsten Steger. Improving unsupervised defect segmentation by applying structural similarity to autoencoders. In 14th International Joint Conference on Computer Vision, Imaging and Computer Graphics theory and Applications , volume 5, pages 372-380, 2018. 1, 2, 3, 5, 6
- [6] Jakob Boˇziˇc, Domen Tabernik, and Danijel Skoˇcaj. End-toend training of a two-stage neural network for defect detection. 25th International Conference on Pattern Recognition ICPR , 2020. 6, 7, 8
- [7] Raghavendra Chalapathy, Aditya Krishna Menon, and Sanjay Chawla. Anomaly detection using one-class neural networks. arXiv preprint arXiv:1802.06360 , 2018. 2, 3
- [8] Liang-Chieh Chen, George Papandreou, Florian Schroff, and Hartwig Adam. Rethinking atrous convolution for semantic image segmentation. arXiv preprint arXiv:1706.05587 , 2017. 2
- [9] Mircea Cimpoi, Subhransu Maji, Iasonas Kokkinos, Sammy Mohamed, and Andrea Vedaldi. Describing textures in the wild. In Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition , pages 3606-3613, 2014. 5, 6, 8
- [10] Ekin D Cubuk, Barret Zoph, Jonathon Shlens, and Quoc V Le. Randaugment: Practical automated data augmentation with a reduced search space. In Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition Workshops , pages 702-703, 2020. 3
- [11] Thomas Defard, Aleksandr Setkov, Angelique Loesch, and Romaric Audigier. Padim: a patch distribution modeling framework for anomaly detection and localization. In 1st International Workshop on Industrial Machine Learning, ICPR 2020 , 2020. 2, 5, 6, 8
- [12] Jia Deng, Wei Dong, Richard Socher, Li-Jia Li, Kai Li, and Li Fei-Fei. Imagenet: A large-scale hierarchical image database. In 2009 IEEE conference on computer vision and pattern recognition , pages 248-255. Ieee, 2009. 6, 8
- [13] Ian Goodfellow, Jean Pouget-Abadie, Mehdi Mirza, Bing Xu, David Warde-Farley, Sherjil Ozair, Aaron Courville, and Yoshua Bengio. Generative adversarial nets. In Advances

- in neural information processing systems , pages 2672-2680, 2014. 2
- [14] Tsung-Yi Lin, Priya Goyal, Ross Girshick, Kaiming He, and Piotr Doll'ar. Focal loss for dense object detection. In Proceedings of the IEEE international conference on computer vision , pages 2980-2988, 2017. 3, 4
- [15] Zesheng Lin, Hongxia Ye, Bin Zhan, and Xiaofeng Huang. An efficient network for surface defect detection. Applied Sciences , 10(17):6085, 2020. 8
- [16] Wenqian Liu, Runze Li, Meng Zheng, Srikrishna Karanam, Ziyan Wu, Bir Bhanu, Richard J Radke, and Octavia Camps. Towards visually explaining variational autoencoders. In Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition , pages 8642-8651, 2020. 3
- [17] Wen Liu, Weixin Luo, Dongze Lian, and Shenghua Gao. Future frame prediction for anomaly detection-a new baseline. In Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition , pages 6536-6545, 2018. 5
- [18] Ken Perlin. An image synthesizer. ACMSiggraph Computer Graphics , 19(3):287-296, 1985. 3
- [19] Domen Raˇcki, Dejan Tomaˇzeviˇc, and Danijel Skoˇcaj. A compact convolutional neural network for textured surface anomaly detection. In 2018 IEEE Winter Conference on Applications of Computer Vision (WACV) , pages 1331-1339, 2018. 8
- [20] Oliver Rippel, Patrick Mertens, and Dorit Merhof. Modeling the distribution of normal data in pre-trained deep features for anomaly detection. ICPR , 2020. 2, 5, 8
- [21] Olaf Ronneberger, Philipp Fischer, and Thomas Brox. Unet: Convolutional networks for biomedical image segmentation. In International Conference on Medical image computing and computer-assisted intervention , pages 234-241. Springer, 2015. 2, 3
- [22] Lukas Ruff, Robert Vandermeulen, Nico Goernitz, Lucas Deecke, Shoaib Ahmed Siddiqui, Alexander Binder, Emmanuel Muller, and Marius Kloft. Deep one-class classification. In Proceedings of the 35th International Conference on Machine Learning , volume 80, pages 4393-4402, 2018. 2, 3
- [23] Thomas Schlegl, Philipp Seebock, Sebastian M Waldstein, Georg Langs, and Ursula Schmidt-Erfurth. f-anogan: Fast unsupervised anomaly detection with generative adversarial networks. Medical image analysis , 54:30-44, 2019. 1, 2
- [24] Thomas Schlegl, Philipp Seebock, Sebastian M Waldstein, Ursula Schmidt-Erfurth, and Georg Langs. Unsupervised anomaly detection with generative adversarial networks to guide marker discovery. In International Conference on Information Processing in Medical Imaging , pages 146-157. Springer, 2017. 1, 2, 5
- [25] Yong Shi, Jie Yang, and Zhiquan Qi. Unsupervised anomaly segmentation via deep feature reconstruction. Neurocomputing , 424:9-22, 2021. 2
- [26] Ta-Wei Tang, Wei-Han Kuo, Chien-Fang Lan, Jauh-Hsiang nad Ding, Hakiem Hsu, and Hong-Tsu Young. Anomaly detection neural network with dual auto-encoders gan and its industrial inspection applications. Sensors , 20(12), 2020. 1, 2, 5
- [27] Zhou Wang, Alan C Bovik, Hamid R Sheikh, and Eero P Simoncelli. Image quality assessment: from error visibility to structural similarity. IEEE transactions on image processing , 13(4):600-612, 2004. 3, 6
- [28] M Wieler and T Hahn. Weakly supervised learning for industrial optical inspection, 2007. 7, 8
- [29] Yexin Wu, Yogesh Balaji, Bhanukiran Vinzamuri, and Soheil Feizi. Mirrored autoencoders with simplex interpolation for unsupervised anomaly detection. Proceedings of the European Conference on Computer Vision (ECCV) , 2020. 2
- [30] Jihun Yi and Sungroh Yoon. Patch svdd: Patch-level svdd for anomaly detection and segmentation. In Proceedings of the Asian Conference on Computer Vision , 2020. 3
- [31] Vitjan Zavrtanik, Matej Kristan, and Danijel Skoˇcaj. Reconstruction by inpainting for visual anomaly detection. Pattern Recognition , 2020. 2, 3, 5, 6, 8
- [32] Jiabin Zhang, Hu Su, Wei Zou, Xinyi Gong, Zhengtao Zhang, and Fei Shen. Cadn: A weakly supervised learningbased category-aware object detection network for surface defect detection. Pattern Recognition , 109:107571, 2021. 8