Page 26

Furthermore, the deployment mode of LLMs, whether local (on the same hardware as the application) or remote, managed privately or offered as Language-Models-as-a-Service (LMaaS), has impact on performance and usability. Table 4 gives an overview of the LLMs used in our sample of applications. Where papers report evaluations of multiple LLMs, the table displays the chosen or bestperforming LLM. Although not representative, the table provides some insights. LMaaS dominates, likely due to its convenience, but more importantly, due to the superior performance of the provided LLMs.

Concerns regarding LMaaS include privacy, as sensitive data might be transmitted to the LLM through the prompt [64], and service quality, i.e., reliability, availability, and costs. Costs typically depend on the quantity of processed tokens. This quantity also affects latency, which denotes the processing time of an LLM invocation. A further important factor for latency is the size of the LLM, with larger models being slower [7].

When building LLM-based applications for realworld use, the reliability and availability of an LMaaS are crucial. Availability depends not only on the technical stability of the service, but also on factors such as increased latency during high usage periods or usage restrictions imposed by the provider of an LMaaS, as reported for ProgPrompt [51]. Beyond technical aspects, the reliability of an LMaaS also encompasses its behavior. For instance, providers might modify a model to enhance its security, potentially impacting applications that rely on it.

In future work, the taxonomy will be extended to distinguish finer-grained parts of prompts, allowing a more detailed description and comparison of prompts and related experimental results. Initial studies share results on the format-following behavior of LLMs [68] as a subtopic of instruction-following [73], derived with synthetic benchmark data. It is necessary to complement their results with experiments using data and tasks from real application development projects because, in the early stages of this field, synthetic benchmarks may fail to cover relevant aspects within the wide range of possible options. Another crucial research direction involves exploring how LLM characteristics correspond to specific tasks, such as determining the optimal LLM size for intent detection tasks. The taxonomy developed in this study can systematize such experiments and their outcomes. Additionally, it provides a structured framework for delineating design choices in LLM components, making it a valuable addition to future training materials.

## Acknowledgements

Special thanks to Antonia Weber and Constantin Weber for proofreading and providing insightful and constructive comments.

## References

Despite practical challenges, integrating LLMs into systems has the potential to alter the way software is constructed and the types of systems that can be realized. Prompts are central to the functioning of LLM components which pose specific requirements such as strict format adherence. Therefore, an important direction for future research will be prompt engineering specifically tailored for LLM-integrated applications.

- [1] Eleni Adamopoulou and Lefteris Moussiades. An Overview of Chatbot Technology. In Ilias Maglogiannis, Lazaros Iliadis, and Elias Pimenidis, editors, Artificial Intelligence Applications and Innovations , IFIP Advances in Information and Communication Technology, pages 373-383, Cham, 2020. Springer International Publishing. doi:10.1007/978-3-030-49186-4\_31.
- [2] Sebastian Bader, Erich Barnstedt, Heinz Bedenbender, Bernd Berres, Meik Billmann, and Marko Ristin. Details of the asset administration shell-part 1: The exchange of information between partners in the value chain of industrie 4.0 (version 3.0 rc02). Working Paper, Berlin: Federal Ministry for Economic Affairs

and Climate Action (BMWK), 2022. doi.org/ 10.21256/zhaw-27075 .

