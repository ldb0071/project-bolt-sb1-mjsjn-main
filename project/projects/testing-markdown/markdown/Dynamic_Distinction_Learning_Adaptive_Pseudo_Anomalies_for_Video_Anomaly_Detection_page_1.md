Page 1

## Dynamic Distinction Learning: Adaptive Pseudo Anomalies for Video Anomaly Detection

## Demetris Lappas

## Vasileios Argyriou

k1838447@kingston.ac.uk

vasileios.argyriou@kingston.ac.uk

## Dimitrios Makris

d.makris@kingston.ac.uk

## Kingston University, London, UK, School of Computer Science and Mathematics

## Abstract

We introduce Dynamic Distinction Learning (DDL) for Video Anomaly Detection, a novel video anomaly detection methodology that combines pseudo-anomalies, dynamic anomaly weighting, and a distinction loss function to improve detection accuracy. By training on pseudoanomalies, our approach adapts to the variability of normal and anomalous behaviors without fixed anomaly thresholds. Our model showcases superior performance on the Ped2, Avenue and ShanghaiTech datasets, where individual models are tailored for each scene. These achievements highlight DDL's effectiveness in advancing anomaly detection, offering a scalable and adaptable solution for video surveillance challenges. Our work can be found on: https://github.com/demetrislappas/DDL.git

## 1. Introduction

Anomaly detection is pivotal in the field of video surveillance, where algorithms scan through endless hours of footage to identify activities or events that deviate from the norm-be it unauthorized intrusions, unusual behavior, or safety breaches. Its application in video analysis is indispensable across a multitude of sectors, underpinning security protocols, ensuring public safety, and enhancing operational efficiency. The capacity of video anomaly detection systems to flag deviations in real-time or in hindsight allows organizations to take quick, informed action to mitigate risks.