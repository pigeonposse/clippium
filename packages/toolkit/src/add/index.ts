import color     from '@clippium/color'
import {
	Clippium,
	ClippiumData,
} from 'clippium'
import { CreatiumCore } from 'creatium'
import {
	prompt,
	writeFile,
} from 'creatium/utils'

import {
	name,
	version,
	coreName,
} from '../_shared/const'
import { getProcess } from '../_shared/file'

type Commands = NonNullable<ClippiumData['commands']>

export const commandOptions = {
	desc  : `Add a ${coreName} CLI instance`,
	flags : {
		'name' : {
			type  : 'string',
			desc  : 'Set CLI name',
			alias : [ 'n' ],
		},
		'desc' : {
			type : 'string',
			desc : 'Set CLI description',
		},
		'project-version' : {
			type : 'string',
			desc : 'Set CLI version',
		},
		'output' : {
			type  : 'string',
			desc  : 'Set CLI output file',
			alias : [ 'o' ],
		},
	},
	examples : [
		{
			value : '$0 -n my-cli -o ./my-cli.js',
			desc  : 'Add a CLI to "./my-cli.js"',
		},
	],
} satisfies Commands[number]

type FnData<T extends ClippiumData> = Parameters<Clippium<T>['fn']>[0]

export class Add {

	#fnData

	constructor( data: FnData<ClippiumData> ) {

		this.#fnData = data as FnData<ClippiumData & typeof commandOptions>

	}

	async generate() {

		const { flags } = this.#fnData

		const creatium = new CreatiumCore( {
			name     : name + '-add',
			version,
			updater  : false,
			cache    : true,
			onCancel : async () => {

				prompt.cancel( color.red( 'Canceled 💔' ) )
				process.exit( 0 )

			},
			prompt : {
				welcome : {
					type : 'void',
					desc : 'Welcome message',
					fn   : () => prompt.box( {
						value : `${commandOptions.desc} ✨\n`,
						opts  : {
							borderStyle : 'none',
							textColor   : v => color.dim( v ),
						},
					} ),
				},
				name : {
					type             : 'name',
					promptMsg        : commandOptions.flags.name.desc,
					placeholderValue : 'my-cli',
					desc             : commandOptions.flags.name.desc,
				},
				desc : {
					type             : 'text',
					placeholderValue : 'My CLI description',
					promptMsg        : commandOptions.flags.desc.desc,
					desc             : commandOptions.flags.desc.desc,
				},
				projectVersion : {
					type             : 'text',
					placeholderValue : '0.0.1',
					promptMsg        : commandOptions.flags['project-version'].desc,
					desc             : commandOptions.flags['project-version'].desc,
				},
				output : {
					type      : 'path',
					pathType  : 'file',
					exists    : false,
					promptMsg : commandOptions.flags.output.desc,
					desc      : commandOptions.flags.output.desc,
				},
			},
		} )

		const process = await getProcess( )

		const res = await creatium.build( {
			output : flags.output,
			name   : flags.name,
		} )

		const sourceIndex = `import { Clippium } from '${coreName}'

const cli = new Clippium( {
	name  : '${res.name}',
	version : '${res.projectVersion || '0.0.1'}',
	desc  : '${res.desc || ''}',
	flags : {
		help : {
			type  : 'boolean',
			desc  : 'Show help',
			alias : [ 'h' ],
		},
		version : {
			type  : 'boolean',
			desc  : 'Show version',
			alias : [ 'v' ],
		}
	},
})

cli.fn = async ({flags, utils}) => {

	if ( flags.help ) return console.log( utils.getHelp() )
	if ( flags.version ) return console.log( utils.getVersion() )

	// Do something
}

export default cli
`

		if ( !res.output ) throw new Error( 'Output directory not found' )

		await writeFile( res.output, sourceIndex )

		creatium.outro()

	}

}
