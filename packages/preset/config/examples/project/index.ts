import {
	Clippium,
	hideBin,
} from 'clippium'
import { dirname }       from 'node:path'
import { fileURLToPath } from 'node:url'

import { data }     from './data'
import pluginConfig from '../../src/index'

const cli = new Clippium( data )

const rootDir = dirname( fileURLToPath( import.meta.url ) )

const getConfig = pluginConfig( {
	rootDir,
	configNames : [ 'config' ],
	supported   : [
		'javascript',
		'json',
		'package',
	],
} )

cli.fn = async data => {

	const {
		utils, ...rest
	} = data

	const parsedData = await getConfig( data )

	if ( !parsedData.data ) console.log( `⚠️  No config found in: ${rootDir}` )
	else console.log( `✅ Config found: ${parsedData.data.path}` )
	console.log( '\n' )
	console.dir( {
		init : rest,
		parsedData,
	}, { depth: null } )

}

cli.run( hideBin( process.argv ) )

