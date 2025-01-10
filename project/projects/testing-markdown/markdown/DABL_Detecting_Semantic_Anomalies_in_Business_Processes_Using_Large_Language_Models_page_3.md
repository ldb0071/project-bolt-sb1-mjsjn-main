Page 3

<!-- image -->

Figure 3: Different anomaly types applied to a normal trace.

<!-- image -->

processes. Fig. 3 illustrates distinct anomalous traces resulting from the application of these five anomaly types to a normal trace [ e 1 , e 2 , · · · , e n ] . These anomaly types are defined as follows and are applied to a normal trace to generate ordering anomalies:

- · Skip : A sequence of up to three activities [ e i , · · · , e j ] is skipped.
- · Insert : A sequence of up to three random activities [ e ' 1 , · · · , e ' m ] is inserted. The random activities are selected from a set comprising all possible activities across all process models.
- · Rework : A sequence of up to three activities [ e i , · · · , e j ] is executed a second time after activity e k .
- · Early : A sequence of up to three activities [ e i , · · · , e j ] is executed earlier and consequently skipped later.
- · Late : A sequence of up to three activities [ e i , · · · , e j ] is executed later and consequently skipped earlier.

Below are the causes for these anomaly types, which are currently in the plural form (i.e., 'activities', 'they'). During implementation, they may need to be flexibly transformed into the singular form (i.e., 'activity', 'it').

- · Skip : The activities $ { e i , · · · , e j } are skipped before $ { e j +1 } .
- · Insert : The activities $ { e ' 1 , · · · , e ' m } should not be executed.
- · Rework : The activities $ { e i , · · · , e j } are reworked after $ { e k } .
- · Early : The activities $ { e i , · · · , e j } are executed too early, they should be executed after $ { e i -1 } .
- · Late : The activities $ { e i , · · · , e j } are executed too late, they should be executed before $ { e j +1 } .

Here, $ { e i , . . . , e j } represents converting the trace [ e i , · · · , e j ] into a string format by enclosing each executed activity in apostrophes and separating them with commas, while using and before the penultimate and ultimate activities. For example, for the trace [ A,B,C,D ] , the resulting string would be 'A', 'B', 'C' and 'D' .

However, the generated anomalies may actually represent a normal trace. For a process model m , we refine the set of generated ordering anomalies L o m by excluding traces present in L m from it.

Exclusion anomalies : Exclusion anomalies occur when certain activities should not have been executed together within the same trace without an intermediate activity. For

Figure 4: Different anomaly types applied to a normal trace.

<!-- image -->

instance, in the loan application process illustrated in Fig. 2, it is inappropriate to send an acceptance pack and reject an application within the same trace.

The process tree (Aalst, Buijs, and Dongen 2011), a specialized form of process model, is utilized for analyzing process structure. For instance, the process tree corresponding to the process model depicted in Fig. 2 is illustrated in Fig. 4. We begin by converting the gathered process model m into a process tree using the techniques presented in (van Zelst and Leemans 2020). Then, we replace an exclusive node (represented as × ) in the process tree with a parallel node (represented as ∧ ), resulting in a modified process model denoted as m ' . This modification enables certain exclusive activities to be executed within the same trace to simulate exclusion anomalies. It is important to recognize that a single process tree may contain multiple exclusive nodes; therefore, we carry out this modification successively, resulting in multiple modified process models. Subsequently, we playout of all the modified models, restricting each loop to be executed a maximum of twice, to generate the set of traces, denoted as L m ' . We refine L m ' by excluding traces present in L m from it, resulting in the set of exclusion anomalies L e m .

To extract the causes of exclusion anomalies, we need to identify activities that exhibit exclusion relationships. In a process tree, activities located under different branches of an exclusive node (represented as × ) exhibit such relationships. For example, in the process tree illustrated in Fig. 4, the activity set { 'Prepare acceptance pack', 'Send acceptance pack' } and the activity set { 'Reject application' } exhibit exclusion relationships.

Formally, consider a modified model m ' , which results from modifying an exclusive node R in the process tree corresponding to the process model m . An exclusion anomaly t is generated from model m ' . The node R has N branches, with the activity sets A 1 , · · · , A N under them. Activities within each activity set A i that do not appear in t are filtered out. The cause of this exclusion anomaly t is then:

- · The activities $ {A 1 } are mutually exclusive with the activities $ { ⋃ i =2 ··· N A i } , meaning they should not be executed within the same process instance.

Question and Answer Content To conduct prompt tuning on the LLM, we generate corresponding textual queries based on simulated anomalous traces. Specifically, each query consists of two components.

The first component introduces the traces, such as ' In the

following business process trace, each executed activity is separated by a comma: [Send acceptance pack, Check credit history, Assess loan risk, Assess eligibility, Prepare acceptance pack] '. The second component queries whether the trace is anomalous, asking, for instance, ' Is this trace normal or anomalous? '. The LLM first responds to whether the given trace is normal or anomalous. If it is anomalous, the LLM is asked about the cause of the anomaly, for example, ' What causes this trace to deviate? '. The LLM then explains the cause of the anomaly, such as ' The activity 'Send acceptance pack' is executed too early, it should be executed after 'Prepare acceptance pack'. '. This descriptive content about the anomaly's cause provides valuable insights and facilitates actions to maintain the health of the process execution.

## Efficient Fine-Tuning on LLMs