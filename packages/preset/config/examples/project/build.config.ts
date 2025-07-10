import { config }            from '@clippium/_config/unbuild'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig( [
	{
		...config,
		entries : [ 'index.ts' ],
	},
] )
