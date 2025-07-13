
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
| clippium | 0.1.0 |
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
| clippium-parser | 0.000289 | 3455.01 |
| mri | 0.000490 | 2041.11 |
| minimist | 0.001402 | 713.36 |
| nopt | 0.001853 | 539.63 |
| yargs-parser | 0.014106 | 70.89 |

## CLI bench

| Name | Mean (ms) | Ops/sec |
|------|-----------|---------|
| clippium | 0.000984 | 1016.73 |
| citty | 0.001036 | 965.49 |
| commander | 0.005897 | 169.57 |
| sade | 0.007528 | 132.83 |
| meow | 2.031524 | 0.49 |
| yargs | 2.508152 | 0.40 |

## Execute

[Execute benchmarks](https://github.com/pigeonposse/clippium/tree/main/packages/bench)

## Conclusion

We can see that the performance of clippium is better than the other libraries in this benchmarks.

Of course, we recommend using the library that best suits your needs, but if we had to choose, these are the ones we would choose:

- **Clippium**: due to its simplicity, versatility, lightness, and customization
- **Yargs**: due to its long history and years of maintenance

