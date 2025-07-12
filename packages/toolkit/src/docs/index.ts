import {
	Clippium,
	ClippiumData,
} from 'clippium'

import { writeFile }   from '../_shared/file'
import { file2object } from '../convert/_super'
import { AnyPlugin }   from '../plugin'

export class Docs<Plugins extends { [k: string]: AnyPlugin }> {

	#plugins
	#fnData
	constructor( plugins: Plugins, fnData: Parameters<Clippium<ClippiumData>['fn']>[0] ) {

		this.#plugins = plugins
		this.#fnData  = fnData

	}

	async #getInputData( i: string ) {

		try {

			return await file2object<ClippiumData>( i )

		}
		catch ( e ) {

			throw new Error( `Error reading input file: ${e instanceof Error ? e.message : 'Unknown error'}` )

		}

	}

	#getInput(): string {

		if ( this.#fnData.flags.input ) return this.#fnData.flags.input
		if ( this.#fnData.flags.i ) return this.#fnData.flags.i

		throw new Error( 'Input not found. Use the -i,--input flag' )

	}

	#getOuput( ): string | undefined {

		return this.#fnData.flags.output || this.#fnData.flags.o

	}

	async #getPlugin( key: string ) {

		const plugin = this.#plugins[key]
		if ( !plugin ) throw new Error( `Plugin "${key}" not found` )
		if ( !plugin.docs || !plugin.docs.fn ) throw new Error( `Plugin "${key}" not found` )

		return plugin.docs

	}

	async run( key: string ) {

		const plugin = await this.#getPlugin( key )
		const input  = await this.#getInput()
		const output = this.#getOuput()

		const res = await plugin.fn( {
			input : await this.#getInputData( input ),
			...this.#fnData,
		} )

		if ( !output ) return console.log( res )
		else await writeFile( output, res )

	}

}
