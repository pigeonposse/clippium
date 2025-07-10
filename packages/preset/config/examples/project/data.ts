import { ClippiumData } from 'clippium'

import { InferConfigFileData } from '../../src'

export const data = {
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
} satisfies ClippiumData

export default data
export type ConfigFileData = InferConfigFileData<typeof data>
