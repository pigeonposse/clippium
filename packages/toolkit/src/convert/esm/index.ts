import { ClippiumData } from 'clippium'

import {
	getContent,
	Input,
} from '../../_shared/file'
import { createPlugin }  from '../../plugin'
import {
	getExtension,
	type CreateInterface,
} from '../_super'
import { parseFunctionTypescript } from './parser/ts'
import { FunctionParam }           from './parser/types'

export class ESMFunctions implements CreateInterface {

	async convertToData( i: Input, opts?: { name?: string } ): Promise<ClippiumData> {

		const data = await getContent( i )
		const ext  = await getExtension( i, data.type )

		const fnData = ( ext === 'ts' )
			? await parseFunctionTypescript( data.content, opts?.name )
			: await parseFunctionTypescript( data.content, opts?.name )
		// console.dir( fnData, { depth: null } )
		let flags: ClippiumData['flags']
		const getflag = ( param: FunctionParam ): NonNullable<ClippiumData['flags']>[string] => ( {
			type    : param.tsType === 'number' ? 'number' : 'string',
			desc    : param.description || `Parameter ${param.name} of ${fnData.name}`,
			default : param.tsType === 'number' && param.defaultValue ? Number( param.defaultValue ) : param.defaultValue,
		} )

		for ( const param of fnData.params || [] ) {

			if ( !param.name ) continue
			if ( !flags ) flags = {}
			flags[param.name] = getflag( param )

			if ( param.params ) for ( const subParam of param.params || [] ) {

				if ( !subParam.name ) continue
				if ( !flags ) flags = {}
				flags[param.name + '-' + subParam.name] = getflag( subParam )

			}

		}

		return {
			name : fnData.name,
			desc : fnData.returns?.description,
			flags,
		}

	}

}

export const esmFn = new ESMFunctions()

export const esmFnPlugin = createPlugin( {
	desc    : 'Converter utils for ECMAScript modules (ESM) [experimental]',
	convert : { toData : {
		examples : [
			{
				value : '$0 -i ./esm.js -o ./out.js',
				desc  : 'convert "default" export function to clippium data',
			},
			{
				value : '$0 -i ./esm.js -o ./out.js --export add',
				desc  : 'convert "add" export function to clippium data',
			},
		],
		flags : { name : {
			type    : 'string',
			desc    : 'Export function name',
			default : 'default',
		} },
		fn : ( {
			input, flags,
		} ) =>
			esmFn.convertToData( input, { name: flags.name || 'default' } ),
	} },
} )
