Page 15

Sine : This time series includes sine-wave like seasonal patterns, which include { number of periods } periods with each last for approximately every { number of points in a period } points.

Square Sine : This time series includes sine-wave like seasonal patterns, which for i in range(n)

include { number of periods } periods with each last for approximately every { number of points in a period } points

IFFT : The time series appears to contain signals that can be effectively analyzed using the Fourier Transform, likely featuring prominent frequencies at { frequencies }.

No Seasonality : No seasonality observed in this time series.

## Noise

The time series has normal distributed noises with mean as 0 and variance as 1.

Figure 8: Template for time series base pattern explanation.

the range (-1, 1). For the polynomial trend, we randomly sample the degree in the range 2 to 5, and the coefficients for each degree are sampled from the range (-1, 1), with a shift randomly sampled from the range (-5, 5). For the noise component, we use normally distributed noise with a mean of 0 and a standard deviation of 1. We then combine these three components to generate the final base time series, where the amplitude for the trend is in the range (1, 200), and for the noise is in the range (1, 50).

Anomaly Points Generation The anomalies in time series can be roughly classified as point-aware anomalies and context-aware anomalies.

The point-aware anomalies can be either local anomalies, where δ = λ · σ ( X [ x -C ≤ x ≤ x + C ] ) with C as the context window size, or global anomalies, where δ = λ · σ ( X ) . For global point anomalies, we set the anomaly value to be λ · σ ( X ) with λ in the range (3, 20). For local point anomalies, we set the anomaly value to be λ · σ ( X [ x -C ≤ x ≤ x + C ] ) with context window C in the range (10, 50) and λ in the range (2, 5). We randomly sample 1-6 points in a time series to be replaced by point-wise anomaly values.

The pattern-aware anomalies can be classified into seasonality anomalies, trend anomalies, and shape anomalies. Specifically, a seasonality anomaly may occur with an amplitude change, i.e., a modified ˜ A n in s ( T i,j ) . We randomly sample whether the amplitude becomes larger or smaller, setting the