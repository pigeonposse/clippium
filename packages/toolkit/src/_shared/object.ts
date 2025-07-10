import {
	CommonObj,
	js,
	json,
	toml,
	yaml,
} from '../_shared/_super'
import {
	jsExtension,
	jsonExtension,
	tomlExtension,
	tsExtension,
	yamlExtension,
} from '../_shared/_super'

const deserializer = {
	yaml : yaml.deserialize,
	toml : toml.deserialize,
	js   : js.deserialize,
	ts   : js.deserialize,
	json : json.deserialize,
} as const

const serializer = {
	yaml : yaml.serialize,
	toml : toml.serialize,
	js   : ( input: CommonObj ) => `export default ${JSON.stringify( input, null, 2 )};\n`,
	ts   : ( input: CommonObj ) => `export default ${JSON.stringify( input, null, 2 )} as const;\n`,
	json : ( input: CommonObj, opts?: { space?: string | number } ) => JSON.stringify( input, null, opts?.space || 2 ),
} as const

export const validExtensions = {
	json : jsonExtension,
	js   : jsExtension,
	ts   : tsExtension,
	yaml : yamlExtension,
	toml : tomlExtension,
} as const

export const getTypeFromExtension = ( ext: string ): keyof typeof validExtensions | undefined => {

	// @ts-ignore
	return Object.entries( validExtensions ).find( ( [ _k, v ] ) => Object.values( v ).includes( ext ) )[0]

}

export const getObjectFromString = async <Res extends CommonObj = CommonObj>(
	content: string,
	forcedType?: keyof typeof validExtensions,
): Promise<Res> => {

	if ( forcedType )
		return deserializer[forcedType]<Res>( content )

	for ( const deserialize of Object.values( deserializer ) ) {

		try {

			const result = deserialize<Res>( content )
			if ( result !== undefined && result !== null )
				return result

		}
		catch {
			// Ignore and try the next
		}

	}

	throw new Error( 'No valid deserialization method found' )

}

export const getStringFromObject = async ( input: CommonObj, forcedType?: keyof typeof validExtensions ) => {

	if ( forcedType )
		return serializer[forcedType]( input )

	for ( const serialize of Object.values( serializer ) ) {

		try {

			const result = serialize( input )
			if ( result !== undefined && result !== null )
				return result

		}
		catch {
			// Ignore and try the next
		}

	}

	throw new Error( 'No valid serialization method found' )

}
