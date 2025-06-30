import { config }            from '@clippium/_config/unbuild'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig( [
	{
		...config,
		rollup : {
			inlineDependencies : true,
			emitCJS            : false,
			esbuild            : {
				minify         : false,
				target         : 'node20',
				jsxSideEffects : true,
			},
		},
	},
] )
