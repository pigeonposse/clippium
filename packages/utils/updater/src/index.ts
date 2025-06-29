import updaterTiny from 'tiny-updater'

export type UpdaterOptions = {
	name    : string
	version : string
	ttl?    : number
}

export const updater = ( opts: UpdaterOptions ) => {

	return { notify : () => updaterTiny( {
		...opts,
		ttl : 86_400_000,
	} ) }

}
