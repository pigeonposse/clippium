
import {
	ClippiumData,
	InferFlag,
	InferPositionals,
} from './_shared/data'
import { Finder } from './_shared/finder'
import {
	Help,
	HelpConfig,
} from './help'
import {
	ParserData,
	type ParsedDataArgv,
} from './parser'

import type {
	Argv,
	PartialDeep,
} from './_shared/types'
import type { ParserRes } from './parser'

type ClippiumConfig = { help?: PartialDeep<HelpConfig> }

type FnData<C extends ClippiumData> = Omit<ParserRes<C>, 'raw'> & { utils : {
	data       : C
	config     : ClippiumConfig
	getHelp    : () => string
	getVersion : () => string | undefined
	argv       : Argv
	parsedArgv : ParserRes<C>['raw']
} }

export type {
	ClippiumData,
	ClippiumConfig,
	InferFlag,
	InferPositionals,
	ParsedDataArgv,
}

export const defineData = <C extends ClippiumData>( data: C ) => data
export const hiddenBin = ( args: Argv ) => args.slice( 2 )

/**
 * Generate help string based on the given ClippiumData and Argv.
 *
 * @param   {object}       opts          - Options
 * @param   {ClippiumData} opts.data     - ClippiumData containing information about the commands and flags
 * @param   {string[]}     opts.argv     - Argv array
 * @param   {object}       [opts.config] - Options for the help formatter
 * @returns {string}                     - Help string
 */
export const getHelp = ( {
	data, argv, config,
}:{
	data   : ClippiumData
	argv   : Argv
	config : ClippiumConfig
} ) => {

	return new Help(
		data,
		{ Finder },
		config?.help,
	).run( argv )

}

/**
 * Parse the given Argv and return the parsed data.
 *
 * @template D extends ClippiumData
 * @param   {object}       opts      - Options
 * @param   {D}            opts.data - ClippiumData containing information about the commands and flags
 * @param   {string[]}     opts.argv - Argv array
 * @returns {ParserRes<D>}           - Parsed data
 */
export const parse = <D extends ClippiumData>( {
	data, argv,
}:{
	data : D
	argv : Argv
} ) =>
	new ParserData( data, { Finder } ).run( argv )

export class Clippium<C extends ClippiumData> {

	/**
	 * ClippiumData containing information about the commands and flags
	 */
	data : C

	/**
	 * Clippium configuration options
	 */
	config : ClippiumConfig

	constructor( data: C, config: ClippiumConfig = {} ) {

		this.data   = data
		this.config = config

	}

	fn: ( data: FnData<C> ) => Promise<void> | void = _args => {

		// nothing by default

	}

	/**
	 * Retrieve the version information from the Clippium data.
	 *
	 * @returns {string | undefined} - The version string, or undefined if not set.
	 */
	getVersion( ) {

		return this.data.version

	}

	/**
	 * Generate a help string based on the current Clippium data and provided arguments.
	 *
	 * @param   {Argv}   argv - The argument vector array.
	 * @returns {string}      - The formatted help string.
	 */
	getHelp( argv: Argv ) {

		return getHelp( {
			data   : this.data,
			argv,
			config : this.config,
		} )

	}

	/**
	 * Parse the given Argv and return the parsed data.
	 *
	 * @param   {string[]}     argv - Argv array
	 * @returns {ParserRes<C>}      - Parsed data
	 */
	parse( argv: Argv ) {

		return parse( {
			data : this.data,
			argv,
		} )

	}

	/**
	 * Parse the given Argv and run the function with the parsed data.
	 *
	 * @param   {string[]}      argv - Argv array
	 * @returns {Promise<void>}      - Resolves when the function has finished
	 * @example
	 * const clippium = new Clippium( data )
	 * clippium.fn = async data => {
	 *   // do something
	 * }
	 * clippium.run( process.argv.slice( 2 ) )
	 */
	async run( argv: Argv ) {

		// Must be instanced here to add custom data
		const parsed = this.parse( argv )

		const getHelp    = () => this.getHelp( parsed.raw._ )
		const getVersion = () => this.getVersion()
		const {
			raw, ...rest
		} = parsed
		return await this.fn( {
			...rest,
			utils : {
				data       : this.data,
				config     : this.config,
				getHelp,
				getVersion,
				argv,
				parsedArgv : raw,
			},
		} )

	}

}
