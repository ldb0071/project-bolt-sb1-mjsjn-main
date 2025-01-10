Page 14

## A. Additional Information

In this section, the detailed network architectures and the index-class mappings of each benchmark dataset are provided.

## A.1. Index-class mapping

The corresponding index-class mapping for each benchmark dataset used in Section 4.2 is summarised in Table 6.

## A.2. Network architectures

The network architectures used in this work include the naive encoder-decoder, UNet, and UNet++. The architecture is summarised as in Table 7. Meanwhile, we demonstrate the model size and running speed in Table 8. The inference speed measured is the duration of inferencing one 32x32 image. Here, the naive encoder-decoder contains the smallest parameter sizes and has the fastest inference speed, while the UNet++ is 3 times slower than UNet though similar parameter sizes obtained.

| Operation                                                             |                         | out          |
|-----------------------------------------------------------------------|-------------------------|--------------|
| Conv LeakyReLU Conv BatchNorm LeakyReLU Conv BatchNorm LeakyReLU Conv | in 1 - 64 128 - 128 256 | 64 - 128 - - |
| ConvTranspose BatchNorm ReLU                                          | 100 256                 | 256          |
|                                                                       |                         | -            |
|                                                                       |                         | 256          |
|                                                                       |                         | -            |
|                                                                       | -                       | -            |
|                                                                       | 256                     | 100          |
|                                                                       | -                       | -            |
| ConvTranspose                                                         | 256                     |              |
| BatchNorm                                                             |                         | 128          |
| ReLU                                                                  | 128                     | -            |
|                                                                       | -                       | -            |
| ConvTranspose                                                         | 128                     | 64           |
| BatchNorm                                                             | 64                      | -            |
| ReLU                                                                  | -                       | -            |
| ConvTranspose                                                         | 64                      | 1            |

## Table 7

The naive encoder-decoder network architecture. For each 𝐶𝑜𝑛𝑣 and 𝐶𝑜𝑛𝑣𝑇𝑟𝑎𝑛𝑠𝑝𝑜𝑠𝑒 operation, kernel size is set to 4 with 2 stride and 1 padding. LeakyReLU uses 0.2 for negative slope.

| Generator   | Spec                  |       | No. Param Inference speed   |
|-------------|-----------------------|-------|-----------------------------|
| Naive       | naive encoder-decoder | 2.04M | 2.67ms                      |
| UNet        | skip-connection       | 7.76M | 5.41ms                      |
| UNet++      | dense skip pathways   | 9.04M | 16.73ms                     |

An overview of the experimented networks.

<!-- image -->

Figure 5: Network Architectures. each node represents convolution operations (e.g. 𝑅𝑒𝐿𝑈 -𝐶𝑜𝑛𝑣 -𝐵𝑎𝑡𝑐ℎ𝑁𝑜𝑟𝑚 for downsampling, 𝑅𝑒𝐿𝑈 -𝐶𝑜𝑛𝑣𝑇𝑟𝑎𝑛𝑠𝑝𝑜𝑠𝑒 -𝐵𝑎𝑡𝑐ℎ𝑁𝑜𝑟𝑚 for upsampling), solid arrows mean forward operation, while dashed arrows mean skip-connections. Detailed network settings are as same as the original works.

<!-- image -->

0