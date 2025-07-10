import { Validator }    from '@cfworker/json-schema'
import ClippiumSchema   from '@clippium/schema/dist/clippium-data.json'
import { ClippiumData } from 'clippium'
// @ts-ignore
import generate from 'generate-schema'

import { JSONSchema } from '../_shared/_super'

export type ClippiumDataSchema = typeof ClippiumSchema

export const validateData = <I extends ClippiumData>( input: I ): I => {

	const validator = new Validator( ClippiumSchema )
	const res       = validator.validate( input )

	if ( res.valid ) return input

	throw new Error( `Error validating clippiumData: ${JSON.stringify( res.errors )}` )

}

/**
 * @see https://www.npmjs.com/package/generate-schema
 */
export const schemaType = {
	generic    : 'generic',
	mysql      : 'mysql',
	json       : 'json',
	mongoose   : 'mongoose',
	bigquery   : 'bigquery',
	clickhouse : 'clickhouse',
} as const

export type SchemaType = typeof schemaType[keyof typeof schemaType]

export const data2schema = <I extends ClippiumData>( input: I, type?: SchemaType ): JSONSchema => {

	const content = validateData( input )
	type          = type || schemaType.generic
	return generate[type]( content )

}

