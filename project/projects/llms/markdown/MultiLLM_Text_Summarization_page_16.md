# Page 16

## Page Information

- **Type**: figure_page
- **Word Count**: 67
- **Has Tables**: False
- **Has Figures**: True

## Content

# Page 16

## Algorithm 1 Centralized Multi-LLM Summary

Require: ordered set S = { S 1 , . . . , S m } of summaries, set M = { M 1 , . . . , M k } of k LLMs, a central agent C ∈ M , max number of conversational rounds t max , initial summarization prompt P ( e.g. , Figure 2), evaluation prompt P e c ( e.g. , Figure 5) for centralized version

Ensure: summary S ∗ of the text

1: S = CREATESUMMARY ( S )

2:

for

i

= 1

to

t

3:

for each

model

M

4:

S

5:

Send

S

6:

Let

S

7:

E

i

=

{

S

=

C

(

P

=

M

(

i

)

j

(

i

)

1

ec

j

(

P, S

)

to agent

C

, S

,

S

(

i

)

2

i

)

8: r = AGGRRESULTS ( E ( i ) )

9:

j

←

argmax

M

10: Set S ∗ ← S ( i ) j

11: if CONVERGED ( r ) then return S ∗

- 12: Set P to prompt in Figure 3.

Provide a concise summary of the text in around 160 words. Output the summary text only and nothing else. [text]

Figure 2: Prompt for generating the initial summary in the first round.

Given the original text below, along with the summaries of that text by [k] LLMs, please generate a better summary of the original text in about 160 words.

ORIGINAL:

[text]

j

∈M

r

j

, . . . , S

(

i

)

(

i

)

j

max

do

▷ conversation rounds

}

Summary by

M

1

:

[LLM 1's summary]

.

.

.

Summary by M k : [LLM k's summary]

Figure 3: Generation prompt that is used after the initial round of conversation among the multiple LLMs. Note that the above prompt is for generating the final summary, however, for the chunk-level generation, it would just be the actual chunk.

## Visual Content

### Page Preview

![Page 16](/projects/llms/images/MultiLLM_Text_Summarization_page_16.png)

### Figures

![](/projects/llms/figures/MultiLLM_Text_Summarization_page_16_figure_1.png)

