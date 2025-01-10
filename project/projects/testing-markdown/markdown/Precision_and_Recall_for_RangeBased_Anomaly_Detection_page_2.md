Page 2

function ω ( AnomalyRange , OverlapSet , δ ) MyValue ← 0 MaxValue ← 0 AnomalyLength ← length(AnomalyRange) for i ← 1 , AnomalyLength do Bias ← δ ( i , AnomalyLength ) MaxValue ← MaxValue + Bias if AnomalyRange [i] in OverlapSet then MyValue ← MyValue + Bias return MyValue / MaxValue

// Flat positional bias function δ ( i return 1

, AnomalyLength )

// Front-end positional bias

function δ (

i , AnomalyLength )

return AnomalyLength - i + 1

// Tail-end positional bias

function δ ( i

, AnomalyLength )

return i

(a) Overlap Size

(b) Positional Bias

Figure 1: Example Functions for ω () and δ ()

cardinality , which all stem from the overlap between R i and the set of all predicted anomaly ranges ( P i ∈ P ).

Recall T ( R i , P ) = α × ExistenceReward ( R i , P ) + β × O/v.alt e r l ap Rew ar d ( R i , P ) (4)

If anomaly range R i is identified (i.e., | R i ∩ P j | ≥ 1 across all P j ∈ P ), then an existence reward of 1 is earned.

ExistenceReward ( R i , P ) = { 1 , if /summationtext.1 Np j = 1 | R i ∩ P j | ≥ 1 0 , otherwise (5)

Additionally, an overlap reward, dependent upon three applicationdefined functions 0 ≤ γ () ≤ 1 , 0 ≤ ω () ≤ 1 , and δ () ≥ 1 , can be earned. These functions capture the cardinality ( γ ), size ( ω ), and position ( δ ) of the overlap. The cardinality term serves as a scaling factor for the rewards earned from size and position of the overlap.

O/v.alt e r l ap Rew ar d ( R i , P ) = Cardinalit/y.altF actor ( R i , P )

× Np /summationdisplay.1 j = 1 ω ( R i , R i ∩ P j , δ ) (6)