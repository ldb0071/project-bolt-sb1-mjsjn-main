Page 14

Figure 6: Details for the requirements for trial cases and general experiments.

<!-- image -->

<!-- image -->

Figure 7: Details for the trial examples used for the case studies for the time series.

|                      | Characteristics                                                                                                                                                                                        | Trial Example   | Values                                                             | Explanation                                                                                                                                                                                                         |
|----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|--------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Global Point Anomaly | Global point anomalies are data points that significantly deviates from the rest of the data in the entire time series.                                                                                |                 | [1, 2, 1, 1, 2,   1, 2, 2, 1, 1,   1, 5, 1, 1, 1,   2, 1, 2, 2, 1] | There is a single anomaly in the time series located at index 11.The reason is the value at index 11 is 5, which stands out significantly from the typical range of values (mostly 1 and 2) observed in the series. |
| Local Point Anomaly  | Local point anomalies are data points that deviate significantly from their surrounding data points but might not be extreme when compared to the entire dataset.                                      |                 | [1, 2, 3, 4, 5,   4, 3, 2, 1, 3,   3, 4, 5, 4, 3,   2, 1, 2, 3, 4] | There are anomalies located at index 9 and 10. The values of 3 at index 9 and 10 are unusual because they don't follow the typical up or down pattern.                                                              |
| Seasonality Anomaly  | and amplitude changes, refer to unexpected variations in the recurring cycles of a time series data, such as shifts in the timing or intensity of seasonal patterns that differ from historical norms. |                 | [1, 2, 3, 4, 5,   4, 3, 2, 1, 2,   3, 4, 5, 4, 3,   2, 1, 5, 1, 5] | The points located at index 17, 18, and 19 are anomalous because they change significantly in period compared to the rest of the time series.                                                                       |
| Trend Anomaly        | A trend anomaly in time series data occurs when there is an unexpected shift or break in the long-term direction or momentum of the data.                                                              |                 | [1, 2, 3, 2, 1,   2, 3, 2, 1, 6,   7, 8, 7, 6, 7,   8, 7, 6, 7, 8] | There is a significant trend change at index 9. The values starting from index 9 can be regarded as anomalies since their values are suddenly changing to higher values.                                            |

## A.5 TTGenerator Details

Base Time Series Generation Generally, a time series is viewed as a combination of trend, seasonality, and noise, as described in equation 1. For the seasonality component, we use one of three methods: i) A single sine wave function, i.e., A sin(2 πωT + β ) , where A is the amplitude (ranging from 1 to 1000), ω is the frequency (ranging from 1 to 10), and β is a phase shift (ranging from 0 to 2 π ). ii) A combination of sine wave functions, i.e., ∑ n ( A n sin(2 πω n T )) , where A n = 1 2 n +1 , following the settings in Lai et al. [2021], and n is randomly sampled in the range of 3 to 10. iii) An IFFT function, i.e., ∑ n ( A n exp 2 πωnn N i ) , where n is randomly selected in the range of 0 to 10. To determine the seasonality for a time series, we randomly sample from these three methods with probabilities [0.25, 0.25, 0.5]. For the trend component, we consider either a linear trend, polynomial trend, or no trend, with sampling probabilities [0.3, 0.1, 0.6], assuming most time series have no trend and more linear trends than polynomial trends. For the linear trend, we randomly sample the slope in

## Linear Trend

- - Increasing: The time series is going with an increasing trend.
- - Decreasing: The time series is going with a decreasing trend.

## Polynomial Trend

- -if min(prime\_gradients) > 0 : This time series shows increasing polynomial trend.
- -if max(prime\_gradients) < 0 : This time series shows decreasing polynomial trend.
- -else : This time series shows polynomial trend.

## Seasonality