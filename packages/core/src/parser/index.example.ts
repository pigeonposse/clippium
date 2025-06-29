import { ParserData } from './index'
import { Finder }     from '../_shared/finder'

const parser = new ParserData( {
	commands : {
		TEST : {
			desc     : 'Main command',
			commands : { TEST_CHILD : {
				desc     : 'Child command',
				commands : { TEST_CHILD_CHILD : {
					desc  : 'Child child command',
					flags : { number : {
						desc : 'Flag in child child',
						type : 'boolean',
					} },
				} },
			} },
			flags : {
				speificNumber : {
					desc    : 'A number with choices',
					default : 1,
					type    : 'choices',
					choices : [
						1,
						2,
						3,
						4,
					],
				},
				TEST_FLAG : {
					desc : 'A string flag',
					type : 'string',
				},
			},
		},
		test2 : { desc: 'Second command' },
	},
	positionals : { app : {
		desc    : 'A string positional',
		type    : 'string',
		default : './src',
	} },
	flags : {
		help : {
			desc    : 'Show help',
			default : true,
			type    : 'boolean',
			alias   : [ 'h' ],
		},
		choices : {
			desc    : 'Choice option',
			default : 'test',
			type    : 'choices',
			choices : [ 'test', 'test2' ],
		},
		string : {
			desc    : 'A string option',
			default : 'holahola',
			type    : 'string',
			alias   : [ 's' ],
		},
		number : {
			desc  : 'A number option',
			type  : 'number',
			alias : [ 'n' ],
		},
		object : {
			desc    : 'An object option',
			default : { hola: 'mundo' },
			type    : 'object',
			alias   : [ 'o' ],
		},
	},
}, { Finder } )

const data = parser.run( process.argv.slice( 2 ) )

const {
	commands, flags,
} = data.value

if ( commands.test2 )
	console.log( 'test2' )
if ( flags.help )
	console.log( 'help' )
console.log( )
console.log( data )
