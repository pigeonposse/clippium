
# Clippium Benchmarks  🚀

Here you will find the benchmarks created for Clippium, which compare it with other libraries that share the same functionality.

## Statement

Although we created the benchmarks for Clippium, we must clarify that we do not agree with using a microbench as a criterion to measure whether a project is better or worse based on it. 
Speed, in many cases, is not everything and can be affected depending on the execution environment.

[The Microbenchmark Fallacy](https://sindresorhus.com/blog/micro-benchmark-fallacy).

That said, let's clarify these three points:

- Do we care about the performance of our project? **Yes**.
- Do we care about the weight of our project? **Yes**.
- Do we care about the battles to get the best *benchmark*? **NO**.

## Used libraries

| Name | Version |
|--------|---------|
| clippium | 1.0.2 |
| citty | 0.2.2 |
| commander | 14.0.3 |
| meow | 14.1.0 |
| minimist | 1.2.8 |
| mri | 1.2.0 |
| nopt | 9.0.0 |
| sade | 1.8.1 |
| tinybench | 6.0.2 |
| yargs | 18.0.0 |
| yargs-parser | 22.0.0 |

## Parser bench

These benchmarks are for the **parse** function of clippium.

| Name | Mean (ms) | Ops/sec |
|------|-----------|---------|
| clippium-parser | 0.000300 | 3331.50 |
| mri | 0.000522 | 1916.28 |
| minimist | 0.001415 | 706.95 |
| nopt | 0.001853 | 539.81 |
| yargs-parser | 0.014836 | 67.40 |

## CLI bench

| Name | Mean (ms) | Ops/sec |
|------|-----------|---------|
| clippium | 0.000906 | 1103.92 |
| citty | 0.000950 | 1052.84 |
| clippium-with-validation | 0.005836 | 171.36 |
| commander | 0.006500 | 153.85 |
| sade | 0.007827 | 127.77 |
| yargs | 2.168887 | 0.46 |
| meow | 4.913053 | 0.20 |

## Execute

[Execute benchmarks](https://github.com/pigeonposse/clippium/tree/main/packages/bench)

## Conclusion

We can see that the performance of clippium is better than the other libraries in this benchmarks.

Of course, we recommend using the library that best suits your needs, but if we had to choose, these are the ones we would choose:

- **Clippium**: due to its simplicity, versatility, lightness, and customization
- **Yargs**: due to its long history and years of maintenance