- [3] Marcos Baez, Florian Daniel, Fabio Casati, and Boualem Benatallah. Chatbot integration in few patterns. IEEE Internet Computing , pages 1-1, 2020. doi:10.1109/MIC.2020.3024605.
- [4] Tom Bocklisch, Thomas Werkmeister, Daksh Varshneya, and Alan Nichol. TaskOriented Dialogue with In-Context Learning. (arXiv:2402.12234), February 2024. doi:10.48550/arXiv.2402.12234.
- [5] Yuzhe Cai, Shaoguang Mao, Wenshan Wu, Zehua Wang, Yaobo Liang, Tao Ge, Chenfei Wu, Wang You, Ting Song, Yan Xia, Jonathan Tien, and Nan Duan. Low-code LLM: Visual Programming over LLMs. (arXiv:2304.08103), April 2023. doi:10.48550/arXiv.2304.08103.
- [6] Lang Cao. DiagGPT: An LLM-based Chatbot with Automatic Topic Management for TaskOriented Dialogue. (arXiv:2308.08043), August 2023. doi:10.48550/arXiv.2308.08043.
- [7] Phillip Carter. All the Hard Stuff Nobody Talks About When Building Products with LLMs . Honeycomb, May 2023. https://www.honeycomb.io/blog/ hard-stuff-nobody-talks-about-llm .
- [8] Phillip Carter. So We Shipped an AI Product. Did It Work? Honeycomb, October 2023. https://www.honeycomb.io/blog/ we-shipped-ai-product .
- [9] Banghao Chen, Zhaofeng Zhang, Nicolas Langrené, and Shengxin Zhu. Unleashing the potential of prompt engineering in Large Language Models: A comprehensive review. (arXiv:2310.14735), October 2023. doi:10.48550/arXiv.2310.14735.
- [10] Wang Chen, Yan-yi Liu, Tie-zheng Guo, Dapeng Li, Tao He, Li Zhi, Qing-wen Yang, Hui-han Wang, and Ying-you Wen. Systems engineering issues for industry applications of large language model. Applied
- Soft Computing , 151:111165, January 2024. doi:10.1016/j.asoc.2023.111165.
- [11] Yuheng Cheng, Ceyao Zhang, Zhengwen Zhang, Xiangrui Meng, Sirui Hong, Wenhao Li, Zihao Wang, Zekai Wang, Feng Yin, Junhua Zhao, and Xiuqiang He. Exploring Large Language Model based Intelligent Agents: Definitions, Methods, and Prospects. (arXiv:2401.03428), January 2024. doi:10.48550/arXiv.2401.03428.
- [12] Silvia Colabianchi, Andrea Tedeschi, and Francesco Costantino. Human-technology integration with industrial conversational agents: A conceptual architecture and a taxonomy for manufacturing. Journal of Industrial Information Integration , 35:100510, October 2023. doi:10.1016/j.jii.2023.100510.
- [13] Jonathan Evertz, Merlin Chlosta, Lea Schönherr, and Thorsten Eisenhofer. Whispers in the Machine: Confidentiality in LLM-integrated Systems. (arXiv:2402.06922), February 2024. doi:10.48550/arXiv.2402.06922.
- [14] Angela Fan, Beliz Gokkaya, Mark Harman, Mitya Lyubarskiy, Shubho Sengupta, Shin Yoo, and Jie M. Zhang. Large Language Models for Software Engineering: Survey and Open Problems. (arXiv:2310.03533), November 2023. doi:10.48550/arXiv.2310.03533.
- [15] Wenqi Fan, Zihuai Zhao, Jiatong Li, Yunqing Liu, Xiaowei Mei, Yiqi Wang, Zhen Wen, Fei Wang, Xiangyu Zhao, Jiliang Tang, and Qing Li. Recommender Systems in the Era of Large Language Models (LLMs). (arXiv:2307.02046), August 2023. doi:10.48550/arXiv.2307.02046.
- [16] David Fortin. Microsoft Copilot in Excel: What It Can and Can't Do . YouTube, January 2024. https://www.youtube.com/watch? v=-fsu9IXMZvo .
- [17] Martin Fowler. Patterns of Enterprise Application Architecture . 2002. ISBN 978-0-321-127426.

