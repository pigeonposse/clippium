import {
	getWorkspaceConfig,
	pigeonposseMonorepoTheme,
} from '@dovenv/theme-pigeonposse'

export default pigeonposseMonorepoTheme( {
	docs : {
		vitepress : {
			ignoreDeadLinks : true,
			themeConfig     : { outline: { level: [ 2, 3 ] } },
			metaChunk       : true,
		},
		twoslash : false,
	},
	core : await getWorkspaceConfig( {
		metaURL  : import.meta.url,
		path     : '../',
		corePath : './packages/core',
	} ),
} )

