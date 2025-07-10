import { ClippiumData } from 'clippium'

import {
	Any,
	CommonObj,
} from '../_shared/_super'
import { InputType } from '../_shared/file'
import {
	getContent,
	Input,
} from '../_shared/file'
import {
	getObjectFromString,
	getStringFromObject,
	getTypeFromExtension,
} from '../_shared/object'

export type CreateInterface = {
	convertToData?   : ( input: Input, opts?: Any ) => Promise<ClippiumData>
	convertFromData? : ( input: ClippiumData, opts?: Any ) => Promise<string>
}

export const getExtension = ( input: Input, type?: InputType ) => {

	const ext = ( type === 'url' || type === 'path' ) && typeof input === 'string' ? input.split( '.' ).pop() : undefined
	return ext

}

export const file2object = async <R extends CommonObj>( input: Input ): Promise<R> => {

	const {
		content, type,
	} = await getContent( input )
	const ext = getExtension( input, type )

	const res = await getObjectFromString<R>(
		content,
		ext ? getTypeFromExtension( ext ) : undefined,
	)

	return res

}

export const object2String = async ( input: string, data: CommonObj, opts?:{
	jsComment?   : string
	tsComment?   : string
	yamlComment? : string
	tomlComment? : string
} ) => {

	const ext  = input.split( '.' ).pop()
	const type = ext ? getTypeFromExtension( ext ) : undefined

	let res = await getStringFromObject(
		data,
		type,
	)

	if ( type === 'yaml' && opts?.yamlComment ) res = opts.yamlComment + '\n' + res
	if ( type === 'toml' && opts?.tomlComment ) res = opts.tomlComment + '\n' + res
	if ( type === 'ts' && opts?.tsComment ) res = opts.tsComment + '\n' + res
	if ( type === 'js' && opts?.jsComment ) res = opts.jsComment + '\n' + res

	return res

}
