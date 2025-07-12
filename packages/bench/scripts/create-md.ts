import {
	devDependencies,
	version,
} from '../package.json'
import { get as clisBench } from '../src/clis'
import { get as runParser } from '../src/parser'

const libs = Object.entries( {
	clippium : version,
	...devDependencies,
} )
	.filter( ( [ k ] ) => !k.startsWith( '@types' ) && k !== '@clippium/_config' ) // Excluir @types
	.map( ( [ k, v ] ) => `| ${k} | ${v === 'workspace:*' ? version : v} |` )
	.join( '\n' )

const resCli    = await clisBench()
const resParser = await runParser()

/**
 * Get bench table
 *
 * @param   {typeof resCli.resume} table - Table
 * @returns {string}                     - Table string
 */
const getBenchTable = ( table: typeof resCli.resume ) => {

	const tableHeader = `| Name | Mean (ms) | Ops/sec |
|------|-----------|---------|`

	const tableRows = table
		.map( result => {

			const mean = result['mean (ms)'] ?? '-'
			return `| ${result.name} | ${mean} | ${result['ops/sec']} |`

		} )
		.join( '\n' )

	return `${tableHeader}\n${tableRows}`

}

export const content = `
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
${libs}

## Parser bench

These benchmarks are for the **parse** function of clippium.

${getBenchTable( resParser.resume )}

## CLI bench

${getBenchTable( resCli.resume )}

## Execute

[Execute benchmarks](https://github.com/pigeonposse/clippium/tree/main/packages/bench)

## Conclusion

We can see that the performance of clippium is better than the other libraries in this benchmarks.

Of course, we recommend using the library that best suits your needs, but if we had to choose, these are the ones we would choose:

- **Clippium**: due to its simplicity, versatility, lightness, and customization
- **Yargs**: due to its long history and years of maintenance

`
