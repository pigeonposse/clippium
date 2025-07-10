
import {
	catchError,
	CommonObj,
	joinPath,
} from './_shared/_super'
import {
	jsExtension,
	tsExtension,
} from './_shared/js'
import { jsonExtension } from './_shared/json'
import { setObjectFrom } from './_shared/object'
import { tomlExtension } from './_shared/toml'
import { yamlExtension } from './_shared/yaml'

import type { ClippiumData } from 'clippium'

const TYPES = {
	javascript : { exts: jsExtension },
	typescript : { exts: tsExtension },
	json       : { exts: jsonExtension },
	yaml       : { exts: yamlExtension },
	toml       : { exts: tomlExtension },
	package    : {
		path : 'package',
		exts : jsonExtension,
	},
} as const

type SupportedTypes = keyof typeof TYPES

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
			const [ e, data ] = await catchError( setObjectFrom.json<C>( filename, { key: cliName } ) )
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

				let parser: typeof setObjectFrom[keyof typeof setObjectFrom] | undefined

				switch ( type ) {

					case 'javascript' :
					case 'typescript' :
						parser = setObjectFrom.js
						break
					case 'json' :
						parser = setObjectFrom.json
						break
					case 'yaml' :
						parser = setObjectFrom.yaml
						break
					case 'toml' :
						parser = setObjectFrom.toml
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
