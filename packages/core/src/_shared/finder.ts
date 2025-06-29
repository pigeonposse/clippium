import { ClippiumData } from '../_shared/data'

type Flags = NonNullable<ClippiumData['flags']>
type Positionals = NonNullable<ClippiumData['positionals']>
type Commands = NonNullable<ClippiumData['commands']>

export class Finder<D extends ClippiumData> {

	constructor( public data: D ) {}

	#flag( data: ClippiumData, filter: {
		key?   : string
		alias? : string[]
	} ): {
		key   : keyof Flags
		value : Flags[number]
	} | undefined {

		if ( !filter.key ) return undefined

		const flags = data.flags ?? {}

		// KEY
		if ( filter.key in flags ) return {
			key   : filter.key,
			value : flags[filter.key],
		}

		// ALIAS
		for ( const [ flagKey, flag ] of Object.entries( flags ) )
			if ( flag.alias?.includes( filter.key ) ) return {
				key   : flagKey,
				value : flag,
			}

		if ( !data.commands ) return undefined

		for ( const subCommand of Object.values( data.commands ) ) {

			const found = this.#flag( subCommand as ClippiumData, filter )
			if ( found ) return found

		}

		return undefined

	}

	flag( filter: {
		key?   : string
		alias? : string[]
	} ): {
		key   : keyof Flags
		value : Flags[number]
	} | undefined {

		return this.#flag( this.data, filter )

	}

	#command(
		data: ClippiumData,
		filter: { key?: string },
		parentKeys?: ( keyof Commands )[],
	): {
		key      : keyof Commands
		value    : Commands[number]
		parents? : ( keyof Commands )[]
	} | undefined {

		if ( !filter.key ) return undefined

		const values  = data.commands ?? {}
		const parents = parentKeys ?? []
		// KEY
		if ( filter.key in values ) return {
			key     : filter.key,
			value   : values[filter.key],
			parents : parentKeys,
		}

		if ( !data.commands ) return undefined

		for ( const [ cmdKey, cmdValue ] of Object.entries( data.commands ) ) {

			const found = this.#command( cmdValue as ClippiumData, filter, [ ...parents, cmdKey ] )
			if ( found ) return found

		}

		return undefined

	}

	command( filter: { key?: string } ): {
		key      : keyof Commands
		value    : Commands[number]
		parents? : ( keyof Commands )[]
	} | undefined {

		return this.#command( this.data, filter )

	}

	#positional(
		data: ClippiumData,
		filter: { key?: string },
		parentKeys?: ( keyof Commands )[],
	): {
		key      : keyof Positionals
		value    : Positionals[number]
		parents? : ( keyof Commands )[]
	} | undefined {

		if ( !filter.key ) return undefined

		const positionals = data.positionals ?? {}
		const parents     = parentKeys ?? []
		// KEY
		if ( filter.key in positionals ) return {
			key     : filter.key,
			value   : positionals[filter.key],
			parents : parentKeys,
		}

		if ( !data.commands ) return undefined

		for ( const [ k, subCommand ] of Object.entries( data.commands ) ) {

			const found = this.#positional( subCommand as ClippiumData, filter, [ ...parents, k ] )
			if ( found ) return found

		}

		return undefined

	}

	positional( filter: { key?: string } ): {
		key      : keyof Positionals
		value    : Positionals[number]
		parents? : ( keyof Commands )[]
	} | undefined {

		return this.#positional( this.data, filter )

	}

}
