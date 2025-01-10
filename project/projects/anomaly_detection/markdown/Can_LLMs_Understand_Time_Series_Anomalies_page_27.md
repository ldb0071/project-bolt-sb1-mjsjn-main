Page 27

| 1:          | for each dataset type do                                                             |
|-------------|--------------------------------------------------------------------------------------|
| 2:          | if multivariate data needed then                                                     |
| 3:          | Randomly select sensors to contain anomalies based on the ratio of anomalous sensors |
| 4:          | end if                                                                               |
| 5:          | for each selected sensor do                                                          |
| 6:          | Generate normal intervals using an exponential distribution with the normal rate     |
| 7:          | Generate anomaly intervals using an exponential distribution with the anomaly rate   |
| 8:          | Ensure minimum durations for both normal and anomaly intervals                       |
| 9:          | Apply the appropriate anomaly type to the anomaly intervals:                         |
| 10:         | if anomaly type is point or range then                                               |
| 11:         | Simulate the full time series                                                        |
| 12:         | Directly replace the normal data by the anomaly data / inject noise                  |
| 13:         | else if anomaly type is trend or frequency then                                      |
| 14:         | Simulate region by region to ensure continuity                                       |
| 15:         | end if                                                                               |
| 16:         | end for                                                                              |
| 17:         | Record the start and end points of each anomaly interval as ground truth             |
| 18: end for | 18: end for                                                                          |

## 7. NOISY FREQUENCY ANOMALIES

Similar to Frequency Anomalies, but with added noise to the normal data.

## · Statistics:

- -Average anomaly ratio: 0.0359
- -Number of time series without anomalies: 51 (12.75%)
- -Average number of anomalies per time series: 2.20
- -Maximum number of anomalies in a single time series: 8
- -Average length of an anomaly: 16.33
- -Maximum length of an anomaly: 96.0

## 8. FLAT TREND ANOMALIES

Similar to Trend Anomalies, but with a reduced slope, making it difficult for human eyes to detect the anomaly without plotting the average gradient. The probability of negating the trend is 0%.

## · Statistics:

- -Average anomaly ratio: 0.0377
- -Number of time series without anomalies: 230 (57.50%)
- -Average number of anomalies per time series: 0.42
- -Maximum number of anomalies in a single time series: 1
- -Average length of an anomaly: 88.61
- -Maximum length of an anomaly: 200.0