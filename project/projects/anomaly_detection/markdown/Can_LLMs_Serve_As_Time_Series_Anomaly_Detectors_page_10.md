Page 10

## A.2 Baselines Settings

IForest[Liu et al., 2008] We use the Scikit-learn implementation 5 with n\_estimators set to 100. Following the approach in Wu et al. [2022], we employ the Fast Fourier Transform to determine the optimal window size for each time series.

Matrix Profile (MP) [Yeh et al., 2016] We use the Stumpy implementation 6 and set the window size for each time series based on the Fast Fourier Transform strategy.

Autoencoder (AE) [Sakurada and Yairi, 2014] Following the parameter settings suggested in Paparrizos et al. [2022], we use three encoder and three decoder layers with ReLU as the activation function. The window size is adjusted to match the length of the test data.

Prophet [Taylor and Letham, 2018] We use the official Facebook implementation 7 and detect anomalies using the forecasted yhat\_upper and yhat\_lower bounds.

LSTM [Malhotra et al., 2015], Informer [Zhou et al., 2021], TimesNet [Wu et al., 2022], and DLinear [Zeng et al., 2023] Implementations are sourced from NeuralForecast 8 . Anomalies are detected by applying the 3σ rule, which flags any data point deviating more than three standard deviations from the mean.

## A.3 Prompt Settings

The prompt we used for inference contains two parts: the instruction part and the requirements part.

Instruction Prompt Figure 5 provides the full details of the instructions for each type of prompt strategy. The example time series used to generate the in-context learning and chain-of-thought

## Directly Use - General Instruction

Given a time series with values { time series values }, consider to identify any potential anomalies.

## Multi-modal Instruction