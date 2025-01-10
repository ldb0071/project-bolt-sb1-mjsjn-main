Page 12

Ian Tenney, Patrick Xia, Berlin Chen, Alex Wang, Adam Poliak, R Thomas McCoy, Najoung Kim, Benjamin Van Durme, Samuel R Bowman, Dipanjan Das, et al. 2019. What do you learn from context? probing for sentence structure in contextualized word representations. In 7th International Conference on Learning Representations, ICLR 2019 .

Alex Warstadt, Amanpreet Singh, and Samuel R Bowman. 2019. Neural network acceptability judgments. Transactions of the Association for Computational Linguistics , 7:625-641.

Aaron Steven White, Pushpendre Rastogi, Kevin Duh, and Benjamin Van Durme. 2017. Inference is everything: Recasting semantic resources into a unified evaluation framework. In Proceedings of the Eighth International Joint Conference on Natural Language Processing (Volume 1: Long Papers) , pages 996-1005.

Adina Williams, Nikita Nangia, and Samuel Bowman. 2018. A broad-coverage challenge corpus for sentence understanding through inference. In Proceedings of the 2018 Conference of the North American Chapter of the Association for Computational Linguistics: Human Language Technologies, Volume 1 (Long Papers) , pages 1112-1122.

Yi Yang, Wen-tau Yih, and Christopher Meek. 2015. Wikiqa: A challenge dataset for open-domain question answering. In Proceedings of the 2015 conference on empirical methods in natural language processing , pages 2013-2018.

Fan Yin, Quanyu Long, Tao Meng, and Kai-Wei Chang. 2020. On the robustness of language encoders against grammatical errors. In Proceedings of the 58th Annual Meeting of the Association for Computational Linguistics .

## A Appendix

## A.1 Cross-lingual encoders

Our probing tasks focus on anomalies defined relative to English syntax-but of course grammatical properties vary from language to language. Some of our perturbations produce constructions that are grammatical in other languages. We compare Universal Sentence Encoder (Cer et al., 2018) in the variants of both monolingual and cross-lingual (Chidambaram et al., 2019) trained models-Multitask en-en, Multi-task en-fr, and Multi-task en-de. This allows us to examine impacts of cross-lingual learning, between English and different target languages, on anomaly sensitivity. 9

From Table 3, we see that the two cross-lingual encoders (Multi-task en-fr and Multi-task en-de) do show slightly stronger anomaly detection relative to the monolingual model (Multi-task en-en) on Mod-Noun , Verb-Ob , and Agree-Shift , while having similar accuracy on SubN-ObN . This suggests that to accomplish the cross-lingual mapping

from English to French or English to German, these models may carry out somewhat more explicit encoding of syntactic ordering information, as well as morphological agreement information, resulting in encoded embeddings being more sensitive to corresponding anomalies relative to the monolingual model. As we have discussed in the main paper, anomaly detection in the SubN-ObN task likely involves understanding extra world knowledge, so it is perhaps not surprising that the cross-lingual component does not provide a boost in sensitivity on that task. For the most part, we find that the difference between the English-to-French and English-to-German mapping does not significantly impact encoding of the tested anomaly types.

Table 4: Results (accuracy %) on original anomaly detection tasks, comparing between LR and MLP classifiers. The MLP results are the same as what has been shown in Fig. 1 in the main body.

| (accuracy %)   |   Multi-task en-en |   Multi-task en-fr |   Multi-task en-de |
|----------------|--------------------|--------------------|--------------------|
| Mod-Noun       |             54.858 |             57.539 |             59.109 |
| Verb-Ob        |             63.204 |             66.188 |             66.345 |
| SubN-ObN       |             56.91  |             56.372 |             56.641 |
| Agree-Shift    |             56.125 |             61.746 |             61.33  |