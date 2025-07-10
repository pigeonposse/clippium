import $RefParser       from '@apidevtools/json-schema-ref-parser'
import { ClippiumData } from 'clippium'

import {
	file2object,
	object2String,
	type CreateInterface,
} from './_super'
import { createPlugin } from '../plugin'
import {
	data2schema,
	schemaType,
	SchemaType,
} from './data'
import { JSONSchema } from '../_shared/_super'
import { Input }      from '../_shared/file'

type Flags = NonNullable<ClippiumData['flags']>
type Cmds = NonNullable<ClippiumData['commands']>

export class JSONSchemaGneneric implements CreateInterface {

	#getData( schema: JSONSchema ): Partial<Cmds[number]> {

		const groupFlags: Flags = {}
		const commands: Cmds    = {}
		const required          = Array.isArray( schema.required ) ? schema.required : []

		for ( const propertyKey in schema.properties ) {

			const property = schema.properties[propertyKey]
			if ( typeof property !== 'object' ) continue
			if ( propertyKey === '$schema' ) continue

			let type: Flags[number]['type'] | undefined,
				choices: ( string | number )[] | undefined

			if ( property.type === 'object' && property.properties ) {

				commands[propertyKey] = {
					desc : property.description || `${propertyKey} command`,
					...this.#getData( property ),
				}
				continue

			}
			if ( property.type === 'object' ) type = 'object'
			else if ( property.type === 'array' ) type = 'array'
			else if ( typeof property.type === 'boolean' ) type = 'boolean'
			else if ( typeof property.type === 'number' ) type = 'number'
			else type = 'string'

			if ( Array.isArray( property.enum ) ) {

				type    = 'choices'
				choices = property.enum as ( string | number )[]

			}

			groupFlags[propertyKey] = {
				desc     : property.description || `${propertyKey} flag`,
				required : required.includes( propertyKey ),
				// @ts-ignore
				choices  : choices,
				type     : type,
				default  : property.default?.toString(),
			}

		}

		return {
			flags    : groupFlags,
			commands : commands,
		}

	}

	async convertToData( i: Input ): Promise<ClippiumData> {

		try {

			const rawSchema = await file2object<JSONSchema>( i )
			const schema    = await $RefParser.dereference( rawSchema ) as JSONSchema

			return {
				desc : schema.description,
				name : schema.title?.replaceAll( ' ', '-' ),
				...this.#getData( schema ),
			}

		}
		catch ( e ) {

			throw new Error( `Error parsing JSON Schema: ${e instanceof Error ? e.message : 'Unknown error'}\n\nNote: This feature is designed for use with JSON schema files, and the conversion is very generic and experimental.\nPlease reconsider creating a plugin for your specific use case.` )

		}

	}

	async convertFromData( input: ClippiumData, opts?:{
		output? : string
		type?   : SchemaType
	} ) {

		const schema = data2schema( input, opts?.type || schemaType.json )

		return object2String( opts?.output || 'schema.json', schema )

	}

}

const schema = new JSONSchemaGneneric()

export const schemaPlugin = createPlugin( { convert : {
	toData   : { fn: async ( { input } ) => schema.convertToData( input ) },
	fromData : {
		flags : { type : {
			type    : 'choices',
			desc    : 'Type of schema',
			choices : Object.values( schemaType ),
			default : schemaType.json,
		} },
		fn : async ( {
			input, flags,
		} ) => schema.convertFromData( input, flags ),
	},
} } )
