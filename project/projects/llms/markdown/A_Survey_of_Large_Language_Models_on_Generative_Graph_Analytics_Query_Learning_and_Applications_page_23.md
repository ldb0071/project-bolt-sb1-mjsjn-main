# Page 23

## Page Information

- **Type**: table_page
- **Word Count**: 614
- **Has Tables**: False
- **Has Figures**: False

## Content

# Page 23

## B. Graph Learning Methods

LLM-GIL studies focusing on graph learning tasks can be categorized into three main groups: LLMs act as enhancers, LLMs act as predictors, and graph prompts. When LLMs act as enhancers, they leverage their advanced semantic understanding of the text, strong reasoning capabilities, and vast knowledge repository to enhance the text attributes associated with nodes in the graph to enhance GNNs. When LLMs act as predictors, LLMs are queried or fine-tuned to predict task results. Inspired by NLP ideas, the Graph prompt aims to create a unified framework capable of solving multiple graph learning tasks. Although LLMs are not used, the concept aligns with LLM-based pipelines.

In summary, integrating LLMs in graph learning tasks presents a promising avenue for advancing the field. By leveraging the strengths of LLMs as enhancers and predictors, along with the strategic use of graph prompts, researchers can explore new directions for enhanced performance and more profound insights in LLM-GIL tasks.

1) LLMs act as enhancers : LLMs act as enhancers pertains to the LLMs-GNNs pipelines, where LLMs assume an enhancer role. Within this framework, LLMs are tasked with processing text attributes, while GNNs are responsible for handling graph structures, capitalizing on the complementary strengths of both components to address graph learning tasks effectively. LLMs bolster GNNs through three distinct mechanisms: encoding the graph into embeddings (as shown in Fig-

Fig. 9: Encoding graph into embeddings, when LLMs act as enhancers. Input the node text attribute into LM/LLM to obtain text embeddings, then combine the text embeddings with the graph structure for training and learning in GNNs.

<!-- image -->

ure 9), generating graph pseudo labels (as shown in Figure 10), and providing external knowledge or explanations (as shown in Figure 11). Subsequently, we will provide a comprehensive elaboration on these three enhancement strategies.

Encoding graph into embeddings. LLMs possess significant semantic comprehension capabilities to encode better node embeddings, as shown in Figure 9. TAPE [30] integrates LM with LLM to generate node embeddings. The process involves fine-tuning two LM models using original node text attributes and LLM explanations for node prediction. The

abels.

learning, as shown in Figure 10. However, the simultaneous training of LLM and GNN poses a significant computational challenge. To bridge this gap, GLEM [31] suggests training the GNN and LM separately in a variational ExpectationMaximization (EM) framework. In the E-step, the LM predicts both gold labels and pseudo-labels from the GNN, while in the M-step, the GNN predicts gold labels and LM-inferred pseudo labels using the embeddings and pseudo-labels provided by the LM.

Providing external knowledge/explanations. Moreover, due to the high cost of annotation and the necessity for GNN to learn from a substantial amount of high-quality labeled data to ensure its performance on graph tasks, leveraging the zero-shot learning capability of LLM becomes advantageous. Therefore, employing LLM for graph annotation can enhance GNN training even with limited labeled data. LLM-GNN [72] proposes to select a candidate node set to be annotated. Subsequently, LLMs annotate the candidate node set, and post-filtering is conducted to eliminate low-quality annotations. Finally, the GNN is trained using the high-quality annotation set and utilized for prediction. LLM-GNN [72] proposes to select a candidate node set for annotation by LLMs, followed by post-filtering to remove lowquality annotations. Then, GNN is trained using high-quality annotations for prediction.

dings. Generating graph pseudo labels. Fig. 10: Generating graph pseudo labels, when LLMs act as enhancers. Input unlabeled nodes into LLM for labeling, then use the labeled nodes with pseudo-labels as input for training the GNNs for graph learning.

<!-- image -->

Providing external knowledge/explanations. Fig. 11: Providing external knowledge/explanations, when LLMs act as enhancers. Two pipelines are shown above. In the first pipeline, input node text attributes into LLM for elaboration, enhancing the detail of the text attributes. In the second pipeline, input node text attributes and designed queries into LLM. LLM leverages the text attributes to answer queries and explains the reasoning process.

<!-- image -->

resulting embeddings are then used as input to train a GNN model for node classification tasks. To unify graph data and graph learning tasks, OFA [32] introduces a comprehensive framework that unifies diverse graph data by describing nodes and edges using natural language and encoding varied and potentially cross-domain text attributes into feature vectors within the same embedding space. The obtained feature vectors are then fed into a GNN to tackle various downstream tasks effectively. Moreover, SIMTEG [71] and GLEM [31] involve training an LM with Lora and subsequently generating embeddings as text representations, then a GNN is trained on top of these text embeddings. On this basis, G-prompt [33] introduces a graph adapter to extract node features, thereby obtaining improved node representations.

Generating graph pseudo labels. Many existing pipelines utilize LLMs to process text attributes as node features, then feed the embeddings produced by LLM into a GNN model for

Providing external knowledge/explanations. LLMs possess a vast knowledge base, enabling them to provide external knowledge or explanations related to node features when encoding them, as shown in Figure 11. The additional knowledge assists the model in better extracting and capturing node features. Graph-LLM [73] utilizes LLMs, such as ChatGPT, to explain text attributes, enhancing them and generating pseudo labels. These enhanced attributes are then fed into a trainable LLM, like Llama, to produce node feature embeddings. The combined pseudo labels and embeddings are input into a GNN, which delivers the final prediction outcomes.

Similarly, TAPE [30] leverages LLMs to provide external explanations. In a citation network where each node contains text attributes like title and abstract, the text attribute of each node serves as input to an LLM. The LLM categorizes the nodes and generates multiple predictions ranked in a list with accompanying reasoning explanations. This approach aims to extract the LLM's reasoning capabilities while integrating external knowledge to aid in understanding node text attributes and extracting node features.

2) LLMs act as predictors. : When LLMs are predictors, they are usually directly employed as standalone predictors. The critical aspect of integrating LLMs as predictors lies in crafting a well-designed prompt that encompasses text attributes and graph structures, enabling LLMs to comprehend the graph structure effectively and enhance prediction accuracy. Additionally, there are other methodologies to finetune LLMs, such as utilizing techniques like LoRA [63] and instruction tuning, aiming to deepen the LLM's understanding of the graph structure. Based on whether LLMs undergo parameter training, they are categorized into prompting LLMs and SFT LLMs, as shown in Figure 12.

Fig. 13: Examples for Node Classification Task with GPT4 Graph Learning Tasks.

<!-- image -->

Manual prompt: The title of one paper is <Title> and its abstract is <Abstract>. This paper is cited by the following papers: <Titlelist1>. Each of these papers belongs to one category in: <Categories>. You need to analyze the paper's topic based on the given title and abstract.

## Visual Content

### Page Preview

![Page 23](/projects/llms/images/A_Survey_of_Large_Language_Models_on_Generative_Graph_Analytics_Query_Learning_and_Applications_page_23.png)
