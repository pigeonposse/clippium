import { formatter } from '@clippium/preset-colored'
import presetDefault from '@clippium/preset-default'
import { Clippium }  from 'clippium'

import {
	version,
	name,
	repository,
} from '../package.json'

const cliDefault = presetDefault( { grouped: true } )
const cli        = new Clippium( {
	name,
	version,
	commands : { create: { desc: 'Create clippium data based on multiple contents' } },
	flags    : { ...cliDefault.data.flags },
}, { help: { formatter } } )

cli.fn = async data => {

	await cliDefault.fn( data )
	if ( data.commands.create ) {

		console.log( 'COMMING SOON :)' )
		console.log( `Development in: ${repository.url + repository.directory}` )

	}
	else console.log( data.utils.getHelp() )

}

export default cli
