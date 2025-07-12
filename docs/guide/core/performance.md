
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
| clippium | 0.0.4 |
| citty | 0.1.6 |
| commander | 14.0.0 |
| meow | 13.2.0 |
| minimist | 1.2.8 |
| mri | 1.2.0 |
| nopt | 8.1.0 |
| sade | 1.8.1 |
| tinybench | 4.0.1 |
| yargs | 18.0.0 |
| yargs-parser | 22.0.0 |

## Parser bench

These benchmarks are for the **parse** function of clippium.

| Name | Mean (ms) | Ops/sec |
|------|-----------|---------|
| clippium-parser | 0.000286 | 3498.16 |
| mri | 0.000495 | 2019.96 |
| minimist | 0.001407 | 710.98 |
| nopt | 0.001973 | 506.88 |
| yargs-parser | 0.015318 | 65.28 |

## CLI bench

| Name | Mean (ms) | Ops/sec |
|------|-----------|---------|
| clippium | 0.000948 | 1054.39 |
| citty | 0.001009 | 990.91 |
| commander | 0.005086 | 196.61 |
| sade | 0.006705 | 149.14 |
| meow | 1.597770 | 0.63 |
| yargs | 2.050682 | 0.49 |

## Execute

[Execute benchmarks](https://github.com/pigeonposse/clippium/tree/main/packages/bench)

## Conclusion

We can see that the performance of clippium is better than the other libraries in this benchmarks.

Of course, we recommend using the library that best suits your needs, but if we had to choose, these are the ones we would choose:

- **Clippium**: due to its simplicity, versatility, lightness, and customization
- **Yargs**: due to its long history and years of maintenance

