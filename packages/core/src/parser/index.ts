import { ParserArgv } from './core'

import type { ParsedArgv } from './core'
import type {
	ClippiumData,
	InferCommands,
	InferFlags,
	InferPositionals,
} from '../_shared/data'
import type { Finder } from '../_shared/finder'
import type {
	Any,
	Prettify,
} from '../_shared/types'

type ParsedData<T extends ClippiumData> = {
	commands    : InferCommands<T>
	flags       : Prettify<InferFlags<T> & { [k: string]: Any }>
	positionals : Prettify<InferPositionals<T> & { [k: string]: Any }>
}
export { ParsedArgv }

export type Parsed<D extends ClippiumData> = Prettify<ParsedData<D>> & { raw: ParsedArgv }

export class Parser<D extends ClippiumData> {

	#find
	data : D

	constructor( opts: {
		data   : D
		Finder : typeof Finder
	} ) {

		this.data  = opts.data
		this.#find = new opts.Finder( this.data )

	}

	#setPosicionalsAndCommands( cmds: string[] ): Omit<ParsedData<D>, 'flags'> {

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
		} as Omit<ParsedData<D>, 'flags'>

	}

	#setFlags( input: ParsedData<D>['flags'] ): ParsedData<D>['flags'] {

		const passed = input ?? {}

		for ( const [ key, value ] of Object.entries( passed ) ) {

			const found = this.#find.flag( {
				key,
				alias : [ key ],
			} )

			if ( !found ) continue
			const transValue = value // this.#transformStringValue( value, found.value.type || DEFAULT_TYPE )

			passed[key as keyof typeof passed]      = transValue
			input[found.key as keyof typeof passed] = transValue
			if ( found.value.alias )
				found.value.alias.forEach( alias => passed[alias as keyof typeof passed] = transValue )

			// // default value
			// if ( found.value.default !== undefined ) passed[key as keyof typeof passed] = found.value.default

		}

		return passed

	}

	run( argv: string[] | string ): Parsed<D> {

		const parsed = ( new ParserArgv( argv ) ).run()
		const {
			_, ...rest
		} = parsed

		return {
			...this.#setPosicionalsAndCommands( _ ),
			flags : this.#setFlags( rest as Any ),
			raw   : parsed,
		}

	}

}

