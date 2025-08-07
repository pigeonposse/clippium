
export const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

const trimSlashes = ( segment: string, index: number ) => {

	if ( index === 0 ) {

		let i = segment.length
		while ( i > 0 && segment[i - 1] === '/' ) i--
		return segment.slice( 0, i )

	}
	else {

		let start = 0,
			end   = segment.length

		while ( start < end && segment[start] === '/' ) start++
		while ( end > start && segment[end - 1] === '/' ) end--

		return segment.slice( start, end )

	}

}

/**
 * Joins multiple path segments into a single path.
 *
 * - In **Node.js**, utilizes the `path.join` method for joining paths.
 * - In **browsers**, manually concatenates paths, removing redundant slashes.
 *
 * @param   {...string}       paths - The path segments to join.
 * @returns {Promise<string>}       The joined path as a string.
 * @example
 * const fullPath = await joinPath('folder', 'subfolder', 'file.txt')
 * console.log(fullPath) // 'folder/subfolder/file.txt' or 'folder\\subfolder\\file.txt' in Node.js
 */
export const joinPath = async ( ...paths: string[] ): Promise<string> => {

	if ( !isBrowser ) {

		const { join } = await import( 'path' )
		return join( ...paths )

	}
	return paths
		.filter( Boolean )
		.map( trimSlashes )
		.filter( Boolean )
		.join( '/' )

}

/**
 * Gets the path to the cache directory for the given name.
 *
 * @param   {string}          name - The name of the cache.
 * @returns {Promise<string>}      The path to the cache directory.
 * @throws {Error} If the function is called in a browser environment.
 * @throws {TypeError} If the given name is not a string.
 * @example
 * const cachePath = await getCachePath('my-cache')
 * console.log(cachePath) // '/Users/username/Library/Caches/my-cache' on macOS or 'C:\Users\username\AppData\Local\my-cache\Cache' on Windows
 */
export const getCachePath = async ( name: string ) => {

	if ( isBrowser ) throw new Error( 'getCachePath is not supported in the browser' )

	if ( typeof name !== 'string' )
		throw new TypeError( `Expected a string, got ${typeof name}` )

	const { homedir } = await import( 'node:os' )
	const {
		env, platform,
	} = await import( 'node:process' )

	if ( platform === 'darwin' ) return await joinPath( homedir(), 'Library', 'Caches', name )
	if ( platform === 'win32' ) return await joinPath( env.LOCALAPPDATA || await joinPath( homedir(), 'AppData', 'Local' ), name, 'Cache' )

	return env.XDG_CACHE_HOME || await joinPath( homedir(), '.cache' )

}
