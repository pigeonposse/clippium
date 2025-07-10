import { ClippiumData } from 'clippium'

import { Any } from './_shared/_super'
import {
	ensureDir,
	writeFile,
} from './_shared/file'

import type { JSONSchema7 } from 'json-schema'

/**
 * Get a JSON schema from a ClippiumData object.
 *
 * @param   {ClippiumData} data - The ClippiumData object to generate the schema for.
 * @returns {JSONSchema7}       The generated JSON schema.
 */
export const getJSONSchema = <C extends ClippiumData>( data: C ): JSONSchema7 => {

	const entryToSchema = ( entry: NonNullable<ClippiumData['flags']>[string] ): JSONSchema7 => {

		const schema: JSONSchema7 = { }
		if ( entry.type === 'choices' ) {

			schema.type = 'string'
			schema.enum = entry.choices

		}
		else schema.type = entry.type

		if ( entry.desc ) schema.description = entry.desc

		if ( entry.default ) {

			if (
				typeof entry.default === 'string'
				|| typeof entry.default === 'number'
				|| typeof entry.default === 'boolean'
				|| Array.isArray( entry.default )
				|| entry.default === null
			) schema.default = entry.default
			else schema.default = entry.default as Record<string, Any>

		}

		return schema

	}

	const processSection = ( section: NonNullable<ClippiumData['flags']> ): JSONSchema7 => {

		const properties: Record<string, JSONSchema7> = {}
		const required: string[]                      = []

		for ( const key in section ) {

			const entry     = section[key]
			properties[key] = entryToSchema( entry )

			if ( entry.required ) required.push( key )

		}

		const schema: JSONSchema7 = {
			type                 : 'object',
			properties,
			additionalProperties : false,
		}

		if ( required.length > 0 ) schema.required = required

		return schema

	}

	const recurse = ( obj: ClippiumData, customName?: string ): JSONSchema7 => {

		const schema: JSONSchema7 = {
			type                 : 'object',
			properties           : {},
			additionalProperties : false,
		}
		const name                = obj.name && customName ? `${obj.name} ${customName}` : obj.name || customName
		if ( name ) schema.title = name
		if ( obj.desc ) schema.description = obj.desc
		if ( obj.flags ) schema.properties!['flags'] = {
			...processSection( obj.flags ),
			title       : `${name ? `Flags for: ${name} ` : 'Flags'}`,
			description : 'Set flags for the command',
		}

		if ( obj.positionals ) schema.properties!['positionals'] = {
			...processSection( obj.positionals ),
			title       : `${name ? `Positionals for: ${name} ` : 'Positionals'}`,
			description : `Set positionals for the command`,
		}

		if ( obj.commands ) {

			const commandSchemas: Record<string, JSONSchema7> = {}

			for ( const commandName in obj.commands )
				commandSchemas[commandName] = recurse( obj.commands[commandName], name ? `${name} ${commandName}` : commandName )

			schema.properties!['commands'] = {
				type                 : 'object',
				properties           : commandSchemas,
				title                : `${name ? `Commands for: ${name} ` : 'Commands'}`,
				description          : 'Set child commands',
				additionalProperties : false,
			}

		}

		return schema

	}

	return recurse( data )

}

/**
 * Write a JSON schema to a file based on the given `ClippiumData`.
 *
 * @param {ClippiumData} data   - The `ClippiumData` to generate the schema for.
 * @param {output}       output - The path to write the schema to.
 */
export const createJSONSchema = async <C extends ClippiumData>( data: C, output: string ) => {

	await ensureDir( output )
	await writeFile( output, JSON.stringify( getJSONSchema( data ), null, 2 ) )

}
