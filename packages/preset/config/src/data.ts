
import {
	catchError,
	CommonObj,
	joinPath,
} from './_shared/_super'
import { getObjectFromJSContent }   from './_shared/js'
import { getObjectFromJSONContent } from './_shared/json'
import { readFile }                 from './_shared/read'
import { getObjectFromTOMLContent } from './_shared/toml'
import { getObjectFromYAMLContent } from './_shared/yaml'

import type { ClippiumData } from 'clippium'

const TYPES = {
	javascript : { exts : {
		js  : 'js',
		mjs : 'mjs',
		cjs : 'cjs',
	} },
	typescript : { exts : {
		ts  : 'ts',
		mts : 'mts',
		cts : 'cts',
	} },
	json : { exts: { json: 'json' } },
	yaml : { exts : {
		yaml : 'yaml',
		yml  : 'yml',
	} },
	toml : { exts : {
		toml : 'toml',
		tml  : 'tml',
	} },
	package : {
		path : 'package',
		exts : { json: 'json' },
	},
} as const

type SupportedTypes = keyof typeof TYPES

type Input = string | URL

type GetDataOpts = { key?: string }
const _getData =  async <C extends CommonObj>( cb: typeof getObjectFromJSONContent, i: Input, opts?: GetDataOpts ) => {

	try {

		const content = await readFile( i )
		const res     = await cb( content )
		if ( opts?.key ) return ( res as { [key: string]: C } )[opts.key]
		return res as C

	}
	catch ( error ) {

		throw new Error( `Error getting data from "${i}": ${error instanceof Error ? error.message : 'Unknown error'}` )

	}

}

export const getDataFromJSON =  <C extends CommonObj>( i: Input, opts?: GetDataOpts ) =>
	_getData<C>( getObjectFromJSONContent, i, opts )

export const getDataFromYAML = <C extends CommonObj>( i: Input, opts?: GetDataOpts ) =>
	_getData<C>( getObjectFromYAMLContent, i, opts )
export const getDataFromTOML = <C extends CommonObj>( i: Input, opts?: GetDataOpts ) =>
	_getData<C>( getObjectFromTOMLContent, i, opts )

export const getDataFromJS = <C extends CommonObj>( i: Input, opts?: GetDataOpts ) =>
	_getData<C>( getObjectFromJSContent, i, opts )

type GetDataFrom = typeof getDataFromJSON

export type GetDataConfig = {
	/**
	 * The supported file types
	 *
	 * @default [ 'javascript', 'typescript', 'json', 'yaml', 'toml', 'package' ]
	 */
	supported?   : SupportedTypes[]
	/**
	 * The name of the config file
	 * - If not provided, it will be the same as the name of the cli, and if that is not provided, it will be `config`
	 *
	 * @example [ 'clippium', 'clippium.config' ]
	 */
	configNames? : string[]
	/**
	 * The root directory to search for the configuration file
	 *
	 * @default '.'
	 */
	rootDir?     : string
}

export type GetDataResult<C extends CommonObj> = {
	/**
	 * The value of the config file
	 */
	value : C
	/**
	 * The path of the config file
	 */
	path  : string
	/**
	 * The type of the config file
	 */
	type  : SupportedTypes
}

export const getDataFrom = async <C extends CommonObj>(
	data: ClippiumData,
	config?: GetDataConfig,
): Promise<GetDataResult<C> | undefined> => {

	const cliName = data.name || 'config'
	const {
		supported = [
			'javascript',
			'typescript',
			'json',
			'yaml',
			'toml',
			'package',
		],
		configNames = [ cliName ],
		rootDir = '.',
	} = config || {}

	for ( const type of supported ) {

		if ( type === 'package' ) {

			const filename    = joinPath( rootDir, 'package.json' ) // './package.json'
			const [ e, data ] = await catchError( getDataFromJSON<C>( filename, { key: cliName } ) )
			if ( !e && data !== undefined ) return {
				value : data,
				type,
				path  : filename,
			}
			continue

		}

		const exts = TYPES[type]?.exts
		if ( !exts ) continue

		for ( const configName of configNames ) {

			for ( const ext of Object.values( exts ) ) {

				const filename = joinPath( rootDir, `${configName}.${ext}` ) // `${configName}.${ext}`

				let parser: GetDataFrom | undefined

				switch ( type ) {

					case 'javascript' :
					case 'typescript' :
						parser = getDataFromJS
						break
					case 'json' :
						parser = getDataFromJSON
						break
					case 'yaml' :
						parser = getDataFromYAML
						break
					case 'toml' :
						parser = getDataFromTOML
						break
					default :
						parser = undefined

				}

				if ( !parser ) continue

				const [ error, result ] = await catchError( parser<C>( filename ) )

				if ( !error && result !== undefined ) return {
					value : result,
					type,
					path  : filename,
				}

			}

		}

	}

	return undefined

}
