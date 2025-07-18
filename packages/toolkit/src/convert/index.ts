import {
	Clippium,
	ClippiumData,
} from 'clippium'

import { name }      from '../_shared/const'
import { AnyPlugin } from '../plugin'
import {
	file2object,
	object2String,
} from './_super'
import {
	data2schema,
	schemaType,
} from './data'
import { writeFile } from '../_shared/file'

export class Converter<Plugins extends { [k: string]: AnyPlugin }> {

	#plugins
	#fnData
	constructor( plugins: Plugins, fnData: Parameters<Clippium<ClippiumData>['fn']>[0] ) {

		this.#plugins = plugins
		this.#fnData  = fnData

	}

	#getInput() {

		if ( this.#fnData.flags.input ) return this.#fnData.flags.input
		if ( this.#fnData.flags.i ) return this.#fnData.flags.i

		throw new Error( 'Input not found. Use the -i,--input flag' )

	}

	async #getToData( key: string ) {

		const plugin = this.#plugins[key]
		if ( !plugin ) throw new Error( `Plugin "${key}" not found` )
		if ( !plugin.convert?.toData ) throw new Error( `Plugin "${key}" not found` )

		const res = await plugin.convert.toData.fn( {
			input : this.#getInput(),
			...this.#fnData,
		} )
		return res

	}

	#getOuput( ) {

		return this.#fnData.flags.output || this.#fnData.flags.o

	}

	async toData( key: string ) {

		const data   = await this.#getToData( key )
		const output = this.#getOuput()
		if ( !output ) return console.log( JSON.stringify( data ) )

		const text = 'Clippium data automatically generated by ' + name
		const res  = await object2String( output, data, {
			jsComment   : `/** ${text} */`,
			tsComment   : `/** ${text} */`,
			tomlComment : `# ${text}`,
			yamlComment : `# ${text}`,
		} )

		await writeFile( output, res )

	}

	async toDataSchema( key: string ) {

		const data   = await this.#getToData( key )
		const schema = await data2schema( data, this.#fnData.flags.res || schemaType.json )
		const output = this.#getOuput()
		if ( !output ) return console.log( JSON.stringify( schema ) )
		const text = 'Clippium data schema automatically generated by ' + name
		const res  = await object2String( output, schema, {
			jsComment   : `/** ${text} */`,
			tsComment   : `/** ${text} */`,
			tomlComment : `# ${text}`,
			yamlComment : `# ${text}`,
		} )

		await writeFile( output, res )

	}

	async #getInputData( i: string ) {

		try {

			return await file2object<ClippiumData>( i )

		}
		catch ( e ) {

			throw new Error( `Error reading input file: ${e instanceof Error ? e.message : 'Unknown error'}` )

		}

	}

	async fromData( key: string ) {

		const plugin = this.#plugins[key]
		if ( !plugin ) throw new Error( `Plugin "${key}" not found` )
		if ( !plugin.convert?.fromData ) throw new Error( `Plugin "${key}" not found` )
		const input = this.#getInput()
		const res   = await plugin.convert.fromData.fn( {
			input : await this.#getInputData( input ),
			...this.#fnData,
		} )

		const output = this.#getOuput()
		if ( !output ) return console.log( res )
		await writeFile( output, res )

	}

}

