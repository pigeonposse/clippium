import { Clippium } from 'clippium'

import data from '../test/example-data'

const cli = new Clippium( {
	name  : 'test',
	...data,
	flags : { help : {
		type  : 'boolean',
		desc  : 'Show help',
		alias : [ 'h' ],
	} },
} )
cli.fn    = async data => {

	if ( data.flags.help ) console.log( data.utils.getHelp() )
	else if ( data.commands['pet-findByStatus'] ) {

		console.log( data.commands['pet-findByStatus'] )

	}

}
cli.run( process.argv.slice( 2 ) )

