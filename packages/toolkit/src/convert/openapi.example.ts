import { Clippium } from 'clippium'

import { openapi } from './openapi'

const data = await openapi.convertToData( 'https://petstore.swagger.io/v2/swagger.json' )

const cli = new Clippium( data )

cli.fn = async data => {

	console.log( data.utils.getHelp() )

}

cli.run( process.argv.slice( 2 ) )
