Page 6

distribution p N . We define inexact true positive rate (inexact TPR) as the rate where anomaly score function a ( x ) classifies at least one instance in a random instance set from p S as anomalous:

iTPR( h ) = E B∼ p S   I   ∨ x B i ∈B [ a ( x B i ) > h ) ]     = E B∼ p S [ I (max x B i ∈B a ( x B i ) > h ) ] . (6)

We then define the inexact AUC by the area under the curve of iTPR( h ) as a function of FPR( h ) with different threshold h in a similar way with the AUC (4) as follows:

iAUC = ∫ 1 0 iTPR(FPR -1 ( s )) ds = E B∼ p S , x N ∼ p N [ I (max x B i ∈B a ( x B i ) > a ( x N ))] . (7)

Inexact AUC is the rate where at least one instance in a randomly sampled inexact anomaly set has a higher anomaly score than a randomly sampled non-anomalous instance. When the label information is exact, i.e., every inexact anomaly set B contains only a single anomalous instance, the inexact AUC (7) is equivalent to AUC (4). Therefore, the inexact AUC is a natural extension of the AUC for inexact labels.

Given a set of inexact anomaly sets S = {B k } |S| k =1 , where B k = { x B ki } |B k | i =1 , drawn from p S , and a set of non-anomalous instances N = { x N j } |N| j =1 drawn from p N , we calculate an empirical inexact AUC as follows:

̂ iAUC = 1 |S||N| ∑ B k ∈S ∑ x N j ∈N I [ max x B ki ∈B k a ( x B ki ) > a ( x N j )] . (8)

The maximum operator has been widely used for multiple instance learning methods (Maron and Lozano-P'erez, 1998; Andrews et al., 2003; Pinheiro and Collobert, 2015; Zhu et al., 2017; Feng and Zhou, 2017; Ilse et al., 2018). The proposed inexact AUC can evaluate score functions properly even with class imbalanced data by incorporating the maximum operator into the AUC framework.