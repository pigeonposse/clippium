
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
| clippium | 1.0.3 |
| citty | 0.2.2 |
| commander | 14.0.3 |
| meow | 14.1.0 |
| minimist | 1.2.8 |
| mri | 1.2.0 |
| nopt | 10.0.0 |
| sade | 1.8.1 |
| tinybench | 6.0.2 |
| yargs | 18.0.0 |
| yargs-parser | 22.0.0 |

## Parser bench

These benchmarks are for the **parse** function of clippium.

| Name | Mean (ms) | Ops/sec |
|------|-----------|---------|
| clippium-parser | 0.000309 | 3231.84 |
| mri | 0.000528 | 1895.18 |
| minimist | 0.001360 | 735.10 |
| nopt | 0.001893 | 528.22 |
| yargs-parser | 0.014367 | 69.60 |

## CLI bench

| Name | Mean (ms) | Ops/sec |
|------|-----------|---------|
| clippium | 0.000787 | 1270.89 |
| citty | 0.001001 | 998.71 |
| commander | 0.005059 | 197.66 |
| clippium-with-validation | 0.007296 | 137.06 |
| sade | 0.008515 | 117.44 |
| yargs | 2.287186 | 0.44 |
| meow | 8.322624 | 0.12 |

## Execute

[Execute benchmarks](https://github.com/pigeonposse/clippium/tree/main/packages/bench)

## Conclusion

We can see that the performance of clippium is better than the other libraries in this benchmarks.

Of course, we recommend using the library that best suits your needs, but if we had to choose, these are the ones we would choose:

- **Clippium**: due to its simplicity, versatility, lightness, and customization
- **Yargs**: due to its long history and years of maintenance

