
import { Any } from './_shared/types'
import {
	Clippium,
	defineData,
} from './index'
import { formatter } from '../../preset/colored/src/index'

export const data = defineData( {
	name     : 'clipplium-test',
	version  : '0.0.1',
	desc     : 'Command Line Interface with Powerful and Pristine Operations',
	commands : {
		greet : {
			desc        : 'Greet someone',
			positionals : { target : {
				desc    : 'The person to greet',
				type    : 'string',
				default : 'World',
			} },
			flags : {
				message : {
					desc : 'Message to greet',
					type : 'string',
				},
				loud : {
					desc   : 'Make the greeting loud',
					type   : 'boolean',
					hidden : true,
				},
			},
			examples : [
				{
					value : '$0 John',
					desc  : 'Greet John',
				},
			],
		},
		nest : {
			desc     : 'Nest commands',
			commands : { nest2 : {
				desc     : 'Nest commands',
				commands : { nest3: { desc: 'Nest commands' } },
			} },
		},
		build : {
			desc     : 'Builds the application',
			examples : [
				{
					value : '$0 build ./src ./dist -m',
					desc  : 'Builds the application from src to dist',
				},
			],
			commands : { pro : {
				desc  : 'Builds the application in production mode',
				flags : { fast : {
					desc  : 'fast build',
					type  : 'boolean',
					alias : [ 'f' ],
				} },
				commands : { extra: { desc: 'Builds the application in production mode' } },
			} },
			positionals : {
				src : {
					desc : 'Source directory',
					type : 'string',
				},
				dest : {
					desc : 'Destination directory',
					type : 'string',
				},
			},
			flags : { minify : {
				desc  : 'Minify the output',
				type  : 'boolean',
				alias : [ 'm' ],
			} },
		},
	},
	flags : {
		help : {
			desc  : 'Show help',
			type  : 'boolean',
			alias : [ 'h' ],
			group : 'Global flags',
		},
		version : {
			desc  : 'Show version',
			type  : 'boolean',
			alias : [ 'v' ],
			group : 'Global flags',
		},
		verbose : {
			desc       : 'Show verbose output',
			type       : 'boolean',
			alias      : [ 'V' ],
			default    : false,
			group      : 'Global flags',
			deprecated : true,
		},
		config : {
			desc    : 'Config file',
			type    : 'string',
			alias   : [ 'c' ],
			default : 'config.json',
			group   : 'Global flags',
		},
		// ...( !existsConfig
		// 	? {}
		// 	: { dynamicFlag : {
		// 		desc : 'New flag',
		// 		type : 'boolean',
		// 	} } ),
	},
	examples : [
		{
			value : '$0 greet John',
			desc  : 'Greet John',
		},
		{
			value : '$0 build --src src --dest dist',
			desc  : 'Builds the application from src to dist',
		},
	],
} )

// console.log( formatter.setExamples( data ) )
try {

	const isBrowser = typeof window !== 'undefined'
	const args      = isBrowser
		? [
			'greet',
			'John',
			'-h',
		]
		: process.argv.slice( 2 )

	// let existsConfig  = false
	const clippiumApp = new Clippium(
		data,
		{ help: { formatter: formatter as Any } },
	)

	clippiumApp.fn = async ( {
		utils, ...args
	} ): Promise<void> => {

		const {
			commands, flags, positionals,
		} = args
		// example for add dynamic flags from config file
		if ( flags.config ) {

			// Not working
			// existsConfig = true
			// console.log( `Dynamic flag from config file: ${flags.dynamicFlag}` )

			// WORKING: not typed version
			clippiumApp.data = {
				...clippiumApp.data,
				commands : {
					...clippiumApp.data.commands,
					// @ts-ignore
					new : { desc: 'New command from config' },
				},
			}

		}
		// console.log( '\n', args )

		const help    = flags.help || flags.h
		const version = flags.version || flags.v

		if ( help ) return console.log( utils.getHelp() )
		if ( version ) return console.log( utils.getVersion() )

		if ( positionals.target ) {

			const name    = positionals.target || 'World'
			const message = flags.message || 'Hello'
			const loud    = flags.loud

			console.log( `\nEjecutando el comando 'greet':` )
			console.log( `Mensaje: ${message}, Nombre: ${name}, Loud: ${loud ? 'YES' : 'NO'}` )
			console.log( `${message}, ${name}${loud ? '!!!' : '.'}` )

		}
		else if ( commands.build ) {

			const source      = positionals.src || './src'
			const destination = positionals.dest || './dist'
			const minify      = flags.minify || flags.m

			console.log( `\nEjecutando el comando 'build':` )
			console.log( `Fuente: ${source}, Destino: ${destination}, Minificar: ${minify ? 'SÍ' : 'NO'}` )
			console.log( 'Construcción completada exitosamente.' )

		}
		else {

			console.log( `\nComando '${Object.keys( commands )[0] || 'ninguno'}' no reconocido.` )
			console.log( 'Intenta: npm start -- greet --message "Hi there" --loud John' )
			console.log( 'O: npm start -- build --src app --dest build --minify' )

		}

	}

	await clippiumApp.run( args )

}
catch ( error ) {

	console.error( '\n--- Error durante la ejecución de Clippium ---' )
	console.error( error )

}
