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

type VersionType = 'latest' | 'major' | 'minor' | 'patch' | 'prerelease' | 'build'

export const getVersionType = (
	oldVersion: string,
	newVersion: string,
): VersionType => {

	const parse = ( v: string ) => {

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

	const o = parse( oldVersion )
	const n = parse( newVersion )

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
