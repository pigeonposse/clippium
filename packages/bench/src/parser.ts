import minimist from 'minimist'
import mri      from 'mri'
import nopt     from 'nopt'
import yargs    from 'yargs-parser'

import { runBench } from './_super'
import { Parser }   from '../../core/src/parser/core'

const args = [
	'-b',
	'--bool',
	'--meep',
	'--multi=baz',
]

export const run = async () => runBench( {
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
		'clippium-parser' : () => ( new Parser( args ) ).run(),
	},
} )

