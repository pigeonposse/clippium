import { getCurrentDir } from '@dovenv/core/utils'
import {
	Clippium,
	hiddenBin,
} from 'clippium'

import pluginConfig            from '../../src/index'
import { InferConfigFileData } from '../../src/types'

export type ConfigData = InferConfigFileData<typeof cli.data>

const cli = new Clippium( {
	name     : 'clippium-config-example',
	commands : {
		build : {
			desc        : 'Build something',
			positionals : {
				input : {
					type : 'string',
					desc : 'Input file',
				},
				output : {
					type    : 'string',
					desc    : 'Output directory',
					default : './build/',
				},
			},
			flags : {
				minify : {
					type : 'boolean',
					desc : 'Minify output',
				},
				bundle : {
					type : 'boolean',
					desc : 'Bundle output',
				},
			},
		},
		dev : {
			desc        : 'Start development server',
			positionals : { input : {
				type : 'string',
				desc : 'Input file',
			} },
			flags : {
				port : {
					type    : 'number',
					desc    : 'Port',
					default : 3000,
				},
				watch : {
					type : 'boolean',
					desc : 'Watch files',
				},
			},
		},
		nest : {
			desc     : 'Nest commands',
			commands : { nest2 : {
				desc     : 'Nest commands 2',
				commands : { nest3 : {
					desc  : 'Nest commands 3',
					flags : { nestflag : {
						desc : 'Nest flag',
						type : 'boolean',
					} },
				} },
			} },
		},
	},
	flags : {
		version : {
			desc  : 'Show version',
			type  : 'boolean',
			alias : [ 'v' ],
		},
		verbose : {
			desc    : 'Show verbose output',
			type    : 'boolean',
			alias   : [ 'V' ],
			default : false,
		},
	},
} )

const rootDir = getCurrentDir( import.meta.url )

const getConfig = pluginConfig( {
	rootDir,
	configNames : [ 'config' ],
	supported   : [
		'javascript',
		'json',
		'package',
	],
} )

cli.fn = async data => {

	const {
		utils, ...rest
	} = data

	const parsedData = await getConfig( data )

	if ( !parsedData.data ) console.log( `⚠️  No config found in: ${rootDir}` )
	else console.log( `✅ Config found: ${parsedData.data.path}` )
	console.log( '\n' )
	console.dir( {
		init : rest,
		parsedData,
	}, { depth: null } )

}

await cli.run( hiddenBin( process.argv ) )

