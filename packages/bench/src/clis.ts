
import {
	defineCommand,
	runMain,
} from 'citty'
import { Command } from 'commander'
import meow        from 'meow'
import sade        from 'sade'
import yargs       from 'yargs'

import { runBench }          from './_super'
import { parse as clippium } from '../../core/dist/index.mjs'

const args = [
	'convert',
	'./src/index.js',
	'-b',
	'--bool',
	'--meep',
	'--multi=baz',
]

export const run = async () => runBench( {
	name : 'CLI',
	add  : {
		clippium : () => {

			const data = clippium( {
				argv : args,
				data : {
					commands : { convert : {
						desc        : 'Convert command',
						positionals : { input : {
							type  : 'string',
							desc  : 'Input file',
							alias : [ 'i' ],
						} },
					} },
					flags : {
						bool : {
							desc  : 'Boolean flag',
							type  : 'boolean',
							alias : [ 'b' ],
						},
						meep : {
							desc : 'Meep flag',
							type : 'boolean',
						},
						multi : {
							desc : 'Multi flag',
							type : 'string',
						},
					},
				},
			} )
			return data

		},
		citty : () => {

			const main =  defineCommand( {
				meta : {
					name    : 'cli',
					version : '0.0.1',
				},
				subCommands : { convert : { args : {
					input : {
						type     : 'string',
						required : false,
					},
					bool  : { type: 'boolean' },
					meep  : { type: 'boolean' },
					multi : { type: 'string' },
				} } },
				args : {
					input : {
						type     : 'string',
						required : false,
					},
					bool  : { type: 'boolean' },
					meep  : { type: 'boolean' },
					multi : { type: 'string' },

				},
				run : _ => {
					// nothing
				},
			} )
			runMain( main )

			// runMain( main )

		},

		yargs : () =>
			yargs( args )
				.command( 'convert <input>', 'Convert command' )
				.option( 'bool', {
					type  : 'boolean',
					alias : 'b',
				} )
				.option( 'meep', { type: 'boolean' } )
				.option( 'multi', { type: 'string' } )
				.parse(),

		commander : () => {

			const program = new Command()

			program
				.name( 'cli' )
				.command( 'convert <input>' )
				.option( '-b, --bool', 'Boolean flag' )
				.option( '--meep', 'Meep flag' )
				.option( '--multi <value>', 'Multi flag' )
				.action( _ => {
					// nothing
				} )
			program.exitOverride() // prevent process.exit
			program.parse( args, { from: 'user' } )

		},

		sade : () => {

			const cli = sade( 'cli' )
				.command( 'convert <input>' )
				.option( '--bool, -b', 'Boolean flag' )
				.option( '--meep', 'Meep flag' )
				.option( '--multi', 'Multi flag' )
				.action( _ => {
					// nothing
				} )

			cli.parse( [
				'node',
				'fake-file.js',
				...args,
			] )
			return cli

		},

		meow : () => {

			const data = meow(
				`
				Usage
				  $ cli convert <input>

				Options
				  --bool      Boolean flag
				  --meep      Meep flag
				  --multi     Multi flag
				`,
				{

					argv       : args,
					importMeta : import.meta,
					flags      : {
						bool  : { type: 'boolean' },
						meep  : { type: 'boolean' },
						multi : { type: 'string' },
					},
				},
			)
			return data
			// cli.showHelp()

		},
	},
} )
