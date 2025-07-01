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
		styles : { color : {
			primary   : '#221853',
			secondary : '#725aa6',
			terciary  : '#9276b3',
			fourth    : '#9c7cbc',
		} },
		twoslash : false,
	},
	predocs : { emoji : {
		toolkit : '🧰',
		utils   : '🛠️',
	} },
	core : await getWorkspaceConfig( {
		metaURL  : import.meta.url,
		path     : '../',
		corePath : './packages/core',
	} ),
} )