- [18] Shirley Gregor. The nature of theory in information systems. MIS quarterly , pages 611-642, 2006. doi:10.2307/25148742.
- [19] Yanchu Guan, Dong Wang, Zhixuan Chu, Shiyu Wang, Feiyue Ni, Ruihua Song, Longfei Li, Jinjie Gu, and Chenyi Zhuang. Intelligent Virtual Assistants with LLM-based Process Automation. (arXiv:2312.06677), December 2023. doi:10.48550/arXiv.2312.06677.
- [20] Muhammad Usman Hadi, Qasem Al Tashi, Rizwan Qureshi, Abbas Shah, Amgad Muneer, Muhammad Irfan, Anas Zafar, Muhammad Bilal Shaikh, Naveed Akhtar, Jia Wu, and Seyedali Mirjalili. Large Language Models: A Comprehensive Survey of its Applications, Challenges, Limitations, and Future Prospects, September 2023. doi:10.36227/techrxiv.23589741.v3.
- [21] Thorsten Händler. A Taxonomy for Autonomous LLM-Powered Multi-Agent Architectures:. In Proceedings of the 15th International Joint Conference on Knowledge Discovery, Knowledge Engineering and Knowledge Management , pages 85-98, Rome, Italy, 2023. SCITEPRESS - Science and Technology Publications. doi:10.5220/0012239100003598.
- [22] Xinyi Hou, Yanjie Zhao, Yue Liu, Zhou Yang, Kailong Wang, Li Li, Xiapu Luo, David Lo, John Grundy, and Haoyu Wang. Large Language Models for Software Engineering: A Systematic Literature Review. (arXiv:2308.10620), September 2023. doi:10.48550/arXiv.2308.10620.
- [23] Vojtěch Hudeček and Ondrej Dusek. Are Large Language Models All You Need for TaskOriented Dialogue? In Svetlana Stoyanchev, Shafiq Joty, David Schlangen, Ondrej Dusek, Casey Kennington, and Malihe Alikhani, editors, Proceedings of the 24th Annual Meeting of the Special Interest Group on Discourse and Dialogue , pages 216-228, Prague, Czechia, September 2023. Association for Computational Linguistics. doi:10.18653/v1/2023.sigdial-1.21.
- [24] Kevin Maik Jablonka, Qianxiang Ai, Alexander Al-Feghali, Shruti Badhwar, Joshua D. Bocarsly, Andres M. Bran, Stefan Bringuier, Catherine L. Brinson, Kamal Choudhary, Defne Circi, Sam Cox, Wibe A. de Jong, Matthew L. Evans, Nicolas Gastellu, Jerome Genzling, María Victoria Gil, Ankur K. Gupta, Zhi Hong, Alishba Imran, Sabine Kruschwitz, Anne Labarre, Jakub Lála, Tao Liu, Steven Ma, Sauradeep Majumdar, Garrett W. Merz, Nicolas Moitessier, Elias Moubarak, Beatriz Mouriño, Brenden Pelkie, Michael Pieler, Mayk Caldas Ramos, Bojana Ranković, Samuel Rodriques, Jacob Sanders, Philippe Schwaller, Marcus Schwarting, Jiale Shi, Berend Smit, Ben Smith, Joren Van Herck, Christoph Völker, Logan Ward, Sean Warren, Benjamin Weiser, Sylvester Zhang, Xiaoqi Zhang, Ghezal Ahmad Zia, Aristana Scourtas, K. Schmidt, Ian Foster, Andrew White, and Ben Blaiszik. 14 examples of how LLMs can transform materials science and chemistry: A reflection on a large language model hackathon. Digital Discovery , 2(5):1233-1250, 2023. doi:10.1039/D3DD00113J.
- [25] Jean Kaddour, Joshua Harris, Maximilian Mozes, Herbie Bradley, Roberta Raileanu, and Robert McHardy. Challenges and Applications of Large Language Models, July 2023. doi:10.48550/arXiv.2307.10169.
- [26] Samuel Kernan Freire, Mina Foosherian, Chaofan Wang, and Evangelos Niforatos. Harnessing Large Language Models for Cognitive Assistants in Factories. In Proceedings of the 5th International Conference on Conversational User Interfaces , CUI '23, pages 1-6, New York, NY, USA, July 2023. Association for Computing Machinery. doi:10.1145/3571884.3604313.
- [27] Anis Koubaa, Wadii Boulila, Lahouari Ghouti, Ayyub Alzahem, and Shahid Latif. Exploring ChatGPT Capabilities and Limitations: A Survey. IEEE Access , 11:118698-118721, 2023. doi:10.1109/ACCESS.2023.3326474.
- [28] Varun Kumar, Leonard Gleyzer, Adar Kahana, Khemraj Shukla, and George Em Karni-

