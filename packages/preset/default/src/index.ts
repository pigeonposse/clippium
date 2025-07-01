import { Clippium } from 'clippium'

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

export default ( config: Config = {} ) => {

	const {
		version = true, help = true,
	} = config
	const group = typeof config.grouped === 'string' ? config.grouped : config.grouped ? 'Global flags' : undefined
	const cli   = new Clippium( { flags : {
		...( help
			? { help : {
				desc  : 'Show help',
				type  : 'boolean',
				alias : [ 'h' ],
				group,
			} }
			: {} ),
		...( version
			? { version : {
				desc  : 'Show version',
				type  : 'boolean',
				alias : [ 'v' ],
				group,
			} }
			: {} ),
	} } )
	cli.fn      = data => {

		if ( help && data.flags.help ) console.log( data.utils.getHelp() )
		if ( version && data.flags.version ) console.log( data.utils.getVersion() )

	}

	return cli

}

