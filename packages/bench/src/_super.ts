import { Bench } from 'tinybench'

export const getBench = async ( opts: {
	name : string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	add  : { [flag: string]: () => Promise<any> | any }
} ) => {

	const bench = new Bench( {
		time : 100,
		name : opts.name,
	} )

	for ( const flag of Object.keys( opts.add ) )
		bench.add( flag, async () => {

			try {

				await opts.add[flag]()

			}
			catch ( error ) {

				throw new Error( `Error running "${flag}": ${error instanceof Error ? error.message : 'Unknown error'}` )

			}

		} )

	await bench.run()
	const results = [ ...bench.tasks ].sort(
		( a, b ) => ( a.result?.latency.mean || 0 ) - ( b.result?.latency.mean || 0 ),
	)

	const all    = bench.table()
	const resume = results.map( task => ( {
		'name'      : task.name,
		'mean (ms)' : task.result?.latency.mean.toFixed( 6 ),
		'ops/sec'   : ( 1 / ( task.result?.latency.mean || 1 ) ).toFixed( 2 ),
	} ) )

	return {
		name : bench.name,
		all,
		resume,
	}

}

export const runBench = async ( opts: {
	name : string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	add  : { [flag: string]: () => Promise<any> | any }
} ) => {

	const bench =  await getBench( opts )

	console.log( bench.name )
	console.table( bench.all )
	console.table( bench.resume )

}

export const logBench = async ( bench: Awaited<ReturnType<typeof getBench>> ) => {

	console.log( bench.name )
	console.table( bench.all )
	console.table( bench.resume )

}
