Page 25

The core structure of Swin-Transformer is shown in Figure 5.

Fig. 5 The structure of Swin-Transformer(NOTE: The figure is from the paper [88])

<!-- image -->

According to Figure 5 (a), the processing flow of Swin-Transformer is as follows:

- ·
- Step 1: Image preprocessing (blocking and dimension reduction) Swin-Transformer first converts an H × W × 3-size image into a 2D image patches of x P ∈ N × ( P 2 × C ). Therefore, the number of blocks is N = ( H × W ) /P 2 , and the dimension of each block is P 2 × 3, Where P is the corresponding block size. In Swin-Transformer, P = 4. Thus Swin-Transformer transforms an H × W × 3 image into a tensor of H/ 4 × W/ 4 × 48.
- · Step 2: Stage 1