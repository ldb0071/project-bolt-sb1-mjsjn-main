Page 6

- 1) Find that normal observation in the data set which is closest to the anomalous observation:

x closest ( x anomalous ) (13) = arg min x i : DORA( x i ) <p d ( x i , x anomalous ) .

The threshold p ∈ (0 , 1) determines how large the anomaly of x closest may be to still be considered normal. Here it may be useful to use the L 1 distance to judge discrepancy, because the suggested change will be large in a few dimensions, unlike it is the case with L 2 distance, which will suggest smaller changes in many dimensions.

- 2) Calculate x anomalous -x closest ( x anomalous ) ; the largest elements of this vector difference show which univariate components need to be altered for the system to revert to a normal state.

## IV. APPLICATION

We compare the relative anomaly detection approaches, introduced in Section III, to the vertex degree anomaly detection approach discussed in Section II-B, using two data sets from Google, of 1,000 data points each. We pre-process each covariate using the Box-Cox transform [15],

glyph[negationslash]

x ↦→ { ( x + δ ) λ -1 λ , if λ = 0 , ln( x + δ ) , if λ = 0 , (14)

to reduce skew and normalize kurtosis; special cases of this transform are the logarithmic and square-root transforms. We find the parameters ( δ, λ ) as those maximizing the normal log-likelihood of the data. We then standardize the data and form a fully connected similarity graph using the radial basis kernel.

The first data set contains information about potential scraping attempts. Scraping is the automated collection of information from websites. The two covariates are experimental features that measure aspects of user behavior for each access log.

In Figure 1 we show the anomaly detection results using the vertex degree approach of Section II-B, which targets the frequency criterion. We set γ = 0 . 5 . Here and in the following, the lighter the shade of grey is, the higher the respective region's detected degree of anomaly. The top twenty percent detected anomalies are emphasized. However, domain experts have identified that the observations in the diffuse cluster on the right exhibit behavior that is typical of scrapers. As a result, there are false positives surrounding the very high density area around ( -1 , 0) , and the observations around (5 , -2) and (6 , 4) are false negatives.

The results for the popularity approach to relative anomaly detection, introduced in Section III-A, are shown in Figure 2. We set γ = 0 . 2 , because we find that the relative anomaly approach generally requires less smoothing than the vertex degree approach. The results are not very sensitive to the exact choice of γ ; lowering γ in the vertex degree approach would result in a significant increase in the number of false positives and false negatives. There are no false positives or false negatives, as compared with the expert judgement.

It is extremely labor-intensive-potentially even impossible-to assess with certainty whether an individual data point is or is not a scraper. Hence it may be desired to only label users as scrapers if we are very certain. The detected level of relative anomaly in Figure 2 tends to increase while moving away from the high density area on the left. Increasing the threshold of relative anomaly above which a user is labeled as a scraper will have the desired result that only observations on the far right-whose behavior is most different from what is typical-are labeled as anomalous. In contrast, the vertex degree approach will continue labeling observations in the low density area close to the cluster of normal users as anomalous.