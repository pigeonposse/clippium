
import { Cache }   from './utils/cache'
import { onExit }  from './utils/onexit'
import {
	getPackageManager,
	getPackageVersionsFromRegistry,
	getVersionType,
} from './utils/package'

export type Options = {
	/**
	 * Package name
	 */
	name           : string
	/**
	 * Package version
	 */
	version        : string
	/**
	 * Time to live in milliseconds.
	 * Determines how long a cached entry is valid.
	 *
	 * @default 1000 * 60 * 60 * 24 // (1 day)
	 */
	ttl?           : number
	/**
	 * latest version to check
	 *
	 * @default 'latest'
	 */
	latestVersion? : string
	/**
	 * Cache prefix
	 *
	 * @default 'clippium-updater'
	 */
	prefix?        : string
}

export type UpdateData = {
	latestVersion  : string
	currentVersion : string
	packageManager : string
	packageName    : string
	type           : 'latest' | 'major' | 'minor' | 'patch' | 'prerelease' | 'build'
}
type UpdateCacheValue = {
	latestVersion : string
	versions      : string[]
}
const ONE_DAY = 1000 * 60 * 60 * 24
export class Updater {

	#opts  : Required<Options>
	#cache : Cache<UpdateCacheValue>

	constructor( userOpts: Options ) {

		if ( !userOpts.name ) throw new Error( 'name is required' )
		if ( !userOpts.version ) throw new Error( 'version is required' )

		this.#opts  = {
			ttl           : ONE_DAY, // 1 día
			latestVersion : 'latest',
			prefix        : 'clippium-updater',
			...userOpts,
		}
		this.#cache = new Cache( `${this.#opts.prefix}-${this.#opts.name}-${this.#opts.latestVersion}` )

	}

	async #setCache<K extends keyof UpdateCacheValue>( key: K, value: UpdateCacheValue[K] ) {

		await this.#cache.set( key, value, typeof this.#opts.ttl !== 'number' ? ONE_DAY : this.#opts.ttl )

	}

	async #getCache<K extends keyof UpdateCacheValue>( key: K, cb: () => Promise<UpdateCacheValue[K] | undefined> ) {

		const cached = await this.#cache.get( key )

		if ( cached ) return cached

		const data = await cb()
		if ( !data ) return undefined
		await this.#setCache( key, data )
		return data

	}

	async #getLatestVersion( ) {

		try {

			const versions = await this.#getCache( 'versions', () => getPackageVersionsFromRegistry( this.#opts.name ) )

			if ( !versions?.length ) return undefined
			return !this.#opts.latestVersion || this.#opts.latestVersion === 'latest' ? versions[versions.length - 1] : this.#opts.latestVersion

		}
		catch {

			return undefined

		}

	}

	/**
	 * Get updater data if a new version is available
	 *
	 * @returns {Promise<UpdateData | undefined>} - Updater data
	 */
	async get( ): Promise<UpdateData | undefined> {

		const {
			name, version,
		} = this.#opts

		// check cache
		const latestVersion = await await this.#getCache( 'latestVersion', () => this.#getLatestVersion() )

		if ( !latestVersion ) return undefined

		// Is updated
		if ( latestVersion === version ) {

			await this.#setCache( 'latestVersion', latestVersion )
			return undefined

		}

		const type           = getVersionType( version, latestVersion )
		const packageManager = ( await getPackageManager() ) ?? 'npm'

		const updateData: UpdateData = {
			currentVersion : version,
			latestVersion,
			packageManager,
			packageName    : name,
			type,
		}

		await this.#setCache( 'latestVersion', latestVersion )
		return updateData

	}

	/**
	 *
	 * Notify if a new version is available
	 *
	 * @param {( data: UpdateData ) => Promise<void> | void} cb - Callback
	 */
	async notify( cb?: ( data: UpdateData ) => Promise<void> | void ): Promise<void> {

		const update = await this.get()
		if ( !update ) return

		if ( cb ) await cb( update )

		console.log(
			`Update available: ${update.currentVersion} → ${update.latestVersion} (${update.type})`,
		)
		console.log( `Run: ${update.packageManager} install ${update.packageName}@${update.latestVersion}` )

	}

	/**
	 *
	 * Run updater on exit
	 *
	 */
	async run( ): Promise<void> {

		await onExit( async () => await this.notify() )

	}

}
