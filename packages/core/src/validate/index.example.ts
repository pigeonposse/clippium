
import {
	getHelp,
	hideBin,
} from '..'
import {
	Validate,
	withValidation,
} from './index'
import { data as _data } from '../../examples/data'
import { Finder }        from '../_shared/finder'
import { Parser }        from '../parser'

const data = withValidation( {
	..._data,
	commands : {
		..._data.commands,
		ANOTHER_COMMAND : {
			desc        : 'Another command',
			positionals : { ticket : {
				desc      : 'ticket number',
				type      : 'number',
				required  : true,
				transform : v => ( Number( v ) + 10 ),
			} },
			flags : { kien : {
				type : 'number',
				desc : 'Kien',
			} },
		},

	},
	flags : {
		..._data.flags,
		STRING_FLAG : {
			type : 'string',
			desc : 'String flag',
		},
		NUMBER_FLAG : {
			type : 'number',
			desc : 'Number flag',
		},
		BOOLEAN_FLAG : {
			type    : 'boolean',
			desc    : 'Boolean flag',
			default : true,
		},
		ARRAY_FLAG : {
			type : 'array',
			desc : 'Array flag',
		},
		OBJECT_FLAG : {
			type : 'object',
			desc : 'Object flag',
		},
		CHOICES_FLAG : {
			type    : 'choices',
			desc    : 'Choices flag',
			default : 1, // must be in choices
			choices : [
				1,
				2,
				3,
				4,
			],
		},
	},
} as const )

const argv = hideBin( process.argv )

const parser = new Parser( {
	data,
	Finder,
} )
const parsed = parser.run( argv )

const validate = new Validate( {
	parsedData : parsed,
	Finder,
	data,
} )
try {

	const validated = validate.run( )

	const help = getHelp( {
		argv,
		data,
	} )

	if ( validated.flags.help ) {

		console.log( help )
		process.exit( 0 )

	}

	console.log( validated )

}
catch ( error ) {

	console.error( error instanceof Error ? '\n' + error.message : error )

}
