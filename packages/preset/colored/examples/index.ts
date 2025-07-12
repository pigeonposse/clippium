import color                         from '@clippium/color'
import { formatter as setFormatter } from '@clippium/preset-colored'
import {
	Clippium,
	defineData,
} from 'clippium'

const data = defineData( {
	name        : 'My CLI',
	version     : '1.0.0',
	description : 'This is a description',
	flags       : {
		help : {
			alias : [ 'h' ],
			desc  : 'help mode',
			type  : 'boolean',
		},
		version : {
			alias : [ 'v' ],
			desc  : 'version mode',
			type  : 'boolean',
		},
	},
} )

const formatter = setFormatter( {
	title         : color.cyan.inverse.bold,
	bin           : color.cyan,
	version       : color.cyan.dim.italic,
	name          : color.bold,
	positionals   : color.green.dim,
	commands      : color.green,
	flags         : color.yellow,
	desc          : color.white.dim,
	examples      : color.cyan,
	sectionTitle  : color.white.bold.underline,
	sectionDesc   : color.white.dim,
	sectionsProps : color.white.dim.italic,
} )

export const cli = new Clippium(
	data,
	{ help: { formatter } },
)
