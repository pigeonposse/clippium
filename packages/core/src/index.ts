
import { Finder }  from './_shared/finder'
import { Help }    from './help'
import { Parser }  from './parser'
import {
	Validate,
	withValidation,
} from './validate'

import type {
	ClippiumData,
	InferFlag,
	InferPositionals,
	InferPositional,
} from './_shared/data'
import type {
	Argv,
	PartialDeep,
} from './_shared/types'
import type { HelpConfig } from './help'
import type { Parsed }     from './parser'
import type {
	ValidateOptions as ValidateClassOptions,
	ParsedStrict,
	ParsedWithValidation,
	ValidateSettings,
} from './validate'

type ClippiumConfig = {
	/**
	 * Configuration for the help output
	 */
	help?     : PartialDeep<HelpConfig>
	/**
	 * Configuration for the validation process
	 */
	validate? : ValidateSettings
	/**
	 * Configuration for the error output
	 */
	error?    : { on?: ( data: { error: Error } ) => void }
}

type FnData<C extends ClippiumData> = Omit<Parsed<C>, 'raw'> & { utils : {
	data       : C
	config     : ClippiumConfig
	getHelp    : () => string
	getVersion : () => string | undefined
	argv       : Argv
	parsedArgv : Parsed<C>['raw']
} }

export type {
	ClippiumData,
	ClippiumConfig,
	InferFlag,
	InferPositionals,
	InferPositional,
	Parsed,
	ParsedStrict,
}

/**
 * A type assertion function that allows you to define a ClippiumData object
 * with the correct type parameters.
 *
 * @param   {ClippiumData} data - The Clippium Data object
 * @returns {ClippiumData}      - The Clippium Data object
 * @example
 * const data = defineData({
 *   name: 'my-cli',
 *   commands: {
 *     hello: {
 *       desc: 'Say hello',
 *       flags: {
 *         name: {
 *           type: 'string',
 *           desc: 'Your name',
 *         },
 *       },
 *     },
 *   },
 * })
 */
export const defineData = <C extends ClippiumData>( data: C ) =>
	data

/**
 * Return the given Argv array, but without the first two elements which are generally
 * the node and script names.
 *
 * @param   {Argv}     args - Argv array
 * @returns {string[]}      - Argv array without the first two elements
 * @example
 * import process from 'node:process'
 * const args = hideBin( process.argv )
 */
export const hideBin = ( args: Argv ) =>
	args.slice( 2 )

type HelpOptions<D extends ClippiumData> = {
	/**
	 * ClippiumData containing information about the commands and flags
	 */
	data    : D
	/**
	 * Argv array
	 */
	argv    : Argv
	/**
	 * Options for the help formatter
	 */
	config? : ClippiumConfig['help']
}

/**
 * Generate help string based on the given ClippiumData and Argv.
 *
 * @param   {object} opts - Options
 * @returns {string}      - Help string
 */
export const getHelp = <D extends ClippiumData>( opts:HelpOptions<D> ) => {

	const {
		data, argv, config,
	} = opts
	return new Help(
		data,
		{ Finder },
		config,
	).run( argv )

}
type ParseOptions<D extends ClippiumData> = {
	/**
	 * ClippiumData containing information about the commands and flags
	 */
	data : D
	/**
	 * Argv array
	 */
	argv : Argv
}

/**
 * Parse the given Argv and return the parsed data.
 *
 * @template D extends ClippiumData
 * @param   {object}    opts - Options
 * @returns {Parsed<D>}      - Parsed data
 */
export const parse = <D extends ClippiumData>( opts: ParseOptions<D> ) => {

	const {
		data, argv,
	} = opts
	return new Parser( {
		data,
		Finder,
	} ).run( argv )

}

export { withValidation }

type ValidateOptions<D extends ClippiumData> = {
	data    : ValidateClassOptions<D>['data']
	parsed  : ValidateClassOptions<D>['parsedData']
	config? : ValidateSettings
}

/**
 * Validate the parsed data against the given ClippiumData.
 *
 * @template D extends ClippiumData
 * @param   {object} opts - Options
 * @returns {object}      - Result of the validation
 * @example
 * import { parse, validate } from 'clippium'
 * import process from 'node:process'
 *
 * const data = defineData( {...} )
 * const argv = process.argv.slice( 2 )
 * const parsed = parse( { data, argv } )
 * const validated = validate( { data, parsed } )
 */
export const validate =  <D extends ClippiumData>( opts: ValidateOptions<D> ): ParsedWithValidation<D> => {

	const {
		data, parsed,
	} = opts

	return new Validate<D>( {
		data,
		parsedData : parsed,
		Finder,
	}, opts.config ).run( )

}

type ParseAndValidate<D extends ClippiumData> = {
	data    : ValidateClassOptions<D>['data']
	argv    : Argv
	config? : ValidateSettings
}

/**
 * Parse the given Argv and validate the parsed data against the given ClippiumData.
 *
 * @template D extends ClippiumData
 * @param   {object} opts - Options
 * @returns {object}      - Result of the validation
 * @example
 * import { parseAndValidate, defineData, withValidation } from 'clippium'
 * import process from 'node:process'
 *
 * const data = defineData( withValidation({ ... }) )
 * const argv = process.argv.slice( 2 )
 *
 * const validated = parseAndValidate( { data, argv } )
 */
export const parseAndValidate = <D extends ClippiumData>( opts: ParseAndValidate<D> ): ParsedWithValidation<D> => {

	const {
		data, argv, config,
	} = opts

	const parsed = parse<D>( {
		data : data as D,
		argv,
	} )

	return validate<D>( {
		data,
		config,
		parsed,
	} )

}

/**
 * The main class.
 * Used for create command line interfaces (CLIs).
 *
 * @template C Must extend from ClippiumData
 * @example
 * const cli = new Clippium( data )
 * cli.fn = async data => {
 *   // do something
 * }
 * await cli.run( process.argv.slice( 2 ) )
 */
export class Clippium<C extends ClippiumData> {

	/**
	 * ClippiumData containing information about the commands and flags
	 */
	data : C

	/**
	 * Clippium configuration options
	 */
	config : ClippiumConfig

	/**
	 * Construct a new Clippium instance.
	 *
	 * @param {C}              data     - ClippiumData containing information about the commands and flags
	 * @param {ClippiumConfig} [config] - Clippium configuration options
	 */
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
			config : this.config.help,
		} )

	}

	/**
	 * Parse the given Argv and return the parsed data.
	 *
	 * @param   {string[]}  argv - Argv array
	 * @returns {Parsed<C>}      - Parsed data
	 */
	parse( argv: Argv ) {

		return parse( {
			data : this.data,
			argv,
		} )

	}

	validate( data: FnData<C> ) {

		const {
			utils, ...options
		} = data
		return validate<C>( {
			data   : this.data,
			parsed : {
				...options,
				raw : utils.parsedArgv,
			},
			config : this.config.validate,
		} )

	}

	/**
	 * Parse the given Argv and run the function with the parsed data.
	 *
	 * @param   {string[]}      argv - Argv array
	 * @returns {Promise<void>}      - Resolves when the function has finished
	 */
	async run( argv: Argv ) {

		// Must be instanced here to add custom data
		const parsed = this.parse( argv )

		const getHelp    = () => this.getHelp( parsed.raw._ )
		const getVersion = () => this.getVersion()
		const {
			raw, ...rest
		} = parsed
		try {

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
		catch ( error ) {

			const fn = this.config.error?.on
			if ( typeof fn === 'function' ) fn( { error: error instanceof Error ? error : new Error( 'Unknown error' ) } )
			else throw error

		}

	}

}
