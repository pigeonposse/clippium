
import { HelpFormatter } from './formatter'
import { ClippiumData }  from '../_shared/data'
import { Finder }        from '../_shared/finder'
import { Argv }          from '../_shared/types'

export type HelpConfig = { formatter?: ( d: {
	data  : ClippiumData
	utils : HelpFormatter
} ) => string }

export class Help {

	#config
	settings
	#find
	constructor( data: ClippiumData, opts: { Finder: typeof Finder }, settings: HelpConfig = {} ) {

		this.#config  = data
		this.#find    = new opts.Finder( data )
		this.settings = { formatter: settings.formatter }

	}

	#getFrom( config: ClippiumData ) {

		const formatter = new HelpFormatter( )
		if ( this.settings.formatter )
			return this.settings.formatter( {
				data  : config,
				utils : formatter,
			} )
		return formatter.setAll( config )

	}

	run( argv: Argv ) {

		for ( const key of argv.reverse() ) {

			const cmd = this.#find.command( { key } )
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

		}

		return this.#getFrom( this.#config )

	}

}
