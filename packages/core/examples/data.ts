import { formatter as formatterFn } from '../../preset/colored/src/index'
import color                        from '../../utils/color/src/index'
import { defineData }               from '../src'

const desc = color.white.dim
const link = desc.italic.underline
const info = color.magenta

export const errorStyle = color.redBright

export const formatter = formatterFn( {
	title         : color.cyan.inverse.bold,
	bin           : color.cyan,
	version       : color.cyan.dim.italic,
	name          : color.bold,
	positionals   : color.green.dim,
	commands      : color.green,
	flags         : color.yellow,
	desc,
	examples      : color.cyan,
	sectionTitle  : color.white.bold.underline,
	sectionDesc   : desc,
	sectionsProps : desc.italic,
} )

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
		noColor : {
			desc  : 'Disable color output',
			type  : 'boolean',
			group : 'Global flags:',
		},
	},
	more : [ [ 'Bugs', 'https://github.com/clippium/clippium/issues' ], [ 'Docs', 'https://clippium.pigeonposse.com' ] ]
		.map( ( [ name, l ] ) => `${info( name )}${desc( '    ' )}${link( l )}` )
		.join( '\n' ),
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
} as const )

export const configData = defineData( {
	...data,
	commands : {
		...data.commands,
		new : {
			desc     : 'New command from config',
			commands : nestCommands.commands,
			flags    : { nestflag : {
				type  : 'boolean',
				desc  : 'Nest flag',
				alias : [ 'n' ],
			} },
		},
	},
} as const )
