Page 6

There is a significant spike at index 587 where the value jumps to 187.88, which is much higher than the surrounding values, indicating a potential outlier or anomalous point in the data.

(b) BadThere's a significant spike at index 621, where the value jumps to 69.18, deviating markedly from the range observed in the rest of the series.

<!-- image -->

(c) Hallucination

the YAHOO and IOPS datasets, characterized by a higher incidence of point-based anomalies, but have hallucination when mentioning the indices of the anomalies or the values of the anomalies.

Summary With minimal instructions, GPT-4 often presents as a great explainable time series anomaly detector, sometimes ranking in the top three among various baseline methods. However, detecting longer time series poses significant challenges to GPT-4. While it excels in identifying local and global anomalies, it struggles with more nuanced, context-dependent scenarios and tends to hallucinate about both the anomaly indices and the explanations provided. Conversely, prompt strategies do not benefit LLaMA3, likely due to its smaller size compared to GPT-4. In the next section, we will explore whether LLaMA3's performance can be improved through instruction fine-tuning.

## 5 Can LLMs be Improved via Instruction Fine-tuning?

While GPT-4 can be 'activated" as an effective explainable time series anomaly detector, particularly for shorter time series, LLaMA-3 does not benefit as much from prompt engineering, primarily due to its smaller parameter size. Therefore, we aim to investigate whether LLaMA-3's performance can be improved via fine-tuning. Given the scarcity of time series with anomalies and corresponding textual explanation datasets, we propose a time series and text explanation generator TTGenerator to create the instruction datasets for fine-tuning LLaMA-3.

## 5.1 Time Series and Text Explanation Generator: TTGenerator

Base Time Series Generation Formally, a time series dataset X with T timestamps can be represented as an ordered sequence of data points: X = ( x 1 , x 2 , · · · , x T ) , where x i is the data point at timestamp i ( i ∈ T ). Generally, a time series is viewed as a combination of trend, seasonality, and noise components:

X = s ( T ) + τ ( T ) + ϵ (1)

where s ( · ) represents the base shapelet function approximating the detrended series, which could be a combination of sine and square wave functions, i.e., ∑ n ( A n sin(2 πω n T )) , where A is the amplitude and ω n as the frequency. Alternatively, time series can be generated via Inverse Fast Fourier Transform (IFFT), i.e., ∑ n ( A n exp 2 πωnn N i ) ; τ ( · ) models the overall trend of the series, which could be linear or exponential; and ϵ represents the noises which could be just white noises.