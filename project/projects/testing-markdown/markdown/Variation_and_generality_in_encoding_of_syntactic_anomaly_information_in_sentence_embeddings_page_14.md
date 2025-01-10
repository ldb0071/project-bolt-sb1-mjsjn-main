Page 14

noun or verb in a sentence.

BShift BShift distinguishes whether two consecutive tokens within a sentence have been inverted.

CoordInv CoordInv distinguishes whether the order of two co-ordinated clausal conjoints within a sentence has been inverted.

CoLA CoLA tests detection of general linguistic acceptability in natural occurring corpus, using expert annotations by humans.

## A.6 Description of Encoders

InferSent InferSent is a sentence encoder optimized for natural language inference (NLI), mainly focusing on capturing semantic reasoning information for general use.

Skip-thoughts Skip-thoughts is a sentence encoder framework trained on the Toronto BookCorpus, with an encoder-decoder architecture, to reconstruct sentences preceding and following an encoded sentence.

GenSen GenSen is a general-purpose sentence encoder trained via large-scale multi-task learning. Training objectives include Skip-thoughts, NLI, machine translation, and constituency parsing.

BERT BERT is a deep bidirectional transformer model, pre-trained on tasks of masked language modeling (MLM) and next-sentence prediction (NSP).

RoBERTa RoBERTa is a variant of BERT, and outperforms BERT on a suite of downstream tasks. RoBERTa builds on BERT's MLM strategy, removing BERT's NSP objective, with improved pretraining methodologies, such as dynamically masking. 11

## A.7 Implementation Details

Hyperparameters Dropout rate is set to be 0 . 25 . Batch size is set to be 64. Early stopping is applied. The optimizer is Adam. The learning rate is explored within {0.01, 0.001, 0.0001, 0.00001}. The MLP classifier has one hidden layer of 512 units.

Table 5: Sampled examples for error analysis, along with some basic observed patterns. We list sampled typical examples for which the sentences are false positives exclusively in each of our four tasks. The bold text highlights words or constructions that possibly relate to what we think as cues that trigger our pre-trained classifier to predict the whole sentence as perturbed .