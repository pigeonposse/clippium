
import color         from '@clippium/color'
import { formatter } from '@clippium/preset-colored'
import { Clippium }  from 'clippium'

import { getNext }       from './_shared/array'
import { findAndImport } from './_shared/file'
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
import { AnyPlugin } from './plugin'

const cli = new Clippium( data, { help: { formatter: formatter() } } )

const run = async ( args: string[] ) => {

	try {

		const { flags } = cli.parse( args )

		const config      = await findAndImport<Config>( flags.config ? [ flags.config ] : validaConfigFiles )
		const plugins     = {
			...( config?.plugin || {} ),
			openapi : openapiPlugin,
			esm     : esmFnPlugin,
			schema  : schemaPlugin,
			type    : tsPlugin,
		} as { [k:string]: AnyPlugin }
		const pluginsData = setPluginsData( plugins )

		cli.data = {
			...cli.data,
			commands : {
				...cli.data.commands,
				convert : {
					...cli.data.commands.convert,
					...pluginsData,
				},
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
			else console.log( cli.getHelp( args ) )

		}

		await cli.run( args )

	}
	catch ( err ) {

		console.error( color.red( err instanceof Error ? err.message : 'Unknown error occurred' ) )

	}

}

export {
	run,
	cli,
}

export * from './plugin'

export type {
	Config,
	OpenAPI,
	TypeScript,
	ESMFunctions,
	JSONSchemaGneneric,
}
