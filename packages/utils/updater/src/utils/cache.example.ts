import { Cache } from './cache'

const cache = new Cache<{
	boolean     : boolean
	number      : number
	string      : string
	array       : number[]
	nonExistent : string
	arrayMulti  : number[]
}>( 'clippium-updater-test' )

const cached = {
	boolean     : await cache.get( 'boolean' ),
	number      : await cache.get( 'number' ),
	string      : await cache.get( 'string' ),
	array       : await cache.get( 'array' ),
	nonExistent : await cache.get( 'nonExistent' ),
	arrayMulti  : await cache.get( 'arrayMulti' ),
}

await cache.set( 'boolean', false )
await cache.set( 'number', 12 )
await cache.set( 'string', 'es' )
await cache.set( 'array', [
	0,
	1,
	2,
	4,
] )

const updated = {
	boolean     : await cache.get( 'boolean' ),
	number      : await cache.get( 'number' ),
	string      : await cache.get( 'string' ),
	array       : await cache.get( 'array' ),
	nonExistent : await cache.get( 'nonExistent' ),
	arrayMulti  : await cache.get( 'arrayMulti' ),
}

console.log( {
	cached,
	updated,
} )
