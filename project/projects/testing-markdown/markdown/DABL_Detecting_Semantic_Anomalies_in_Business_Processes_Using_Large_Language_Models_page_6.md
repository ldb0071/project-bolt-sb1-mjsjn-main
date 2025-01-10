Page 6

RRAP

: Receive Result Appeal from Prefecture;

IDAP

: Insert Date Appeal to Prefecture;

SAP

: Send Appeal to Prefecture.

is normal or anomalous.

definitively whether this trace is normal or anomalous.

employees with the necessary tools and access to perform their job.

executed activity is separated by a comma in the trace.

The trace is anomalous.

necessary work equipment'.

Figure 6: Qualitative results of various LLMs on an exclusion anomaly.

<!-- image -->

Figure 5: Qualitative results of various LLMs on an early anomaly.

<!-- image -->

Due to the absence of business process-related knowledge, existing LLMs may not offer definitive answers. In contrast, our DABL is proficient in identifying anomalies and interpreting their underlying causes, thanks to the integration of a vast array of process models from diverse domains in the training data.

## Real-world Application

Travel Permit Weapply our DABL on a real-world permit log from the BPI 2020 challenge (van Dongen 2020), which captures data on work trips conducted by university employees. The process flow involves the request for and approval of a travel permit, the trip itself, a subsequent travel declaration, as well as associated reimbursements.

This log contains 7,065 traces with 1,478 variants (traces with different orders of activities are executed). DABL iden-

Here is a trace of a business process, with each performed activity separated by a comma: [S