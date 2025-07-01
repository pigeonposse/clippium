
import {
	ClippiumData,
	InferFlag,
	InferPosicional,
} from './_shared/data'
import { Finder } from './_shared/finder'
import {
	Help,
	HelpConfig,
} from './help'
import { ParserData } from './parser'

import type {
	Argv,
	PartialDeep,
} from './_shared/types'
import type { ParserRes } from './parser'

type ClippiumConfig = { help?: PartialDeep<HelpConfig> }

type FnData<C extends ClippiumData> = ParserRes<C>['value'] & { utils : {
	data       : C
	config     : ClippiumConfig
	getHelp    : () => string
	getVersion : () => string | undefined
	argv       : Argv
	parsedArgv : ParserRes<C>['raw']
} }

export type {
	ClippiumData,
	ClippiumConfig,
	InferFlag,
	InferPosicional,
}

export const defineData = <C extends ClippiumData>( data: C ) => data
export const hiddenBin = ( args: Argv ) => args.slice( 2 )

export class Clippium<C extends ClippiumData> {

	data   : C
	config : ClippiumConfig
	parser

	constructor( data: C, config: ClippiumConfig = {} ) {

		this.data   = data
		this.config = config

		this.parser = new ParserData( this.data, { Finder } )

	}

	fn: ( data: FnData<C> ) => Promise<void> | void = _args => {

		// nothing by default

	}

	help( argv: Argv ) {

		return new Help(
			this.data,
			{ Finder },
			this.config?.help,
		).run( argv )

	}

	version( ) {

		return this.data.version

	}

	async run( argv: Argv ) {

		const parsed = this.parser.run( argv )

		const getHelp    = () => this.help( parsed.raw._ )
		const getVersion = () => this.version()
		return await this.fn( {
			...parsed.value,
			utils : {
				data       : this.data,
				config     : this.config,
				getHelp,
				getVersion,
				argv,
				parsedArgv : parsed.raw,
			},
		} )

	}

}
