## Nominality Score Conditioned Time Series Anomaly Detection by Point/Sequential Reconstruction

## Chih-Yu Lai ∗

Department of EECS, MIT Cambridge, MA 02139 chihyul@mit.edu

Fan-Keng Sun

Department of EECS, MIT Cambridge, MA 02139 fankeng@mit.edu

## Jeffrey H. Lang

Department of EECS, MIT Cambridge, MA 02139 lang@mit.edu

Zhengqi Gao Department of EECS, MIT Cambridge, MA 02139 zhengqi@mit.edu

## Duane S. Boning

Department of EECS, MIT Cambridge, MA 02139 boning@mtl.mit.edu

## Abstract

Time series anomaly detection is challenging due to the complexity and variety of patterns that can occur. One major difficulty arises from modeling time-dependent relationships to find contextual anomalies while maintaining detection accuracy for point anomalies. In this paper, we propose a framework for unsupervised time series anomaly detection that utilizes point-based and sequence-based reconstruction models. The point-based model attempts to quantify point anomalies, and the sequence-based model attempts to quantify both point and contextual anomalies. Under the formulation that the observed time point is a two-stage deviated value from a nominal time point, we introduce a nominality score calculated from the ratio of a combined value of the reconstruction errors. We derive an induced anomaly score by further integrating the nominality score and anomaly score, then theoretically prove the superiority of the induced anomaly score over the original anomaly score under certain conditions. Extensive studies conducted on several public datasets show that the proposed framework outperforms most state-of-the-art baselines for time series anomaly detection.