adakis. MyCrunchGPT: A LLM Assisted Framework for Scientific Machine Learning. Journal of Machine Learning for Modeling and Computing , 4(4), 2023. doi.org/10.1615/ JMachLearnModelComput.2023049518 .

- [29] Dennis Kundisch, Jan Muntermann, Anna Maria Oberländer, Daniel Rau, Maximilian Röglinger, Thorsten Schoormann, and Daniel Szopinski. An Update for Taxonomy Designers. Business & Information Systems Engineering , 64(4):421-439, August 2022. doi:10.1007/s12599-021-00723-x.
- [30] Gibbeum Lee, Volker Hartmann, Jongho Park, Dimitris Papailiopoulos, and Kangwook Lee. Prompted LLMs as chatbot modules for long open-domain conversation. In Anna Rogers, Jordan Boyd-Graber, and Naoaki Okazaki, editors, Findings of the association for computational linguistics: ACL 2023 , pages 4536-4554, Toronto, Canada, July 2023. Association for Computational Linguistics. doi:10.18653/v1/2023.findings-acl.277.
- [31] Pengfei Liu, Weizhe Yuan, Jinlan Fu, Zhengbao Jiang, Hiroaki Hayashi, and Graham Neubig. Pre-train, Prompt, and Predict: A Systematic Survey of Prompting Methods in Natural Language Processing. ACM Computing Surveys , 55(9):195:1-195:35, January 2023. doi:10.1145/3560815.
- [32] Yi Liu, Gelei Deng, Yuekang Li, Kailong Wang, Tianwei Zhang, Yepang Liu, Haoyu Wang, Yan Zheng, and Yang Liu. Prompt Injection attack against LLM-integrated Applications, June 2023. doi:10.48550/arXiv.2306.05499.
- [33] Yuchen Liu, Luigi Palmieri, Sebastian Koch, Ilche Georgievski, and Marco Aiello. DELTA: Decomposed Efficient Long-Term Robot Task Planning using Large Language Models. (arXiv:2404.03275), April 2024. doi:10.48550/arXiv.2404.03275.
- [34] Yupei Liu, Yuqi Jia, Runpeng Geng, Jinyuan Jia, and Neil Zhenqiang Gong. Prompt Injection Attacks and Defenses in LLM-Integrated

Applications. (arXiv:2310.12815), October 2023. doi:10.48550/arXiv.2310.12815.

- [35] Shaoguang Mao, Qiufeng Yin, Yuzhe Cai, and Dan Qiao. LowCodeLLM. https: //github.com/chenfei-wu/TaskMatrix/ tree/main/LowCodeLLM , May 2023.
- [36] Scott McLean, Gemma J. M. Read, Jason Thompson, Chris Baber, Neville A. Stanton, and Paul M. Salmon. The risks associated with Artificial General Intelligence: A systematic review. Journal of Experimental & Theoretical Artificial Intelligence , 35(5):649-663, July 2023. doi:10.1080/0952813X.2021.1964003.
- [37] Oier Mees, Jessica Borja-Diaz, and Wolfram Burgard. Grounding Language with Visual Affordances over Unstructured Data. In 2023 IEEE International Conference on Robotics and Automation (ICRA) , pages 11576-11582, London, United Kingdom, May 2023. IEEE. doi:10.1109/ICRA48891.2023.10160396.
- [38] Grégoire Mialon, Roberto Dessì, Maria Lomeli, Christoforos Nalmpantis, Ram Pasunuru, Roberta Raileanu, Baptiste Rozière, Timo Schick, Jane Dwivedi-Yu, Asli Celikyilmaz, Edouard Grave, Yann LeCun, and Thomas Scialom. Augmented Language Models: A Survey, February 2023. doi:10.48550/arXiv.2302.07842.
- [39] Melanie Mitchell. Debates on the nature of artificial general intelligence. Science , 383(6689):eado7069, March 2024. doi:10.1126/science.ado7069.
- [40] Quim Motger, Xavier Franch, and Jordi Marco. Software-Based Dialogue Systems: Survey, Taxonomy, and Challenges. ACM Computing Surveys , 55(5):91:1-91:42, December 2022. doi:10.1145/3527450.
- [41] Fiona Fui-Hoon Nah, Ruilin Zheng, Jingyuan Cai, Keng Siau, and Langtao Chen. Generative AI and ChatGPT: Applications, challenges, and AI-human collaboration. Jour-

