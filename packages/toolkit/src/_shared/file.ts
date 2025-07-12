import {
	isBrowser,
	getStringType,
	joinPath,
} from './_super'

export type Input = string | URL | ArrayBuffer
export type InputType = 'text' | 'url' | 'path' | 'arraybuffer'
export const getContent = async ( i: Input ): Promise<{
	content : string
	type    : InputType
}> => {

	if ( i instanceof ArrayBuffer ) {

		if ( isBrowser ) {

			const decoder = new TextDecoder( 'utf-8' )
			return {
				content : decoder.decode( i ),
				type    : 'arraybuffer',
			}

		}
		else {

			const buffer = Buffer.from( i )
			return {
				content : buffer.toString( 'utf8' ),
				type    : 'arraybuffer',
			}

		}

	}

	const type = i instanceof URL ? 'url' : getStringType( i )

	if ( type === 'text' ) return {
		content : i as string,
		type,
	}

	if ( type === 'url' ) {

		const res  = await fetch( i )
		const text = await res.text()
		return {
			content : text,
			type,
		}

	}

	if ( isBrowser ) {

		const res  = await fetch( i )
		const text = await res.text()
		return {
			content : text,
			type,
		}

	}

	const { readFile } = await import( 'node:fs/promises' )
	const fileContent  = await readFile( i as string, 'utf8' )
	return {
		content : fileContent,
		type,
	}

}

export const getProcess = async () => {

	return await import( 'node:process' )

}
export const getCwd = async () => {

	const { cwd } = await getProcess( )

	return cwd()

}

export const ensureDir = async ( path: string ) => {

	const {
		mkdir, stat,
	} = await import( 'node:fs/promises' )
	const {
		dirname, extname,
	} = await import( 'node:path' )
	let dir = path

	try {

		const stats = await stat( path )

		if ( stats.isFile() ) dir = dirname( path )

	}
	catch {

		// Si no existe: asumir que es archivo si tiene extensión, si no, es directorio
		if ( extname( path ) ) dir = dirname( path )

	}

	return mkdir( dir, { recursive: true } )

}

export const writeFile = async ( i: string, content: string | Uint8Array ) => {

	if ( isBrowser ) throw new Error( 'Writing to the filesystem is not supported in the browser' )

	await ensureDir( i )

	const { writeFile } = await import( 'node:fs/promises' )
	return writeFile( i as string, content, 'utf8' )

}

export const findAndImport = async <T>( paths: string[] ) => {

	for ( const path of paths ) {

		try {

			const mod = await import( joinPath( await getCwd(), path ) )

			return mod.default as T

		}
		catch {

			// no-op
		}

	}
	return undefined

}

export const getTs = async () => {

	try {

		return await import( 'typescript' )

	}
	catch ( _ ) {

		throw new Error( 'typescript not found. Install "typescript" in your project.' )

	}

}
