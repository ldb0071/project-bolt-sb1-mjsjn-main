Page 9

Table 2. This table illustrates the performance improvement on the Ped2 dataset facilitated by the Dynamic Distinction Learning (DDL) approach across two different architectures: UNet and C3DSU.

| Model   |   without DDL |   with SDL |   with DDL |
|---------|---------------|------------|------------|
| UNet    |         86.9  |      95.28 |      97.76 |
| C3DSU   |         95.55 |      97.12 |      98.46 |

As shown in Table 2, the implementation of DDL significantly enhances model performance. For the UNet model, the Area Under the Curve (AUC) score increases from 86.90% without DDL to 95.28% with SDL and further to 97.76% with DDL, underscoring the effectiveness of DDL in enhancing anomaly detection accuracy. The introduction of a static distinction loss already marks a notable improvement, demonstrating the value of integrating anomaly differentiation into the training process. Similarly, the C3DSU model benefits from the addition of DDL, with its AUC score improving from 95.55% to 97.12% with SDL and then to 98.46% . These results highlight the pivotal role of DDL in refining the model's ability to differentiate between normal and anomalous frames, particularly when temporal dynamics are considered. The improvement seen with SDL indicates the initial benefits of incorporating distinction mechanisms, which are significantly amplified upon transitioning to dynamic weighting.

The impact of DDL is also evident in the performance on the Avenue dataset, as depicted in Table 3. The UNet model experiences an improvement in AUC score from 84.18% without DDL to 87.06% with SDL and further to 88.96% with DDL. The introduction of SDL showcases a tangible improvement, setting the stage for the more substantial enhancements afforded by the dynamic approach. The C3DSUmodel, however, showcases a more pronounced improvement, with the AUC score increasing from 82.54% without DDL to 89.41% with SDL and then to 90.35% with DDL. These findings demonstrate the utility of DDL across different architectural frameworks and datasets, especially in scenarios involving complex anomaly patterns. The stepwise enhancements from static to dynamic distinction learning illustrate the methodological progression and its impact on the models' anomaly detection capabilities, highlighting the critical role of adaptively learning the anomaly weight for maximizing detection accuracy.

The ablation studies highlight the incremental value offered by each component of our methodology. The intro-

Table 3. This table presents a comparison of model performance on the Avenue dataset, with and without the incorporation of Dynamic Distinction Learning (DDL), across UNet and C3DSU architectures.

| Model   |   without DDL |   with SDL |   with DDL |
|---------|---------------|------------|------------|
| UNet    |         84.18 |      87.06 |      88.96 |
| C3DSU   |         82.54 |      89.41 |      90.35 |

duction of the distinction loss with a static pseudo anomaly weight significantly improves model performance by explicitly training the model to map pseudo anomalies towards normality. Further refinement is achieved with the implementation of a dynamic anomaly weight, which empowers our methodology to adaptively fine-tune and identify the minimum level of anomaly that can be detected.

## 7. Conclusion

This paper introduced Dynamic Distinction Learning (DDL), a novel approach designed to enhance the accuracy of video anomaly detection through the integration of pseudo-anomalies, dynamic anomaly weighting, and a unique distinction loss function. Our methodological innovation lies in its ability to adaptively learn the variability of normal and anomalous behaviors without relying on fixed anomaly thresholds, thereby significantly improving detection performance.

Our experiments, conducted on benchmark datasets such as Ped2, CUHK Avenue, and ShanghaiTech, have demonstrated the superior performance of the DDL framework. The model achieved remarkable AUC scores, outperforming existing state-of-the-art methods on the Ped2 and Avenue datasets, and delivering competitive results on the ShanghaiTech dataset. These achievements underscore the effectiveness of DDL in addressing the challenges of video anomaly detection, offering a scalable and adaptable solution that can be tailored to specific scene requirements.

The ablation studies further highlighted the impact of incorporating DDL into different model architectures, including UNet and Conv3DSkipUNet (C3DSU). The significant improvements in anomaly detection accuracy with DDL underscore its role in refining models' ability to distinguish between normal and anomalous events effectively, showcasing its broad applicability across different architectural frameworks and complex anomaly patterns.