nal of Information Technology Case and Application Research , 25(3):277-304, July 2023. doi:10.1080/15228053.2023.2233814.

- [42] Robert C Nickerson, Upkar Varshney, and Jan Muntermann. A method for taxonomy development and its application in information systems. European Journal of Information Systems , 22(3):336-359, May 2013. doi:10.1057/ejis.2012.26.
- [43] Camille Pack, Cern McAtee, Samantha Robertson, Dan Brown, Aditi Srivastava, and Kweku Ako-Adjei. Microsoft Copilot for Microsoft 365 overview. https://learn.microsoft. com/en-us/copilot/microsoft-365/ microsoft-365-copilot-overview , March 2024.
- [44] Chris Parnin, Gustavo Soares, Rahul Pandita, Sumit Gulwani, Jessica Rich, and Austin Z. Henley. Building Your Own Product Copilot: Challenges, Opportunities, and Needs. (arXiv:2312.14231), December 2023. doi:10.48550/arXiv.2312.14231.
- [45] Rodrigo Pedro, Daniel Castro, Paulo Carreira, and Nuno Santos. From Prompt Injections to SQL Injection Attacks: How Protected is Your LLM-Integrated Web Application? (arXiv:2308.01990), August 2023. doi:10.48550/arXiv.2308.01990.
- [46] Ken Peffers, Tuure Tuunanen, Marcus A. Rothenberger, and Samir Chatterjee. A Design Science Research Methodology for Information Systems Research. Journal of Management Information Systems , 24(3):45-77, December 2007. ISSN 0742-1222, 1557-928X. doi:10.2753/MIS0742-1222240302.
- [47] Mohaimenul Azam Khan Raiaan, Md. Saddam Hossain Mukta, Kaniz Fatema, Nur Mohammad Fahad, Sadman Sakib, Most Marufatul Jannat Mim, Jubaer Ahmad, Mohammed Eunus Ali, and Sami Azam. A Review on Large Language Models: Architectures, Applications, Taxonomies, Open Issues and Chal-

lenges. IEEE Access , 12:26839-26874, 2024. doi:10.1109/ACCESS.2024.3365742.

- [48] Jack Daniel Rittelmeyer and Kurt Sandkuhl. Morphological Box for AI Solutions: Evaluation and Refinement with a Taxonomy Development Method. In Knut Hinkelmann, Francisco J. López-Pellicer, and Andrea Polini, editors, Perspectives in Business Informatics Research , Lecture Notes in Business Information Processing, pages 145-157, Cham, 2023. Springer Nature Switzerland. doi:10.1007/978-3-031-43126-5\_11.
- [49] Shubhra Kanti Karmaker Santu and Dongji Feng. TELeR: A General Taxonomy of LLM Prompts for Benchmarking Complex Tasks. (arXiv:2305.11430), October 2023. doi:10.48550/arXiv.2305.11430.
- [50] Thorsten Schoormann, Frederik Möller, and Daniel Szopinski. Exploring Purposes of Using Taxonomies. In Proceedings of the International Conference on Wirtschaftsinformatik (WI) , Nuernberg, Germany, February 2022.
- [51] Ishika Singh, Valts Blukis, Arsalan Mousavian, Ankit Goyal, Danfei Xu, Jonathan Tremblay, Dieter Fox, Jesse Thomason, and Animesh Garg. ProgPrompt: Generating Situated Robot Task Plans using Large Language Models. In 2023 IEEE International Conference on Robotics and Automation (ICRA) , pages 1152311530, London, United Kingdom, May 2023. IEEE. doi:10.1109/ICRA48891.2023.10161317.
- [52] Gero Strobel, Leonardo Banh, Frederik Möller, and Thorsten Schoormann. Exploring Generative Artificial Intelligence: A Taxonomy and Types. In Proceedings of the 57th Hawaii International Conference on System Sciences , Honolulu, Hawaii, January 2024. https://hdl. handle.net/10125/106930 .
- [53] Hendrik Strobelt, Albert Webson, Victor Sanh, Benjamin Hoover, Johanna Beyer, Hanspeter Pfister, and Alexander M. Rush. Interactive and Visual Prompt Engineering for Adhoc Task Adaptation With Large Language

