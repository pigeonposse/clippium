import {
	ClippiumData,
	FlagType,
	OPTION,
} from '../_shared/data'

const DEFAULT_TYPE = OPTION.boolean

export class Validate {

	constructor( public data: ClippiumData ) {}

	#transformStringValue<V extends string | number | boolean>( value: V, type: FlagType ) {

		if ( type === 'string' ) {

			return String( value )

		}
		else if ( type === 'number' ) {

			const num = Number( value )
			if ( isNaN( num ) ) throw new Error( `Invalid number: "${value}"` )
			return num

		}
		else if ( type === 'boolean' ) {

			const str = String( value ).toLowerCase()
			console.log( {
				value,
				str,
				returned : str === 'true' || str === '1',
			} )
			if ( str === 'true' || str === '1' ) return true
			if ( str === 'false' || str === '0' ) return false
			throw new Error( `Invalid boolean: "${value}"` )

		}
		else if ( type === 'object' ) {

			if ( typeof value !== 'string' )
				throw new Error( `Expected string for object type, got ${typeof value}` )

			try {

				const parsed = JSON.parse( value )
				if (
					typeof parsed === 'object'
					&& parsed !== null
					&& !Array.isArray( parsed )
				) {

					return parsed

				}
				throw new Error()

			}
			catch {

				throw new Error( `Invalid JSON object: "${value}"` )

			}

		}
		else if ( type === 'array' ) {

			if ( typeof value !== 'string' ) {

				throw new Error( `Expected string for array type, got ${typeof value}` )

			}

			try {

				const parsed = JSON.parse( value )
				if ( Array.isArray( parsed ) ) return parsed
				throw new Error()

			}
			catch {

				throw new Error( `Invalid JSON array: "${value}"` )

			}

		}
		else if ( type === 'choices' )
			return value
		throw new Error( `Unsupported type: "${type}"` )

	}

	run() {

	}

}
