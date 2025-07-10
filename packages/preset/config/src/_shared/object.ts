import { CommonObj }                from './_super'
import { readFile }                 from './file'
import { getObjectFromJSContent }   from './js'
import { getObjectFromJSONContent } from './json'
import { getObjectFromTOMLContent } from './toml'
import { getObjectFromYAMLContent } from './yaml'

type Input = string | URL

type GetDataOpts = { key?: string }
const _getObject =  async <C extends CommonObj>( cb: typeof getObjectFromJSONContent, i: Input, opts?: GetDataOpts ) => {

	try {

		const content = await readFile( i )
		const res     = await cb( content )
		if ( opts?.key ) return ( res as { [key: string]: C } )[opts.key]
		return res as C

	}
	catch ( error ) {

		throw new Error( `Error getting data from "${i}": ${error instanceof Error ? error.message : 'Unknown error'}` )

	}

}

const json2object =  <C extends CommonObj>( i: Input, opts?: GetDataOpts ) =>
	_getObject<C>( getObjectFromJSONContent, i, opts )

const yaml2object = <C extends CommonObj>( i: Input, opts?: GetDataOpts ) =>
	_getObject<C>( getObjectFromYAMLContent, i, opts )
const toml2object = <C extends CommonObj>( i: Input, opts?: GetDataOpts ) =>
	_getObject<C>( getObjectFromTOMLContent, i, opts )

const js2object = <C extends CommonObj>( i: Input, opts?: GetDataOpts ) =>
	_getObject<C>( getObjectFromJSContent, i, opts )

export const setObjectFrom = {
	json : json2object,
	yaml : yaml2object,
	toml : toml2object,
	js   : js2object,
}

