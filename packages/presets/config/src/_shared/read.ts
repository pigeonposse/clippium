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
