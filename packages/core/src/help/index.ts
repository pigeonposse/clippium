
import {
	HelpFormatter,
	HelpFormatterConfig,
} from './formatter'
import { ClippiumData } from '../_shared/data'
import { Finder }       from '../_shared/finder'
import {
	Argv,
	ExtractInstanceType,
} from '../_shared/types'

export type HelpConfig = { formatter?: ( d: {
	data  : ClippiumData
	utils : ExtractInstanceType<typeof HelpFormatter>
} ) => string } & HelpFormatterConfig

export class Help {

	#config
	settings
	#find

	constructor( data: ClippiumData, opts: { Finder: typeof Finder }, settings: HelpConfig = {} ) {

		this.#config  = data
		this.#find    = new opts.Finder( data )
		this.settings = settings

	}

	#getFrom( config: ClippiumData ) {

		const {
			formatter: _formatter, ...settings
		} = this.settings
		const formatter = new HelpFormatter( settings )
		if ( _formatter ) return _formatter( {
			data  : config,
			utils : formatter,
		} )
		return formatter.setAll( config )

	}

	run( argv: Argv ) {

		const cmd = this.#find.nearCommand( { keys: argv } )
		if ( cmd && !cmd.value.hidden ) return this.#getFrom( {
			name : [
				this.#config.name,
				...( cmd.parents ?? [] ),
				cmd.key,
			].filter( Boolean ).join( ' ' ),
			version : this.#config.version,
			...cmd.value,
			flags   : {
				...( this.#config.flags ?? {} ),
				...( cmd.value.flags ?? {} ),
			},
		} )

		return this.#getFrom( this.#config )

	}

}
