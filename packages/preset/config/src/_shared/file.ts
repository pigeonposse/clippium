import { isBrowser }     from './_super'
import { getStringType } from './string'

export type Input = string | URL

export const readFile = async ( i: Input ) => {

	const type = i instanceof URL ? 'url' : getStringType( i )

	if ( type === 'text' ) return i as string
	if ( type === 'url' ) return fetch( i ).then( r => r.text() )

	if ( isBrowser ) return fetch( i ).then( r => r.text() )
	return import( 'node:fs/promises' ).then( ( { readFile } ) => readFile( i, 'utf8' ) )

}

export const writeFile = async ( i: string, content: string | Uint8Array ) => {

	if ( isBrowser ) throw new Error( 'Writing to the filesystem is not supported in the browser' )

	const { writeFile } = await import( 'node:fs/promises' )
	return writeFile( i as string, content, 'utf8' )

}

export const ensureDir = async ( path: string ) => {

	if ( isBrowser ) throw new Error( 'ensureDir is not supported in the browser' )

	const {
		mkdir, stat,
	} = await import( 'node:fs/promises' )
	const {
		dirname, extname,
	} = await import( 'node:path' )
	let dir = path

	try {

		const stats = await stat( path )

		if ( stats.isFile() ) dir = dirname( path )

	}
	catch {

		// Si no existe: asumir que es archivo si tiene extensión, si no, es directorio
		if ( extname( path ) ) dir = dirname( path )

	}

	return mkdir( dir, { recursive: true } )

}
