Page 1

## Anomaly Heterogeneity Learning for Open-set Supervised Anomaly Detection

Jiawen Zhu 1 , Choubo Ding 2 , Yu Tian 3 , and Guansong Pang 1 *

1 School of Computing and Information Systems, Singapore Management University 2 Australian Institute for Machine Learning, University of Adelaide 3 Harvard Ophthalmology AI Lab, Harvard University

## Abstract

Open-set supervised anomaly detection (OSAD) - a recently emerging anomaly detection area - aims at utilizing a few samples of anomaly classes seen during training to detect unseen anomalies ( i.e ., samples from open-set anomaly classes), while effectively identifying the seen anomalies. Benefiting from the prior knowledge illustrated by the seen anomalies, current OSAD methods can often largely reduce false positive errors. However, these methods are trained in a closed-set setting and treat the anomaly examples as from a homogeneous distribution, rendering them less effective in generalizing to unseen anomalies that can be drawn from any distribution. This paper proposes to learn heterogeneous anomaly distributions using the limited anomaly examples to address this issue. To this end, we introduce a novel approach, namely Anomaly Heterogeneity Learning ( AHL ), that simulates a diverse set of heterogeneous anomaly distributions and then utilizes them to learn a unified heterogeneous abnormality model in surrogate open-set environments. Further, AHL is a generic framework that existing OSAD models can plug and play for enhancing their abnormality modeling. Extensive experiments on nine realworld anomaly detection datasets show that AHL can 1) substantially enhance different state-of-the-art OSAD models in detecting seen and unseen anomalies, and 2) effectively generalize to unseen anomalies in new domains. Code is available at https://github.com/mala-lab/AHL.

## 1. Introduction

Anomaly detection (AD) aims at identifying data points that significantly deviate from the majority of the data. It has gained considerable attention in both academic and industry communities due to its broad applications in diverse domains such as industrial inspection, medical imaging,

Figure 1. Current methods vs. our method AHL , where the anomaly samples of the same color indicates that they are treated as from one data distribution. Compared to existing methods that model a homogeneous anomaly distribution in a closed-set environment, AHL simulates a diverse set of heterogeneous anomaly distributions (Sec. 3.2) and learns heterogeneous abnormality from them in a surrogate open environment (Sec. 3.3).

<!-- image -->

and scientific discovery, etc. [33]. Since it is difficult, or prohibitively costly, to collect large-scale labeled anomaly data, most existing AD approaches treat it as a one-class problem, where only normal samples are available during training [2, 4, 9, 10, 14, 18, 25, 26, 36, 40, 41, 46, 48, 49, 55, 59, 61, 63, 64, 66]. However, in many applications there often exist a few accessible anomaly examples, such as defect samples identified in the past industrial inspection and tumor images of past patients. The anomaly examples offer important source of prior knowledge about abnormality, but these one-class-based approaches are unable to use them.