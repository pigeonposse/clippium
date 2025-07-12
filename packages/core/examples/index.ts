
import { Clippium } from '../dist'
import {
	data,
	nestCommands,
} from './data'
import { formatter } from '../../preset/colored/src/index'
import color         from '../../utils/color/src/index'

const cli = new Clippium(
	data,
	{ help : { formatter : formatter( {
		title         : color.cyan.inverse.bold,
		bin           : color.cyan,
		version       : color.cyan.dim.italic,
		name          : color.bold,
		positionals   : color.green.dim,
		commands      : color.green,
		flags         : color.yellow,
		desc          : color.white.dim,
		examples      : color.cyan,
		sectionTitle  : color.white.bold.underline,
		sectionDesc   : color.white.dim,
		sectionsProps : color.white.dim.italic,
	} ) } },
)

export const run = async ( args: string[] ) => {

	try {

		// Add dynamic flags from config file
		const { flags } = cli.parse( args )

		if ( flags.config ) cli.data = {
			...cli.data,
			commands : {
				...cli.data.commands,
				// @ts-ignore
				new : {
					desc     : 'New command from config',
					commands : nestCommands.commands,
					flags    : { nestflag : {
						type  : 'boolean',
						desc  : 'Nest flag',
						alias : [ 'n' ],
					} },
				},
			},
		}

		cli.fn = async ( {
			utils, ...args
		} ): Promise<void> => {

			const {
				commands, flags, positionals,
			} = args

			console.log( '\n', { 'CLI ARGUMENTS' : {
				argv       : utils.argv,
				parsedArgv : utils.parsedArgv,
				values     : args,
			} } )

			const help    = flags.help || flags.h
			const version = flags.version || flags.v

			if ( help ) return console.log( utils.getHelp() )
			if ( version ) return console.log( utils.getVersion() )

			if ( positionals.target ) {

				const name    = positionals.target || 'World'
				const message = flags.message || 'Hello'
				const loud    = flags.loud

				console.log( `\nExecuting the 'greet' command:` )
				console.log( `Message: ${message}, Name: ${name}, Loud: ${loud ? 'YES' : 'NO'}` )
				console.log( `${message}, ${name}${loud ? '!!!' : '.'}` )

			}
			else if ( commands.build ) {

				const source      = positionals.src || './src'
				const destination = positionals.dest || './dist'
				const minify      = flags.minify || flags.m

				console.log( `\nExecuting the 'build' command:` )
				console.log( `Source: ${source}, Destination: ${destination}, Minify: ${minify ? 'YES' : 'NO'}` )
				console.log( 'Build completed successfully.' )

			}
			else if ( commands.new && flags.config ) {

				console.log( `\nExecuting the 'new' command:` )
				console.log( `Nest flag: ${flags.nestflag ? 'YES' : 'NO'}` )

			}
			else {

				console.log( `\nCommand '${Object.keys( commands )[0] || 'none'}' not recognized.` )
				console.log( 'Try: npm start -- greet --message "Hi there" --loud John' )
				console.log( 'Or: npm start -- build --src app --dest build --minify' )
				console.log( utils.getHelp() )

			}

		}

		await cli.run( args )

	}
	catch ( error ) {

		console.error( '\n--- Error during Clippium execution ---' )
		console.error( error )

	}

}

export default cli
