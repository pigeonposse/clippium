
import { Clippium } from '../src'
import {
	data,
	configData,
	formatter,
	errorStyle,
} from './data'

const cli = new Clippium<typeof configData>(
	data as typeof configData,
	{
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		help  : { formatter: d => formatter( d as any ) },
		// validate : { strings: { commandNotExists: opts => 'The COMMAND "' + opts.value + '" does not exist.' } },
		error : { on: ( { error } ) => console.error( errorStyle( error.message ) ) },
	},
)

export const run = async ( args: string[] ) => {

	try {

		// Add dynamic flags from config file
		const { flags } = cli.parse( args )

		if ( flags.config ) cli.data = configData

		cli.fn = async ( data ): Promise<void> => {

			const {
				utils, ...args
			} = data

			const validated = cli.validate( data )
			const {
				commands, flags, positionals,
			} = validated
			console.log( '\n', { 'CLI ARGUMENTS' : {
				argv       : utils.argv,
				parsedArgv : utils.parsedArgv,
				values     : args,
				validated,
			} } )

			const help    = flags.help
			const version = flags.version

			if ( flags.noColor && cli.config.help ) cli.config.help.formatter = undefined
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
				const minify      = flags.minify

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
