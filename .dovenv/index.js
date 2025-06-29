import {
	getWorkspaceConfig,
	pigeonposseMonorepoTheme,
} from '@dovenv/theme-pigeonposse'

export default pigeonposseMonorepoTheme( { core : await getWorkspaceConfig( {
	metaURL  : import.meta.url,
	path     : '../',
	corePath : './packages/core',
} ) } )

