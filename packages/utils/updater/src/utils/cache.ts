import {
	isBrowser,
	joinPath,
} from './sys'

const getCachePath = async ( name: string ) => {

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

type CacheValue<T> = {
	value      : T
	expiresAt? : number // timestamp en ms
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CacheDefault = Record<string, any>

export class Cache<Data extends CacheDefault = CacheDefault> {

	readonly #id : string

	constructor(
		id: string,
	) {

		this.#id = id

	}

	async #getFile() {

		return await getCachePath( this.#id + '.json' )

	}

	async set<D extends Data>( key: keyof D, value: D[keyof D], ttlMs?: number ): Promise<void> {

		const record: CacheValue<D[keyof D]> = {
			value,
			expiresAt : ttlMs ? Date.now() + ttlMs : undefined,
		}
		const serialized                     = JSON.stringify( record )

		if ( isBrowser ) localStorage.setItem( key as string, serialized )
		else {

			const {
				readFile, writeFile, access,
			} = await import( 'node:fs/promises' )
			const { constants } = await import( 'node:fs' )
			const cacheFile     = await this.#getFile()
			// @ts-ignore
			let cache: Record<keyof D, CacheValue<D[keyof D]>> = {}

			try {

				await access( cacheFile, constants.F_OK )
				const content = await readFile( cacheFile, 'utf-8' )
				cache         = JSON.parse( content )

			}
			catch {
				// empty
			}

			cache[key] = record
			await writeFile( cacheFile, JSON.stringify( cache, null, 2 ), 'utf-8' )

		}

	}

	async get<K extends keyof Data>( key: K ): Promise<Data[K] | undefined> {

		const now = Date.now()

		if ( isBrowser ) {

			const item = localStorage.getItem( key as string )
			if ( !item ) return undefined

			try {

				const record: CacheValue<Data[K]> = JSON.parse( item )
				if ( record.expiresAt && record.expiresAt < now ) {

					localStorage.removeItem( key as string )
					return undefined

				}
				return record.value

			}
			catch {

				return undefined

			}

		}
		else {

			const {
				readFile, writeFile, access,
			} = await import( 'fs/promises' )
			const { constants } = await import( 'fs' )

			try {

				const cacheFile = await this.#getFile()

				await access( cacheFile, constants.F_OK )
				const content                                        = await readFile( cacheFile, 'utf-8' )
				const cache: Record<keyof Data, CacheValue<Data[K]>> = JSON.parse( content )

				const record = cache[key]
				if ( !record ) return undefined

				if ( record.expiresAt && record.expiresAt < now ) {

					delete cache[key]
					await writeFile( cacheFile, JSON.stringify( cache, null, 2 ), 'utf-8' )
					return undefined

				}

				return record.value

			}
			catch {

				return undefined

			}

		}

	}

	async clear( key?: keyof Data ): Promise<void> {

		if ( isBrowser ) {

			if ( key ) localStorage.removeItem( key as string )
			else localStorage.clear()

		}
		else {

			const {
				readFile, writeFile, unlink, access,
			} = await import( 'node:fs/promises' )
			const { constants } = await import( 'node:fs' )

			try {

				const cacheFile = await this.#getFile()
				await access( cacheFile, constants.F_OK )

				if ( key ) {

					const content = await readFile( cacheFile, 'utf-8' )
					const cache   = JSON.parse( content )
					delete cache[key]
					await writeFile( cacheFile, JSON.stringify( cache, null, 2 ), 'utf-8' )

				}
				else {

					await unlink( cacheFile )

				}

			}
			catch {
				// ignore
			}

		}

	}

}
