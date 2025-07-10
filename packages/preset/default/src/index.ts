import {
	Clippium,
	ClippiumData,
} from 'clippium'

type Config = {
	/**
	 * If true, will add help flag
	 *
	 * @default true
	 */
	help?    : boolean
	/**
	 * If true, will add version flag
	 *
	 * @default true
	 */
	version? : boolean
	/**
	 * A group name for flags
	 * - `true` will use the default group name `Global flags`
	 *
	 * @default false
	 * @example 'General flags'
	 */
	grouped? : boolean | string
}

/**
 * Get a clippium Data with help and version flags
 *
 * @param   {Config}       [config] - The config options
 * @returns {ClippiumData}          - The created clippium config
 */
export const getData =  ( config: Config = {} ) => {

	const group = typeof config.grouped === 'string' ? config.grouped : config.grouped ? 'Global flags:' : undefined
	return { flags : {
		...( config.help
			? { help : {
				desc  : 'Show help',
				type  : 'boolean',
				alias : [ 'h' ],
				group,
			} }
			: {} ),
		...( config.version
			? { version : {
				desc  : 'Show version',
				type  : 'boolean',
				alias : [ 'v' ],
				group,
			} }
			: {} ),
	} } satisfies ClippiumData

}

/**
 * A preset to add help and version flags to a clippium app
 *
 * @param   {Config}   [config] - The config options
 * @returns {Clippium}          - The modified clippium app
 * @example
 * import presetDefault from '@clippium/preset-default'
 * import {Clippium} from 'clippium'
 * const preset = presetDefault(config)
 * const cli = new Clippium({
 *    flags: preset.data.flags
 * })
 * cli.fn = async data => {
 *   await preset.data.fn(data)
 * }
 *
 * export default cli
 */
const preset = ( config: Config = {} ) => {

	const {
		version = true, help = true,
	} = config

	const cli = new Clippium( getData( {
		version,
		help,
		...config,
	} ) )
	cli.fn    = data => {

		if ( help && data.flags.help ) console.log( data.utils.getHelp() )
		else if ( version && data.flags.version ) console.log( data.utils.getVersion() )

	}

	return cli

}

export default preset
