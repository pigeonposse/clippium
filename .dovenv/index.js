import {
	getSidebar,
	getWorkspaceConfig,
	pigeonposseMonorepoTheme,
} from '@dovenv/theme-pigeonposse'

const emojis = {
	toolkit : '🧰',
	color   : '🎨',
	colored : '🖼️',
	i18n    : '🌐',
	updater : '📦',
	default : '➡️',
	schema  : '📝',
}
export const core = await getWorkspaceConfig( {
	metaURL  : import.meta.url,
	path     : '../',
	corePath : './packages/core',
} )
export default pigeonposseMonorepoTheme( {
	docs : async utils => {

		const sidebar = await getSidebar( {
			utils,
			opts : { emojis },
		} )
		return {
			vitepress : {
				ignoreDeadLinks : true,
				themeConfig     : { outline: { level: [ 2, 3 ] } },
				metaChunk       : true,
			},
			styles : {
				color : {
					primary   : '#221853',
					secondary : '#725aa6',
					terciary  : '#9276b3',
					fourth    : '#9c7cbc',
				},
			},
			css : `html.dark {
				--vp-c-text-1: #efe3ff !important;
			}`,
			sidebar : {
				'/guide/'       : sidebar,
				'/todo/'        : sidebar,
				'/contributors' : sidebar,
			},
			autoSidebar : {
				intro     : false,
				reference : false,
			},
			twoslash : false,
			version  : core.corePkg?.version,
		}

	},
	predocs : { emoji: emojis },
	core,
} )

