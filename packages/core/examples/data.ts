import { defineData } from '../src'

export const nestCommands = defineData( { commands : { nest : {
	desc     : 'Nest commands',
	commands : { nest2 : {
		desc     : 'Nest commands',
		commands : { nest3: { desc: 'Nest commands' } },
	} },
} } } )

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
			commands : nestCommands.commands,
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
				flags : { velocity : {
					desc    : 'choices build',
					type    : 'choices',
					choices : [
						'fast',
						'slow',
						'fastest',
					],
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
			group : 'Global flags:',
		},
		version : {
			desc  : 'Show version',
			type  : 'boolean',
			alias : [ 'v' ],
			group : 'Global flags:',
		},
		verbose : {
			desc       : 'Show verbose output',
			type       : 'boolean',
			alias      : [ 'V' ],
			default    : false,
			group      : 'Global flags:',
			deprecated : true,
		},
		config : {
			desc    : 'Config file',
			type    : 'string',
			alias   : [ 'c' ],
			default : 'config.json',
			group   : 'Global flags:',
		},
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
