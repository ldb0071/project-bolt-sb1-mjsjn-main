Page 5

However, these result values may be underestimated because the cause of an anomaly can be interpreted in various ways. For example, for a desired trace [A, B, C, D, E], the anomaly [A, B, E, C, D] can be interpreted as 'The activities 'C' and 'D' are executed too late, they should be executed after 'B'' and 'The activity 'E' is executed too early, it should be executed after 'D'.' Nevertheless, we only provide one reference answer to calculate ROUGE-2 and ROUGE-L scores.

## Qualitative Examples

Fig. 5 and Fig. 6 illustrate the performance of existing LLMs and DABL on early and exclusion anomalies, respectively.

-3.5

-4

-3

BL

BL

Table 4: Irregularity patterns identified in the travel permit log.

| ID    | Example Trace                                                                                          | Output Cause                                                                                                                                                                                                                                                                                                                                                                                                                 |
|-------|--------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| A1    | [ST, PSE, PAA, PAB, PAS, PFAD, DSE, DAA, DAB, DFAS, RP, PH, ET]                                        | The activity 'Start trip' should not be executed.                                                                                                                                                                                                                                                                                                                                                                            |
| A2    | [PSE, ST, PAA, PAB, PAS, PFAD, DSAE, ET]                                                               | The activity 'Start trip' is executed too early, it should be executed after 'Permit FINAL APPROVED by DIRECTOR'.                                                                                                                                                                                                                                                                                                            |
| A3    | [PSE, PAS, ST, PFAD, PRM, ET]                                                                          | The activity 'Permit REJECTED by MISSING' is mutually exclusive with the activity 'Start trip', meaning they should not be executed within the same process instance.                                                                                                                                                                                                                                                        |
| A4 A5 | [ST, ET, PSE, PFAS, DSE, DFAS, RP, PRM, PH] [PSE, PAA, RSE, RAA, RAB, RFAS, RP, PAB, PFAS, PH, ST, ET] | The activity 'Permit REJECTED by MISSING' is mutually exclusive with the activities 'Payment Handled' and 'Declaration FINAL APPROVED by SUPERVISOR', meaning they should not be executed within the same process instance. The activities 'Permit APPROVED by BUDGET OWNER' and 'Permit FINAL APPROVED by SUPERVISOR' are executed too late, they should be executed before 'Request For Payment APPROVED by BUDGET OWNER'. |

PSE : Permit SUBMITTED by EMPLOYEE; PAA : Permit APPROVED by ADMINISTRATION; PAB : Permit APPROVED by BUDGET OWNER; PAS : Permit APPROVED by SUPERVISOR; PFAS : Permit FINAL APPROVED by SUPERVISOR; PFAD : Permit FINAL APPROVED by DIRECTOR; PRM : Permit REJECTED by MISSING; RSE : Request For Payment SUBMITTED by EMPLOYEE; RRA : Request For Payment REJECTED by ADMINISTRATION; RRE : Request For Payment REJECTED by EMPLOYEE; RAA : Request For Payment APPROVED by ADMINISTRATION; RAB : Request For Payment APPROVED by BUDGET OWNER; RFAS : Request For Payment FINAL APPROVED by SUPERVISOR; DSAE : Declaration SAVED by EMPLOYEE; DSE : Declaration SUBMITTED by EMPLOYEE; DRA : Declaration REJECTED by ADMINISTRATION; DRE : Declaration REJECTED by EMPLOYEE; DAA : Declaration APPROVED by ADMINISTRATION; DAB : Declaration APPROVED by BUDGET OWNER; DFAS : Declaration FINAL APPROVED by SUPERVISOR; RP : Request Payment; PH : Payment Handled; SR : Send Reminder; ST : Start trip; ET : End trip.

Table 5: Irregularity patterns identified in the road traffic fine management log.

| ID   | Example Trace                         | Output Cause                                                                                                                         |
|------|---------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| A1   | [CF, SF, IFN, AP, P, P, P, P]         | The activities 'Payment' and 'Payment' are reworked after 'Payment'.                                                                 |
| A2   | [CF, P, P, SF, IFN, AP, P]            | The activities 'Payment' and 'Payment' are executed too early, they should be executed after 'Add penalty'.                          |
| A3   | [CF, SF, IFN, RRAP, IDAP, SAP, AP, P] | The activity 'Receive Result Appeal from Prefecture' is executed too early, it should be executed after 'Send Appeal to Prefecture'. |

CF

: Create Fine; SF: Send Fine;

IFN

: Insert Fine Notification;

AP

: Add penalty;

P

: Payment;