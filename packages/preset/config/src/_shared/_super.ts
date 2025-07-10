
export type CommonObj =
	Record<Any, Any>
	| Record<Any, Any>[]
	| unknown[]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any

export type Satisfies<From, To extends From> = To

export type Prettify<T> = {
	[K in keyof T]: T[K]
} & {}

export const isBrowser = typeof window !== 'undefined'

export const catchError = async <T>( promise: Promise<T> ): Promise<[undefined, T] | [Error]> => {

	return promise
		.then( value => ( [ undefined, value ] as unknown as [undefined, T] ) )
		.catch( error => ( [ error ] ) )

}

export const joinPath = ( ...paths: string[] ): string => {

	return paths
		.filter( Boolean ) // elimina valores falsy como '', null, undefined
		.map( ( segment, index ) => {

			if ( index === 0 ) {

				// Para el primer segmento, solo quitar barra al final
				return segment.replace( /\/+$/, '' )

			}
			else {

				// Para los demás, quitar barra al inicio y al final
				return segment.replace( /^\/+|\/+$/g, '' )

			}

		} )
		.filter( Boolean )
		.join( '/' )

}
