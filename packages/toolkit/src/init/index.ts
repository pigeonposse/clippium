import color     from '@clippium/color'
import {
	Clippium,
	ClippiumData,
} from 'clippium'
import {
	CreatiumCore,
	INSTALLER,
	TEXT_EDITOR,
} from 'creatium'
import { prompt } from 'creatium/utils'

import {
	name,
	version,
	coreName,
} from '../_shared/const'
import { getProcess } from '../_shared/file'

type Commands = NonNullable<ClippiumData['commands']>

const TEMP = {
	js : 'js',
	ts : 'ts',
} as const

export const initCommandOptions = {
	desc  : `Create a new ${coreName} project`,
	flags : {
		name : {
			type  : 'string',
			desc  : 'Project name',
			alias : [ 'n' ],
		},
		template : {
			type    : 'choices',
			desc    : 'Input directory',
			choices : Object.values( TEMP ),
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
	},
	examples : [
		{
			value : '$0 --name my-cli',
			desc  : 'Prompt to create a new clippium CLI project named "my-cli"',
		},
	],
} satisfies Commands[number]

type FnData<T extends ClippiumData> = Parameters<Clippium<T>['fn']>[0]

export class Init {

	#fnData

	constructor( data: FnData<ClippiumData> ) {

		this.#fnData = data as FnData<ClippiumData & typeof initCommandOptions>

	}

	async generate() {

		const { flags } = this.#fnData

		const creatium = new CreatiumCore( {
			name    : name + '-init',
			version,
			updater : false,
			cache   : true,
			prompt  : {
				welcome : {
					type : 'void',
					desc : 'Welcome message',
					fn   : () => prompt.box( {
						value : `${initCommandOptions.desc} ✨\n`,
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

		const res        = await creatium.build( {
			output     : flags.output,
			name       : flags.name,
			install    : flags.installer,
			openEditor : flags.openEditor,
			template   : flags.template,

		} )
		const pkgContent = {
			name         : res.name,
			description  : 'A CLI application built with Clippium',
			version      : '0.0.1',
			dependencies : { [coreName]: 'latest' },
			scripts      : {
				dev   : 'vite',
				build : 'vite build',
			},
			devDependencies : { vite: 'latest' },
			type            : 'module',
		}
		const sourceBin  = `#!/usr/bin/env node

import { hideBin } from '${coreName}'
import cli from './index'
import process from 'node:process'

cli.run( hideBin( process.argv ) ) 
`
		const sourceIndex = `import { Clippium } from '${coreName}'
import { name, version } from '../package.json'

const cli = new Clippium( {
	name,
	version,
	flags : {
		help : {
			type  : 'boolean',
			desc  : 'Show help',
			alias : [ 'h' ],
		},
	},
})
cli.fn    = async data => {
	if ( data.flags.help ) return console.log( data.utils.getHelp() )
}
export default cli

		`

		if ( !res.output ) throw new Error( 'Output directory not found' )

		await creatium.copyDir( {
			input : [
				{
					path    : 'package.json',
					content : JSON.stringify( pkgContent, null, 2 ),
				},
				{
					path    : res.template == TEMP.js ? 'src/index.js' : 'src/index.ts',
					content : sourceIndex,
				},
				{
					path    : res.template == TEMP.js ? 'src/bin.js' : 'src/bin.ts',
					content : sourceBin,
				},
			],
			output : res.output,
		} )

		if ( res.install ) await creatium.install( {
			installer : res.install,
			input     : res.output,
		} )

		if ( res.openEditor ) await creatium.openEditor( {
			editor : res.openEditor,
			input  : res.output,
		} )
		creatium.outro()

	}

}
