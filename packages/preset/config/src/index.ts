
import { Prettify }    from './_shared/_super'
import { getDataFrom } from './data'
import {
	mergeParsedArgv,
	parse,
} from './parse'

import type {
	GetDataConfig,
	GetDataResult,
} from './data'
import type {
	ConfigFileData,
	ClippiumFnParameters,

	InferConfigFileData,
	ClippiumParsedArgv,
} from './types'
import type { ClippiumData } from 'clippium'

type FnResult<C extends ClippiumData> = {
	/**
	 * Clippium parsed argv data from the config file and merged with the initial argv
	 */
	value : Prettify<ClippiumParsedArgv<C>>
	/**
	 * Data from the config file
	 */
	data? : {
		/**
		 * Content of the config file
		 */
		content : ConfigFileData | InferConfigFileData<C>
		/**
		 * This is only the config file data parsed as clippium argv
		 */
		parsed  : ClippiumParsedArgv<C>
	} & Omit<GetDataResult<ConfigFileData>, 'value'>
}

type Config = GetDataConfig

export type {
	ConfigFileData,
	InferConfigFileData,
	Config,
}
export default ( config: Config ) => {

	const fn = async <C extends ClippiumData>( data: ClippiumFnParameters<C> ): Promise<Prettify<FnResult<C>>> => {

		const {
			utils, ...initParsedData
		} = data
		const configData = await getDataFrom<ConfigFileData>( utils.data, config )
		if ( !configData ) return { value: initParsedData }

		const {
			value, ...restConfig
		} = configData
		const parsedData = parse<C>( data, value )
		return {
			value : mergeParsedArgv<C>( parsedData, initParsedData ),
			data  : {
				...restConfig,
				parsed  : parsedData,
				content : value,

			},
		}

	}

	return fn

}

