Page 5

Given sets of anomalous instances A = { x A i } |A| i =1 drawn from p A and non-anomalous instances N = { x N j } |N| j =1 drawn from p N , an empirical AUC is calculated by

̂ AUC = 1 |A||N| ∑ x A i ∈A ∑ x N j ∈N I ( a ( x A i ) > a ( x N j )) , (5)

where |A| represents the size of set A .

## 4 Proposed method

## 4.1 Inexact AUC

Let B = { x B i } |B| i =1 be a set of instances drawn from probability distribution p S , where at least one instance is drawn from anomalous distribution p A , and the other instances are drawn from non-anomalous

Table 1: Our notation

| Symbol    | Description                                                                              |
|-----------|------------------------------------------------------------------------------------------|
| S         | set of inexact anomaly sets, {B k } |S| k =1                                             |
| B k       | k th inexact anomaly set, where at least one instance is anomaly, { x B ki } |B k | i =1 |
| A         | set of anomalous instances, { x A i } |A| i =1                                           |
| N a ( x ) | set of non-anomalous instances, { x N j } |N| j =1 anomaly score of instance x           |