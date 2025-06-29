
import { ClippiumData } from './_shared/data'
import { Finder }       from './_shared/finder'
import {
	Help,
	HelpConfig,
} from './help'
import { ParserData } from './parser'

import type { PartialDeep } from './_shared/types'
import type { ParserRes }   from './parser'

type ClippiumConfig = { help?: PartialDeep<HelpConfig> }
type Argv = string[]

export type {
	ClippiumData,
	ClippiumConfig,
}

export const defineData = <C extends ClippiumData>( data: C ) => data

export class Clippium<C extends ClippiumData> {

	data   : C
	config : ClippiumConfig
	parser

	constructor( data: C, config: ClippiumConfig = {} ) {

		this.data   = data
		this.config = config

		this.parser = new ParserData( this.data, { Finder } )

	}

	fn: ( data: ParserRes<C>['value'] & { utils : {
		getHelp    : () => string
		getVersion : () => string | undefined
		argv       : Argv
		parsedArgv : ParserRes<C>['raw']
	} } ) => Promise<void> | void = _args => {

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
				getHelp,
				getVersion,
				argv,
				parsedArgv : parsed.raw,
			},
		} )

	}

}
