export const getStringType = ( value: string ): 'text' | 'url' | 'path' => {

	if ( isUrl( value ) ) return 'url'
	if ( isPath( value ) ) return 'path'
	return 'text'

}

const isUrl = ( value: string ): boolean => {

	try {

		new URL( value )
		return true

	}
	catch {

		return false

	}

}

export const isPath = ( str: string ): boolean => {

	const pathPattern = /^(\.\/|\.\.\/|\/|[A-Za-z]:[\\/])/

	if ( !pathPattern.test( str ) ) return false

	if ( /\s(?!\\)/.test( str ) && !/\\\s/.test( str ) ) return false

	return true

}

// export const isPath = async ( str: string ) => {

// 	const {
// 		join, isAbsolute,
// 	} = await import( 'path' )
// 	if ( isAbsolute( str ) || /^(\.\/|\.\.\/|[A-Za-z]:\\|\/)/.test( str ) ) {

// 		if ( isAbsolute( str ) || /^(\.\/|\.\.\/|[A-Za-z]:\\|\/)/.test( str ) ) {

// 			if ( /\s(?!\\)/.test( str ) && !/\\\s/.test( str ) )
// 				return false

// 			try {

// 				const normalizedPath = join( str )
// 				return normalizedPath !== ''

// 			}
// 			catch {

// 				return false

// 			}

// 		}

// 	}
// 	return false

// }
