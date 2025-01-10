Page 20

Although ViT has been widely used in various image and video anomaly detection tasks, it still has many limitations. Vanilla Transformer was originally applied to NLP tasks, but the amount of information contained in CV tasks has increased by orders of magnitude compared to NLP tasks (e.g., an 8-megapixel color image contains far more pixel points than a text paragraph consisting of 200 words), so ViT's 'brute force' processing method undoubtedly amplifies the disadvantage of Transformer's performance overhead. In addition, ViT usually processes low-resolution images (e.g., mosaic images with a resolution of 328 × 328) and often requires longer training time to achieve slightly better performance than CNN. Therefore, we believe that research related to anomaly detection based on ViT must solve the above problems to have a high practical application value.

## 4.3 Anomaly detection based on Data-efficient image Transformer (DeiT)

DeiT [38] is further improved based on ViT. Researchers have discovered that ViT demonstrates superior performance compared to traditional neural network architectures like CNN, but primarily on extremely large datasets, such as those consisting of 300 million images. This observation highlights the requirement of a substantial dataset for Transformers to achieve optimal performance and generalization capabilities. Consequently, this limitation hinders the broader application and advancement

of ViT. In contrast, DeiT adopts a better training strategy based on ViT and employs distillation operation to achieve stable training performance while significantly reducing the dataset volume and training time. The structure of DeiT is shown in Figure 3.

Fig. 3 The structure of DeiT model