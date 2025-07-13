import {
	Clippium,
	ClippiumData,
} from 'clippium'
import {
	CreatiumCore,
	prompt,
	style,
	INSTALLER,
	TEXT_EDITOR,
} from 'creatium'

import {
	name,
	version,
	coreName,
} from '../_shared/const'
import { getProcess } from '../_shared/file'

type Commands = NonNullable<ClippiumData['commands']>

const { color } = style

export const createCommandOptions = {
	desc  : `Create a new ${coreName} project`,
	flags : {
		name : {
			type  : 'string',
			desc  : 'Project name',
			alias : [ 'n' ],
		},
		input : {
			type  : 'string',
			desc  : 'Input directory',
			alias : [ 'i' ],
		},
		output : {
			type  : 'string',
			desc  : 'Output directory',
			alias : [ 'o' ],
		},
		installer : {
			type    : 'choices',
			desc    : 'Manager for installing dependencies',
			choices : Object.values( INSTALLER ),
		},
		openEditor : {
			type    : 'choices',
			desc    : 'Open editor',
			choices : Object.values( TEXT_EDITOR ),
		},
		onlyFile : {
			type : 'boolean',
			desc : 'create only the clippium file',
		},
	},
} satisfies Commands[number]

export class Create {

	#fnData

	constructor( data: Parameters<Clippium<ClippiumData>['fn']>[0] ) {

		this.#fnData = data

	}

	async generate() {

		console.log( '⚠️ Coming soon command!' )

	}

	async _generate() {

		const { flags } = this.#fnData
		const TEMP      = {
			js : 'js',
			ts : 'ts',
		} as const
		const creatium  = new CreatiumCore( {
			name    : name,
			version,
			updater : false,
			cache   : true,
			prompt  : {
				welcome : {
					type : 'void',
					desc : 'Welcome message',
					fn   : () => prompt.box( {
						value : `${createCommandOptions.desc} ✨\n`,
						opts  : {
							borderStyle : 'none',
							textColor   : v => color.dim( v ),
						},
					} ),
				},
				name     : { type: 'name' },
				template : {
					type    : 'template',
					desc    : 'Which language do you want to use?',
					options : {
						[TEMP.js] : {
							input : '',
							name  : 'JavaScript',
						},
						[TEMP.ts] : {
							input : '',
							name  : 'TypeScript',
						},
					},
				},
				output     : { type: 'output' },
				install    : { type: 'install' },
				openEditor : { type: 'openEditor' },
			},
		} )

		const process = await getProcess( )

		creatium.cancel = async ( ) => {

			prompt.cancel( color.red( 'Creation canceled 💔' ) )
			process.exit( 0 )

		}

		const res = await creatium.build( {
			output     : flags.output,
			name       : flags.name,
			install    : flags.installer,
			openEditor : flags.openEditor,
			...flags,
		} )

		if ( res.template == TEMP.js ) {
			// do something
		}
		else if ( res.template == TEMP.ts ) {
			// do something
		}
		else throw new Error( `Selected template "${res.template}" not found` )

	}

}
