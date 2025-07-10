import {
	parse,
	ParserOptions,
	validate,
	compileErrors,
} from '@readme/openapi-parser'
import { ClippiumData } from 'clippium'

import {
	file2object,
	type CreateInterface,
} from './_super'
import {
	Any,
	JSONSchema,
} from '../_shared/_super'
import { Input }        from '../_shared/file'
import { createPlugin } from '../plugin'

export class OpenAPI implements CreateInterface {

	async validate( i: Any ): Promise<JSONSchema> {

		const result = await validate( i )

		if ( !result.valid ) throw new Error( compileErrors( result ) )

		if ( result.warnings.length ) {

			console.warn( '🚸 The API is valid but has some warnings.' )
			console.warn( result.warnings )

		}

		return i

	}

	async convertToData( i: Input, opts?: ParserOptions ): Promise<ClippiumData> {

		const data = await this.validate( await file2object<JSONSchema>( i ) )
		// @ts-ignore
		const api = await parse( data, opts )

		if ( !api.paths ) throw new Error( 'No paths found in the API' )
		const res: ClippiumData = {
			desc    : api.info.description,
			version : api.info.version,
		}
		for ( const key in api.paths ) {

			const value = api.paths[key]
			if ( !value ) continue

			const commandName = key
				.replaceAll( '/', '-' )
				.replaceAll( '{', '' )
				.replaceAll( '}', '' )
				.replaceAll( ':', '-' )
				.replaceAll( ' ', '-' )
				.replaceAll( '?', '' )
				.replace( /^[-]+/, '' )

			if ( !res.commands ) res.commands = {}

			const cmd: NonNullable<ClippiumData['commands']>[number] = { desc: `Path: ${key}` }

			for ( const method of Object.keys( value ) ) {

				const childCmd: NonNullable<ClippiumData['commands']>[number] =  { desc: `Method: ${method}` }
				const op                                                      = value[method as keyof typeof value]

				if ( !op || typeof op !== 'object' ) continue

				if ( 'parameters' in op && Array.isArray( op.parameters ) ) {

					for ( const param of op.parameters ) {

						if ( typeof param === 'object' && 'name' in param ) {

							const p = param
							if ( !childCmd.flags ) childCmd.flags = {}
							childCmd.flags[p.name as string] = {
								desc     : p.description ?? '',
								required : p.required ?? false,
								type     : p.schema?.type ?? 'string',
							}

						}

					}

				}

				if ( !cmd.commands ) cmd.commands = {}
				cmd.commands[method] = childCmd

			}

			res.commands![commandName] = cmd

		}

		return res

	}

	convertFromData( _input: ClippiumData ): Promise<string> {

		throw new Error( 'Method not implemented.' )

	}

}

export const openapi = new OpenAPI()

export const openapiPlugin = createPlugin( { convert : {
	toData : { fn : async data => {

		return await openapi.convertToData( data.input )

	} },
	fromData : { fn : ( { input } ) =>
		openapi.convertFromData( input ) },
} } )
