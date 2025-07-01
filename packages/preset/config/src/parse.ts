import { Any } from '@dovenv/core/utils'

import type {
	ClippiumFnParameters,
	ClippiumParsedArgv,
	ConfigFileData,
} from './types'
import type { ClippiumData } from 'clippium'

export const mergeParsedArgv = <C extends ClippiumData>( ...argvs: ClippiumParsedArgv<C>[] ): ClippiumParsedArgv<C> => {

	const result: Any = {}

	for ( const argv of argvs ) {

		for ( const key in argv ) {

			const currentValue  = argv[key as keyof ClippiumParsedArgv<C>]
			const existingValue = result[key]

			if (
				currentValue
				&& typeof currentValue === 'object'
				&& !Array.isArray( currentValue )
				&& existingValue
				&& typeof existingValue === 'object'
				&& !Array.isArray( existingValue )
			) {

				// merge a nivel 2 (objetos anidados)
				result[key] = {
					...existingValue,
					...currentValue,
				}

			}
			else {

				// asignar valor simple o arrays
				result[key] = currentValue

			}

		}

	}

	return result

}

const _parse = <C extends ClippiumData>(
	data: ClippiumFnParameters<C>,
	configFileData: ConfigFileData,
): ClippiumParsedArgv<C> => {

	const result: Any = {}

	if ( configFileData.flags ) {

		result.flags = {}

		for ( const flagName in configFileData.flags )
			if ( !( flagName in data.flags ) )
				result.flags[flagName] = configFileData.flags[flagName]

	}

	if ( configFileData.positionals ) {

		result.positionals = {}

		for ( const posName in configFileData.positionals )
			if ( !( posName in data ) )
				result.positionals[posName] = configFileData.positionals[posName]

	}
	return result

}

export const parse = <C extends ClippiumData>(
	data: ClippiumFnParameters<C>,
	configFileData: ConfigFileData,
): ClippiumParsedArgv<C> => {

	let res    = _parse<C>( data, configFileData )
	const cmds = data.utils.parsedArgv._

	if ( !configFileData.commands || !cmds || cmds.length === 0 ) return res

	for ( const key of cmds ) {

		if ( key in configFileData.commands ) {

			res = mergeParsedArgv<C>(
				res,
				parse<C>( data, configFileData.commands[key] ),
			)

		}

	}

	return res

}