Models. IEEE Transactions on Visualization and Computer Graphics , pages 1-11, 2022. doi:10.1109/TVCG.2022.3209479.

- [54] Daniel Szopinski, Thorsten Schoormann, and Dennis Kundisch. Criteria as a Prelude for Guiding Taxonomy Evaluation. In Proceedings of the 53rd Hawaii International Conference on System Sciences , 2020. https://hdl.handle.net/ 10125/64364 .
- [55] Daniel Szopinski, Thorsten Schoormann, and Dennis Kundisch. Visualize different: Towards researching the fit between taxonomy visualizations and taxonomy tasks. In Tagungsband Der 15. Internationalen Tagung Wirtschaftsinformatik (WI 2020) , Potsdam, 2020. doi:10.30844/wi\_2020\_k9-szopinski.
- [56] Manisha Thakkar and Nitin Pise. Unified Approach for Scalable Task-Oriented Dialogue System. International Journal of Advanced Computer Science and Applications , 15(4), 2024. doi:10.14569/IJACSA.2024.01504108.
- [57] Oguzhan Topsakal and Tahir Cetin Akinci. Creating Large Language Model Applications Utilizing Langchain: A Primer on Developing LLM Apps Fast. In International Conference on Applied Engineering and Natural Sciences , volume 1, pages 1050-1056, 2023.
- [58] Michael Unterkalmsteiner and Waleed Adbeen. A compendium and evaluation of taxonomy quality attributes. Expert Systems , 40(1): e13098, 2023. doi:10.1111/exsy.13098.
- [59] Bryan Wang, Gang Li, and Yang Li. Enabling Conversational Interaction with Mobile UI using Large Language Models. In Proceedings of the 2023 CHI Conference on Human Factors in Computing Systems , CHI '23, pages 1-17, New York, NY, USA, April 2023. Association for Computing Machinery. doi:10.1145/3544548.3580895.
- [60] Can Wang, Bolin Zhang, Dianbo Sui, Zhiying Tu, Xiaoyu Liu, and Jiabao Kang. A Survey on
- Effective Invocation Methods of Massive LLM Services. (arXiv:2402.03408), February 2024. doi:10.48550/arXiv.2402.03408.
- [61] Jun Wang, Guocheng He, and Yiannis Kantaros. Safe Task Planning for LanguageInstructed Multi-Robot Systems using Conformal Prediction. (arXiv:2402.15368), February 2024. doi:10.48550/arXiv.2402.15368.
- [62] Lei Wang, Chen Ma, Xueyang Feng, Zeyu Zhang, Hao Yang, Jingsen Zhang, Zhiyuan Chen, Jiakai Tang, Xu Chen, Yankai Lin, Wayne Xin Zhao, Zhewei Wei, and Jirong Wen. A survey on large language model based autonomous agents. Frontiers of Computer Science , 18(6):186345, March 2024. doi:10.1007/s11704-024-40231-1.
- [63] Shu Wang, Muzhi Han, Ziyuan Jiao, Zeyu Zhang, Ying Nian Wu, Song-Chun Zhu, and Hangxin Liu. LLM3:Large Language Modelbased Task and Motion Planning with Motion Failure Reasoning. (arXiv:2403.11552), March 2024. doi:10.48550/arXiv.2403.11552.
- [64] Hao Wen, Yuanchun Li, Guohong Liu, Shanhui Zhao, Tao Yu, Toby Jia-Jun Li, Shiqi Jiang, Yunhao Liu, Yaqin Zhang, and Yunxin Liu. Empowering LLM to use Smartphone for Intelligent Task Automation. (arXiv:2308.15272), September 2023. doi:10.48550/arXiv.2308.15272.
- [65] Hao Wen, Yuanchun Li, and Sean KiteFlyKid. MobileLLM/AutoDroid. Mobile LLM, January 2024. https://github.com/MobileLLM/ AutoDroid .
- [66] Jules White, Quchen Fu, Sam Hays, Michael Sandborn, Carlos Olea, Henry Gilbert, Ashraf Elnashar, Jesse Spencer-Smith, and Douglas C. Schmidt. A Prompt Pattern Catalog to Enhance Prompt Engineering with ChatGPT. (arXiv:2302.11382), February 2023. doi:10.48550/arXiv.2302.11382.
- [67] Tongshuang Wu, Michael Terry, and Carrie Jun Cai. AI Chains: Transparent and

