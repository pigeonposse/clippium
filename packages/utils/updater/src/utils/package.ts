export const getPackageManager = async ( cwd = '.' ): Promise<'npm' | 'yarn' | 'pnpm' | 'bun' | undefined> => {

	const pathJoin      = ( await import( 'node:path' ) ).join
	const { access }    = await import( 'node:fs/promises' )
	const { constants } = await import( 'node:fs' )

	const lockfiles = {
		npm  : 'package-lock.json',
		yarn : 'yarn.lock',
		pnpm : 'pnpm-lock.yaml',
		bun  : 'bun.lockb',
	} as const

	for ( const [ manager, file ] of Object.entries( lockfiles ) ) {

		try {

			await access( pathJoin( cwd, file ), constants.F_OK )
			return manager as keyof typeof lockfiles

		}
		catch {
			// archivo no existe, seguimos buscando
		}

	}

	return undefined

}

export const getPackageVersionsFromRegistry = async (
	packageName: string,
	registry = 'https://registry.npmjs.org/',
): Promise<string[]> => {

	if ( !packageName ) throw new Error( 'Package name is required' )

	const url = `${registry.replace( /\/$/, '' )}/${encodeURIComponent( packageName )}`

	const res = await fetch( url )

	if ( !res.ok )
		throw new Error( `Failed to fetch package info: ${res.status} ${res.statusText}` )

	const data = await res.json()

	if ( !data.versions || typeof data.versions !== 'object' )
		throw new Error( `Invalid response or no versions for package: ${packageName}` )

	return Object.keys( data.versions )

}

type ParsedVersion = {
	major      : number
	minor      : number
	patch      : number
	prerelease : string
	build      : string
}

type VersionType = 'latest' | 'major' | 'minor' | 'patch' | 'prerelease' | 'build'

const parseVersion = ( v: string ): ParsedVersion => {

	const [ main, build ]      = v.split( '+' )
	const [ core, prerelease ] = main.split( '-' )

	const [
		major,
		minor,
		patch,
	] = core.split( '.' ).map( Number )

	return {
		major,
		minor,
		patch,
		prerelease : prerelease ?? '',
		build      : build ?? '',
	}

}

/**
 * Compare two semver strings numerically.
 *
 * @param   {string} a - First version to compare.
 * @param   {string} b - Second version to compare.
 * @returns {number}   `-1` if `a < b`, `0` if equal, `1` if `a > b`.
 */
export const compareVersions = ( a: string, b: string ): number => {

	const x = parseVersion( a )
	const y = parseVersion( b )

	if ( x.major !== y.major ) return x.major > y.major ? 1 : -1
	if ( x.minor !== y.minor ) return x.minor > y.minor ? 1 : -1
	if ( x.patch !== y.patch ) return x.patch > y.patch ? 1 : -1
	// prerelease < release
	if ( ( x.prerelease !== '' ) !== ( y.prerelease !== '' ) )
		return x.prerelease === '' ? 1 : -1
	if ( x.prerelease !== y.prerelease ) return x.prerelease > y.prerelease ? 1 : -1
	if ( x.build !== y.build ) return x.build > y.build ? 1 : -1

	return 0

}

export const getVersionType = (
	oldVersion: string,
	newVersion: string,
): VersionType => {

	const o = parseVersion( oldVersion )
	const n = parseVersion( newVersion )

	if (
		o.major === n.major
		&& o.minor === n.minor
		&& o.patch === n.patch
		&& o.prerelease === n.prerelease
		&& o.build === n.build
	) {

		return 'latest'

	}

	if ( o.major !== n.major ) return 'major'
	if ( o.minor !== n.minor ) return 'minor'
	if ( o.patch !== n.patch ) return 'patch'
	if ( o.prerelease !== n.prerelease ) return 'prerelease'
	if ( o.build !== n.build ) return 'build'

	return 'latest'

}
