Page 7

In Figure 3 we show how the empirical cumulative distribution of relative anomalies may be useful for determining the threshold above which an observation is labeled an anomaly. For a clearer presentation, we transformed the relative anomaly values as · ↦→ -ln( -· ) . The top 20 percent of observations have much higher relative anomaly values than the other observations. This approach is particularly useful in higher-dimensional problems, where a visual inspection is difficult.

Fig. 1. The vertex degree approach labels low-density observation in the left cluster of normal observations as anomalous, and mistakes some observations in the diffuse right cluster of scrapers as normal; the top 20 percent detected anomalies are highlighted.

<!-- image -->

Fig. 2. The popularity approach correctly detects the left cluster of normal observations as normal, and labels the diffuse right cluster of scrapers as anomalous; the top 20 percent detected anomalies are highlighted.

<!-- image -->

We also apply the shortest path approach from Section III-B to the scraping data set. In Figure 4 we see that, compared with the approach of Section III, the shortest path approach using q = 0 . 5 yields sharper bounds around the group of normal observations, which may be desired in some applications; in-sample the classification outcomes are identical.

<!-- image -->

-

-

Fig. 3. The empirical distribution of directed anomalies can assist with deciding above which threshold of directed anomaly an observation is labeled anomalous.Fig. 4. The shortest path approach to directed anomaly detection correctly detects the left cluster of normal observations as normal, and labels the diffuse right cluster of scrapers as anomalous; the top 20 percent detected anomalies are highlighted.

<!-- image -->

## B. Wi-Fi usage data

Our second data set contains observations on Wi-Fi channel utilization reported for wireless transmissions at different access points within a specific location in a corporate networking environment. The instantaneous channel utilization at each access point is an indication of how busy the transmission channel is, and whether the access point should change transition to a different channel. Detecting channel utilization anomalies is critical for identifying access points with low performance due to consistent high utilization. The data set contains two