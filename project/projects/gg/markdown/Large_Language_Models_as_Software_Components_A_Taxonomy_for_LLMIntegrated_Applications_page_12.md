Page 12

## 5.1. Overview and demonstration

The taxonomy identifies 13 dimensions for LLM components, grouped into five metadimensions as shown in table 2. It comprises both dimensions with genuinely mutually exclusive characteristics and those with non-exclusive characteristics. For dimensions related to the technical integration of LLMs within applications, mutual exclusiveness is enforced. Given the open nature of software architecture, the integration of LLMs allows for significant diversity. In practice, LLM components may show multiple characteristics within these dimensions. Nonetheless, the taxonomy requires categorizing each component with a predominant characteristic, enforcing a necessary level of abstraction to effectively organize and structure the domain.

We applied the taxonomy to categorize each of the example instances described in section 4.2. The results are depicted in figure 1. The dimensions and their characteristics are detailed and illustrated with examples in section 5.2.

The taxonomy visualizes an LLM component by a feature vector comprising binary as well as multivalued features. Non-mutually exclusive dimensions are represented by a set of binary features. The remaining dimensions are encoded as n -valued features where n denotes the number of characteristics. For

compactness, we use one-letter codes of the characteristics as feature values in the visualizations. In table 2, these codes are printed in upper case in the respective characteristic's name.

A feature vector representing an LLM component is visualized in one line. For dimensions with nonmutually exclusive characteristics, all possible codes are listed, with the applicable ones marked. The remaining dimensions are represented by the code of the applicable characteristic, with the characteristic none shown as an empty cell. We shade feature values with different tones to support visual perception. LLM components within the same application are grouped together, visualizing an LLM-integrating application in a tabular format.

## 5.2. Dimensions and characteristics

## 5.2.1. Invocation dimensions

Two Invocation dimensions address the way the LLM is invoked within the application.