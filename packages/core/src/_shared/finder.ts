import { ClippiumData } from '../_shared/data'

type Flags = NonNullable<ClippiumData['flags']>
type Positionals = NonNullable<ClippiumData['positionals']>
type Commands = NonNullable<ClippiumData['commands']>
type CommandRes = {
	key      : keyof Commands
	value    : Commands[number]
	parents? : ( keyof Commands )[]
}
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
		parentKeys?: string[],
	): CommandRes | undefined {

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

	#findCommandByArgv(
		data: ClippiumData,
		argv: string[],
		near?: boolean,
	): CommandRes | undefined {

		let current = data,
			finalKey: keyof Commands = argv[0],
			lastValid: CommandRes | undefined

		const parents: CommandRes['parents'] = []

		for ( let i = 0; i < argv.length; i++ ) {

			const key = argv[i]

			if ( !current.commands || !current.commands[key] ) {

				return near ? lastValid : undefined

			}

			current  = current.commands[key]
			finalKey = key

			lastValid = {
				key     : finalKey,
				value   : current as Commands[number],
				parents : [ ...parents ], // copy
			}

			if ( i < argv.length - 1 ) parents.push( key )

		}

		return {
			key     : finalKey,
			value   : current as Commands[number],
			parents : parents,
		}

	}

	/**
	 * Similar to `command()`, but allows to find a command by its near
	 * key.
	 *
	 * For example, if you have a command named `existent-command`, and you
	 * call `nearCommand({ key: ['command', 'non-existent-command'] })`, it will return the
	 * `existent-command` command.
	 *
	 * @param   {{ key: string[] }}      filter      - An object with a `key` property, which is an array of
	 *                                               strings to search for.
	 * @param   {string[]}               filter.keys - An array of strings to search for.
	 * @returns {CommandRes | undefined}             The command that matches the nearest key, or `undefined` if
	 *                                               no command is found.
	 */
	nearCommand( filter: { keys: string[] } ): CommandRes | undefined {

		return this.#findCommandByArgv( this.data, filter.keys, true )

	}

	command( filter: { key?: string | string[] } ): CommandRes | undefined {

		const key = filter.key
		if ( key && Array.isArray( key ) )
			return this.#findCommandByArgv( this.data, key )

		return this.#command( this.data, { key } )

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
