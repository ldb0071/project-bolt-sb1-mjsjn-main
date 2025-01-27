# Page 2

## Page Information

- **Type**: citation_rich
- **Word Count**: 751
- **Has Tables**: False
- **Has Figures**: False

## Content

# Page 2

## I. INTRODUCTION

G AIT recognition is an important biometric technology with various applications ranging from case detection to human-robot interaction. The main idea is to identify a person by his/her distinctive walking style. The gait recognition methods can be classified into two categories; appearance-based [1]-[5] and model-based [6]-[11]. Since the appearancebased methods are more sensitive to the appearance variations, model-based methods have gained more attention recently.

Xiaohu Huang, Xinggang Wang, Zhidianqiu Jin, Bin Feng and Wenyu Liu are with the School of Electronic Information and Communications, Huazhong University of Science and Technology, Wuhan 430074, China. Bo Yang and Botao He are with Wuhan FiberHome Digital Technology Co., Ltd.

- X. Huang(e-mail:huangxiaohu@hust.edu.cn).
- X. Wang(e-mail:xgwang@hust.edu.cn).
- Z. Jin(e-mail:jzdq@hust.edu.cn).
- B. Yang(email: byang@fhzz.com.cn)
- B. He(e-mail:hebotao@fhzz.com.cn)
- B. Feng (e-mail: fengbin@hust.edu.cn). Corresponding author.
- W. Liu(e-mail: liuwy@hust.edu.cn).

Fig. 1: An overview of the proposed idea. First row : CAG takes gait-skeleton sequences as inputs. Second row : CAG automatically generates joint-specific filters for each sequence in both the S (spatial) and T (temporal) domains; thus, it can capture personalized walking styles and extract finegrained patterns. Third row : CAG dynamically learns a viewadaptive topology for each sequence to handle customized gait characteristics across different camera views (Best viewed in color).

<!-- image -->

Among the various model-based methods, the skeleton representation is the most popular because it can be easily used to extract features, and it is consistent with the human body structure.

Graph convolutional networks (GCNs) have been widely applied to achieve impressive results in skeleton-based gait recognition [7], [8], [12]-[15] since they can model inherent correlations between joints. These methods have used standard weight-sharing convolutions to extract the spatial and temporal features of each joint from the sequences. However, personalized gait characteristics exhibit complex patterns of joints. Thus, such uniform feature extraction can only capture a general human walking style but cannot adapt to individual walking styles. Considering that gait is a fine-grained motion pattern, it is essential to distinguish a personalized walking style among different individuals. Therefore, the fixed filters used in the above-mentioned methods limit the flexible and robust modeling ability.

Moreover, the used 2D skeleton structure shows different characteristics for different camera views, making the corresponding topological correlations diverse. Also, current gait methods [7], [8], [12] employ predefined graph topologies, which may not be suitable for all views. Some action recogni-

tion methods [16]-[18] proposed adaptive graphs by learning the correlations between joints dynamically. However, such adaptive graphs were not designed to fit cross-view scenarios. Therefore, current skeleton-based methods do not offer explicit solutions to viewpoint variations. As a consequence, the recognition performance is hindered.

To tackle the above issues, we propose a novel GCN for skeleton-based gait recognition, called condition-adaptive graph ( CAG ) convolution network. The main idea of CAG is to adapt graph convolution learning to suit the variations in personalized walking styles and viewing conditions. As shown in Fig. 1, in CAG, filters are automatically learned to capture personalized walking characteristics using a joint-specific filter learning ( JSFL ) module, and graphs that can handle viewpoint variations are generated using a view-adaptive topology learning ( VATL ) module. These dynamic filters are used to extract fine-grained spatial-temporal patterns of each joint, and the graphs are employed to correlate the joints adaptively, based on the specific viewing condition. Therefore, the JSFL and VATL modules can be seamlessly integrated together in the proposed network.

Specifically, the JSFL module produces filters by encoding joint-level features across the entire sequence. In particular, since different joints correspond to different body parts with various patterns, the network can exploit joint-level feature mining to obtain fine-grained information. The JSFL module constructs two branches, which correspond to model spatial configuration and temporal motion, respectively. This architecture enables the spatial and temporal filters to learn separately. Considering the computational efficiency, all filters are learned in a depth-wise manner.

The VATL module generates view-adaptive topologies by using prior-view knowledge. Specifically, VATL transforms the general fixed view-invariant topology into a set of learnable view-related topologies. It then constructs the viewadaptive topology with the following three components: (1) A topology, which is the most appropriate for the sequence view. (2) A topology, which is a weighted summation of all learnable view-related topologies, enhances its robustness by utilizing the intrinsic correlation of different views. (3) A fixed topology, which represents prior knowledge about the human body structure and has been shown effective in human action recognition [17], [19], [20]. In this way, the learned view-adaptive topology considers specific viewing conditions and incorporates general knowledge about the human body structure.

In summary, the main contributions of this paper include the following three aspects:

- (1) A JSFL module that dynamically generates joint-specific filters tailored to sequence characteristics. In this way, graph convolutions can adapt to personalized walking styles and detailed spatial-temporal patterns can be extracted from each sequence.
- (2) A VATL module that generates a view-adaptive topology, based on specific viewing conditions in each sequence. In this way, graph convolutions can handle the view variations.

- (3) A condition-adaptive graph (CAG) convolutional network is proposed by integrating the JSFL and VATL modules. Extensive experiments conducted on CASIAB [21] and OU-MVLP [11] datasets demonstrate the state-of-the-art performance of CAG. By combining CAG with appearance-based methods, the recognition performance can be effectively improved.

## Visual Content

### Page Preview

![Page 2](/projects/llms/images/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_2.png)
