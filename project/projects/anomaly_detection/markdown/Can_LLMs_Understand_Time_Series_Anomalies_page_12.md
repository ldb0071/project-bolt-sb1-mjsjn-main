Page 12

| Variant                 | Code   |
|-------------------------|--------|
| 0shot-text              | A      |
| 0shot-text-s0.3         | B      |
| 0shot-text-s0.3-calc    | C      |
| 0shot-text-s0.3-cot     | D      |
| 0shot-text-s0.3-cot-csv | E      |
| 0shot-text-s0.3-cot-pap | F      |
| 0shot-text-s0.3-cot-tpd | G      |
| 0shot-text-s0.3-csv     | H      |
| 0shot-text-s0.3-dyscalc | I      |
| 0shot-text-s0.3-pap     | J      |
| 0shot-text-s0.3-tpd     | K      |
| 0shot-vision            | L      |
| 0shot-vision-calc       | M      |
| 0shot-vision-cot        | N      |
| 0shot-vision-dyscalc    | O      |
| 1shot-text-s0.3         | P      |
| 1shot-text-s0.3-cot     | Q      |
| 1shot-vision            | R      |
| 1shot-vision-calc       | S      |
| 1shot-vision-cot        | T      |
| 1shot-vision-dyscalc    | U      |

these scores treat time series as a cluster of points without temporal order and can give counterintuitive results, as illustrated in Figure 3. To address this, we also report affinity precision and affinity recall as defined in Huet et al. (2022). We calculate the affinity F1 score as the harmonic mean of affi-precision and affi-recall, and it is the main metric we use to evaluate the hypotheses.

Figure 2: Reflexive/Reflective, Top 3 Affi-F1 prompt variant per mode (Ignoring (dys)calc variants), See Table 1 for variant name codes and Appendix A.4 for details

<!-- image -->

Baselines. As our goal is not to propose a new anomaly detection method but rather to test hypotheses about LLMs for better understanding, we use simple baselines for sanity check, see Appendix C Observation 8. We use Isolation Forest (Liu et al., 2008) and Thresholding.

## 5.2 EXPERIMENT RESULTS

In this section, we discuss the hypotheses that align with our observations and those we can confidently reject. Detailed numbers can be found in Appendix D. The 0-to-1 y-axis of the figures represents the affinity F1 score, where higher values indicate better performance. We defer some non-essential observations to Appendix C to focus on the hypotheses.

## Retained Hypothesis 1 on CoT Reasoning

No evidence is found that explicit reasoning prompts (via Chain of Thought) improved LLMs' performance in time series analysis.