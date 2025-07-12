import {
	joinPath,
	writeFile,
} from '@dovenv/core/utils'

import { content } from './create-md.js'
import { core }    from '../../../.dovenv/index.js'

if ( !core.workspaceDir ) throw new Error( 'core not found' )
const performanceFile = joinPath( core.workspaceDir, 'docs', 'guide', 'core', 'performance.md' )

await writeFile( performanceFile, content )
