
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
| clippium | 1.0.5 |
| citty | 0.2.2 |
| commander | 14.0.3 |
| meow | 14.1.0 |
| minimist | 1.2.8 |
| mri | 1.2.0 |
| nopt | 10.0.1 |
| sade | 1.8.1 |
| tinybench | 6.1.2 |
| yargs | 18.1.0 |
| yargs-parser | 22.0.0 |

## Parser bench

These benchmarks are for the **parse** function of clippium.

| Name | Mean (ms) | Ops/sec |
|------|-----------|---------|
| clippium-parser | 0.000321 | 3111.48 |
| mri | 0.000534 | 1871.45 |
| minimist | 0.001387 | 720.84 |
| nopt | 0.001938 | 515.93 |
| yargs-parser | 0.014125 | 70.80 |

## CLI bench

| Name | Mean (ms) | Ops/sec |
|------|-----------|---------|
| clippium | 0.000778 | 1285.12 |
| citty | 0.000924 | 1082.83 |
| clippium-with-validation | 0.004790 | 208.77 |
| commander | 0.005000 | 199.99 |
| sade | 0.007293 | 137.12 |
| yargs | 1.721066 | 0.58 |
| meow | 6.665818 | 0.15 |

## Execute

[Execute benchmarks](https://github.com/pigeonposse/clippium/tree/main/packages/bench)

## Conclusion

We can see that the performance of clippium is better than the other libraries in this benchmarks.

Of course, we recommend using the library that best suits your needs, but if we had to choose, these are the ones we would choose:

- **Clippium**: due to its simplicity, versatility, lightness, and customization
- **Yargs**: due to its long history and years of maintenance

