
import color         from '@clippium/color'
import { formatter } from '@clippium/preset-colored'
import { Clippium }  from 'clippium'

import { getNext }       from './_shared/array'
import { findAndImport } from './_shared/file'
import { Add }           from './add'
import { Config }        from './config'
import { Converter }     from './convert'
import {
	ESMFunctions,
	esmFnPlugin,
} from './convert/esm'
import {
	OpenAPI,
	openapiPlugin,
} from './convert/openapi'
import {
	schemaPlugin,
	JSONSchemaGneneric,
} from './convert/schema'
import {
	tsPlugin,
	TypeScript,
} from './convert/ts'
import {
	convertCommand,
	data,
	setPluginsData,
	validaConfigFiles,
} from './data'
import { Docs }        from './docs'
import {
	Markdown,
	markdownDocsPlugin,
} from './docs/plugin'
import { Init }      from './init'
import { AnyPlugin } from './plugin'

/**
 * Defines and returns the provided configuration object.
 *
 * @template C - Must extend from Config.
 * @param   {C} config - The configuration object to define.
 * @returns {C}        - Returns the provided configuration object.
 */

export const defineConfig = <C extends Config>( config: C ): C =>
	config

export const cli = new Clippium( data, { help : { formatter : formatter( {
	title         : color.cyan.inverse.bold,
	bin           : color.cyan,
	version       : color.cyan.dim.italic,
	name          : color.bold,
	positionals   : color.green.dim,
	commands      : color.green,
	flags         : color.yellow,
	desc          : color.white.dim,
	examples      : color.cyan,
	sectionTitle  : color.white.bold.underline,
	sectionDesc   : color.white.dim,
	sectionsProps : color.white.dim.italic,
} ) } } )

/**
 * The main function to run the CLI.
 *
 * @param   {string[]}      args - The argument vector array.
 * @returns {Promise<void>}      - Resolves when the function has finished.
 */
export const run = async ( args: string[] ) => {

	try {

		const { flags } = cli.parse( args )

		const config      = await findAndImport<Config>( flags.config ? [ flags.config ] : validaConfigFiles )
		const plugins     = {
			...( config?.plugin || {} ),
			openapi : openapiPlugin,
			esm     : esmFnPlugin,
			schema  : schemaPlugin,
			type    : tsPlugin,
			md      : markdownDocsPlugin,
		} as { [k:string]: AnyPlugin }
		const pluginsData = setPluginsData( plugins )

		cli.data = {
			...cli.data,
			commands : {
				...cli.data.commands,
				convert : {
					...cli.data.commands.convert,
					...pluginsData.convert,
				},
				...( pluginsData.docs
					? { docs : {
						...cli.data.commands.docs,
						...pluginsData.docs,
					} }
					: {}
				),
			},
		}

		cli.fn = async data => {

			// console.log( data.flags )
			if ( data.flags.help ) console.log( cli.getHelp( args ) )
			else if ( data.flags.version ) console.log( cli.getVersion() )
			else if ( data.commands.convert ) {

				const value = getNext( data.utils.parsedArgv._, 'convert' )
				if ( !value ) return console.log( cli.getHelp( args ) )

				const converter = new Converter( plugins, data )
				if ( data.commands[convertCommand.toData] )
					await converter.toData( value )
				else if ( data.commands[convertCommand.fromData] )
					await converter.fromData( value )
				else if ( data.commands[convertCommand.toDataSchema] )
					await converter.toDataSchema( value )
				else console.log( cli.getHelp( args ) )

			}
			else if ( data.commands.docs ) {

				const value = getNext( data.utils.parsedArgv._, 'docs' )

				if ( !value ) return console.log( cli.getHelp( args ) )
				const docs = new Docs( plugins, data )
				await docs.run( value )

			}
			else if ( data.commands.init ) {

				const create = new Init( data )
				await create.generate()

			}
			else if ( data.commands.add ) {

				const create = new Add( data )
				await create.generate()

			}
			else console.log( cli.getHelp( args ) )

		}

		await cli.run( args )

	}
	catch ( err ) {

		console.error( color.red( err instanceof Error ? err.message : 'Unknown error occurred' ) )

	}

}

export * from './plugin'

export type {
	Config,
	OpenAPI,
	TypeScript,
	ESMFunctions,
	JSONSchemaGneneric,
	Converter,
	Markdown,
}
