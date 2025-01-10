Page 3

## 3.2 Verb-Ob : Detecting verb/object reordering

Our second task tests sensitivity to anomalies in English subject-verb-object (SVO) sentence structure by swapping the positions of verbs and their objects (SVO → SOV). To generate perturbed sentences for this task, we take sentences with a subject-verbobject construction, and reorder the verb (or verb phrase) and the object, as in the example below:

A man wearing a yellow scarf rides a bike . → A man wearing a yellow scarf a bike rides .

We refer to this perturbation as Verb-Ob . Note that Verb-Ob and Mod-Noun are superficially similar tasks in that they both reorder sequentially consecutive constituents. However, importantly, they differ in the hierarchical level of the swap.

## 3.3 SubN-ObN : Detecting subject/object reordering

Our third task tests sensitivity to anomalies in subject-verb-object relationships, creating perturbations by swapping the positions of subject and object nouns in a sentence. For this task, we generate the data by swapping the two head nouns of the subject and the object, as below:

A man wearing a yellow scarf rides a bike . → A bike wearing a yellow scarf rides a man .

We refer to this perturbation as SubN-ObN . We target subject-verb-object structures directly under the root of the syntactic parse, meaning that only one modification is made per sentence for this task.

Detecting the anomaly in this perturbation involves sensitivity to argument structure (the way in which subject, verb, and object should be combined), along with an element of world knowledge (knowing that a bike would not ride a man, nor would a bike typically wear a scarf). 2

## 3.4 Agree-Shift : Detecting subject/verb disagreement

Our fourth task tests sensitivity to anomalies in subject-verb morphological agreement, by changing inflection on a present tense verb to create number disagreement between subject and verb:

A man wearing a yellow scarf rides a bike. → A man wearing a yellow scarf ride a bike.

We refer to this perturbation as Agree-Shift . 3 This is the only one of our tasks that involves a slight change in the word inflection, but the word stem remains the same-we consider this to be consistent with holding word content constant.