Page 53

|   No. | Authors          | Index              |
|-------|------------------|--------------------|
|     1 | kozik [68]       | Pre,Rec,F1         |
|     2 | Zhang [3]        | Acc,Pre,Rec,F1,ROC |
|     3 | Han [4]          | Pre,Rec,F1,AUC     |
|     4 | Wittkopp [46]    | Pre,Rec,F1         |
|     5 | Mori [124]       | AUC                |
|     6 | Liu [125]        | AUC,ROC            |
|     7 | Xu [47]          | Pre,Rec,F1,AUC,ROC |
|     8 | Unal [116]       | Pre,Rec,F1         |
|     9 | Feng [48]        | AUC,ROC            |
|    10 | Li [49]          | ROC,F1             |
|    11 | Guo [76]         | Pre,Rec,F1         |
|    12 | Stowell [93]     | AUC,pAUC(part AUC) |
|    13 | Tajiri [50]      | ROC                |
|    14 | Xu [33]          | Pre,Rec,F1         |
|    15 | Pirnay [127]     | AUC,ROC            |
|    16 | Lee [52]         | F1,ROC             |
|    17 | Chen [54]        | Pre,Rec,F1         |
|    18 | Wibisono [75]    | Pre,Rec,F1         |
|    19 | Zhang [53]       | Pre,Rec,F1         |
|    20 | Wang [34]        | Pre,Rec,F1         |
|    21 | Le [35]          | Pre,Rec,F1         |
|    22 | Li [128]         | Pre,Rec,F1,ACC     |
|    23 | Wrust [80]       | AUC                |
|    24 | Koner [37]       | ROC                |
|    25 | Yu [39]          | ACC,ROC,TPR        |
|    26 | Nedelkoski [132] | ACC,Pre,Rec,F1     |
|    27 | Yella [94]       | ROC                |
|    28 | Hirakawa [113]   | ROC,F1             |
|    29 | Meng [6]         | Pre,Rec            |
|    30 | Lee [122]        | F1                 |
|    31 | Yuan [134]       | AUC                |
|    32 | Guo [63]         | Pre,Rec,F1         |
|    33 | Zhao [44]        | Pre,Rec,F1,ACC,FPR |
|    34 | Schneider [57]   | AUC,ROC            |
|    35 | Zhang [135]      | Pre,Rec,F1         |

However, some researchers believe that the above mainstream evaluation indexes have drawbacks and deficiencies, and cannot effectively measure the anomaly detection

performance of the model. Lobo et al. [153] pointed out many problems in ROC/AUC indexes. Therefore, some authors put forward improvement schemes based on the above evaluation indexes, or use variants of them. You et al. [110] used the Mean Average Precision evaluation index ( MAP ), as well as Recall @ k and AUC . MAP is defined as:

MAP = 1 m ∑ m i =1 | anomalies above or at a i | P ( a i ) (40)

Where m is the total number of anomalies, a i represents the i th anomaly, which is the descending order of Euclidean distance to the center point, and P ( a i ) is the position of the i th anomaly in all test examples.