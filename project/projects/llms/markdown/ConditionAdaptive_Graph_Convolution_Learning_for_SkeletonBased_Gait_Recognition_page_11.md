# Page 11

## Page Information

- **Type**: citation_rich
- **Word Count**: 851
- **Has Tables**: False
- **Has Figures**: False

## Content

# Page 11

## D. View-Adaptive Topology Learning

The VATL module utilizes the intrinsic view information in each sequence to learn a view-adaptive topology. As shown in Fig. 4, the original gait sequence I is obtained as an input. First, we apply an embedding module to extract viewrelated features, and then use GAP to aggregate the global view information. Next, a fully-connected layer is employed to obtain the view-classification vector f v ∈ R K V , where K V denotes the number of views (e.g., 11 in CAISA-B [21] and 14 in OU-MVLP [11]). Here, the cross-entropy loss on f v , which produces a loss L view CE , is used to supervise feature learning. This ensures view prediction ability. Subsequently, a SoftMax function is employed to produce a value-normalized vector ˜ f v ∈ R K V .

A set of learnable topologies G set = { G 1 V , G 2 V , ..., G K V V } is defined to enhance the view-adaptive capacity, where G i V ∈

R K S × N × N denotes the corresponding topology obtained from the i -th view. To generate the view-adaptive topology G V A , we first obtain the index of the maximum value in ˜ f v , which is formulated as:

id v = arg max ˜ f v , (7)

where id v indicates the view that the sequence most possibly encounters. Then, the corresponding topology is selected from G set by id v as follows:

G 1 = G set [ id v ] , (8)

where G 1 reflects the particular properties that the corresponding view possesses. On the test sets of CASIA-B and OU-MVLP datasets, we achieve top-1 view-classification accuracies of 98.5% and 98.7%, respectively, which are quite reliable. Therefore, for each sequence, given the predicted view-classification result, we can accurately select the adaptive topology for the corresponding view. Considering that the topology is initialized as learnable parameters, it can be updated to adapt to the view characteristics through the backward propagation technique. However, G 1 is not sufficient to represent all types of intra-variation existing in this view; thus, we introduce a supplementation. Considering that the data distribution in ˜ f v reveals the sequence characteristics to some extent, we consider the data as linear weights to combine the topologies in G set . This can be formulated as follows:

G 2 = K V ∑ i =1 ˜ f i v G i V , (9)

Also, we use a fixed topology G 3 , which is an ordinary graph in Eq. (1) to extract the general feature representation. Finally, we fuse G 1 , G 2 and G 3 with coefficients g 1 , g 2 and g 3 to obtain G V A :

G V A = g 1 G 1 + g 2 G 2 + g 3 G 3 . (10)

G V A is used to dynamically connect body joints in the graph convolutions, which not only correlate joints in the nearby locations but also incorporate joint information in the long range. The dynamic complex connections can effectively enhance the adaptation ability in cross-view scenarios.

## Visual Content

### Page Preview

![Page 11](/projects/llms/images/ConditionAdaptive_Graph_Convolution_Learning_for_SkeletonBased_Gait_Recognition_page_11.png)