Controllable Human-AI Interaction by Chaining Large Language Model Prompts. In Proceedings of the 2022 CHI Conference on Human Factors in Computing Systems , CHI '22, pages 1-22, New York, NY, USA, April 2022. Association for Computing Machinery. doi:10.1145/3491102.3517582.

- [68] Congying Xia, Chen Xing, Jiangshu Du, Xinyi Yang, Yihao Feng, Ran Xu, Wenpeng Yin, and Caiming Xiong. FOFO: A Benchmark to Evaluate LLMs' Format-Following Capability. (arXiv:2402.18667), February 2024. doi:10.48550/arXiv.2402.18667.
- [69] Yuchen Xia, Manthan Shenoy, Nasser Jazdi, and Michael Weyrich. Towards autonomous system: Flexible modular production system enhanced with large language model agents. In 2023 IEEE 28th International Conference on Emerging Technologies and Factory Automation (ETFA) , pages 1-8, 2023. doi:10.1109/ETFA54631.2023.10275362.
- [70] I. de Zarzà, J. de Curtò, Gemma Roig, and Carlos T. Calafate. LLM Adaptive PID Control for B5G Truck Platooning Systems. Sensors , 23(13):5899, January 2023. doi:10.3390/s23135899.
- [71] Xiaoying Zhang, Baolin Peng, Kun Li, Jingyan Zhou, and Helen Meng. SGP-TOD: Building Task Bots Effortlessly via Schema-Guided LLMPrompting. (arXiv:2305.09067), May 2023. doi:10.48550/arXiv.2305.09067.

[72] Wayne Xin Zhao, Kun Zhou, Junyi Li, Tianyi Tang, Xiaolei Wang, Yupeng Hou, Yingqian Min, Beichen Zhang, Junjie Zhang, Zican Dong, Yifan Du, Chen Yang, Yushuo Chen, Zhipeng Chen, Jinhao Jiang, Ruiyang Ren, Yifan Li, Xinyu Tang, Zikang Liu, Peiyu Liu, Jian-Yun Nie, and Ji-Rong Wen. A Survey of Large Language Models. (arXiv:2303.18223), May 2023. doi:10.48550/arXiv.2303.18223.

[73] Jeffrey Zhou, Tianjian Lu, Swaroop Mishra, Siddhartha Brahma, Sujoy Basu, Yi Luan,

Denny Zhou, and Le Hou. InstructionFollowing Evaluation for Large Language Models. (arXiv:2311.07911), November 2023. doi:10.48550/arXiv.2311.07911.