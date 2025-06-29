import { Parser }    from './core'
import {
	ClippiumData,
	InferCommands,
	InferFlags,
	InferPosicionals,
} from '../_shared/data'
import { Finder } from '../_shared/finder'
import {
	Any,
	Prettify,
} from '../_shared/types'

import type { ParsedArgv } from './core'

export type ParsedDataArgv<T extends ClippiumData> = {
	commands    : InferCommands<T>
	flags       : Prettify<InferFlags<T> & { [k: string]: Any }>
	positionals : Prettify<InferPosicionals<T> & { [k: string]: Any }>
}
export { ParsedArgv }
export type ParserRes<D extends ClippiumData> = {
	value : Prettify<ParsedDataArgv<D>>
	raw   : ParsedArgv
}
export class ParserData<D extends ClippiumData> {

	#find
	data : D

	constructor( data: D, opts: { Finder: typeof Finder } ) {

		this.data  = data
		this.#find = new opts.Finder( this.data )

	}

	#setPosicionalsAndCommands( cmds: string[] ): Omit<ParsedDataArgv<D>, 'flags'> {

		const commands: Record<string, boolean>   = {}
		const positionals: Record<string, string> = {}

		for ( let i = 0; i < cmds.length; i++ ) {

			const key = cmds[i]

			const cmd = this.#find.command( { key } )
			// if ( cmd ) commands[key] = true // strict
			commands[key] = true // flexible
			const posts   = cmd?.value.positionals
			if ( !posts ) continue

			const posKeys = Object.keys( posts )

			for ( let p = 0; p < posKeys.length; p++ ) {

				const postKey = posKeys[p]
				const exists  = cmds[i + p + 1]
				if ( exists ) positionals[postKey] = exists

			}

		}

		return {
			commands,
			positionals,
		} as Omit<ParsedDataArgv<D>, 'flags'>

	}

	#setFlags( input: ParsedDataArgv<D>['flags'] ): ParsedDataArgv<D>['flags'] {

		const passed = input ?? {}

		for ( const [ key, value ] of Object.entries( passed ) ) {

			const found = this.#find.flag( {
				key,
				alias : [ key ],
			} )
			if ( found ) {

				passed[key as keyof typeof passed]      = value
				input[found.key as keyof typeof passed] = value
				if ( found.value.alias )
					found.value.alias.forEach( alias => passed[alias as keyof typeof passed] = value )

				// // default value
				// if ( found.value.default !== undefined ) passed[key as keyof typeof passed] = found.value.default

			}

		}

		return passed

	}

	run( argv: string[] | string ): ParserRes<D> {

		const parsed = ( new Parser( argv ) ).run()
		const {
			_, ...rest
		} = parsed

		return {
			value : {
				...this.#setPosicionalsAndCommands( _ ),
				flags : this.#setFlags( rest as Any ),
			},
			raw : parsed,
		}

	}

}
