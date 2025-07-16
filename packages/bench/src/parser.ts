import minimist from 'minimist'
import mri      from 'mri'
import nopt     from 'nopt'
import yargs    from 'yargs-parser'

import { getBench }   from './_super'
import { ParserArgv } from '../../core/src/parser/core'

const args = [
	'-b',
	'--bool',
	'--meep',
	'--multi=baz',
]

export const get = async () => getBench( {
	name : 'PARSER(s)',
	add  : {
		'mri'          : () => mri( args ),
		'yargs-parser' : () => yargs( args ),
		'minimist'     : () => minimist( args ),
		'nopt'         : () => nopt( {
			bool  : Boolean,
			meep  : Boolean,
			multi : String,
		},
		{ b: 'bool' }, args ),
		'clippium-parser' : () => ( new ParserArgv( args ) ).run(),
	},
} )

