import {
	Options,
	Updater,
} from '.'

const packageName = 'binarium'
const run         = async ( o: Options ) => {

	console.log()
	const result = new Updater( o )
	await result.notify()
	await result.run()
	console.log( { data: await result.get() } )

}
await run( {
	name    : packageName,
	version : '2.1.0',
} )

await run( {
	name    : packageName,
	version : '2.0.0',
} )

await run( {
	name    : packageName,
	version : '1.0.0',
} )
