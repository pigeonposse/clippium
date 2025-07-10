export type ParsedArgv = {
	/**
	 * flags Options (ex: --name=value)
	 */
	[key: string] : string | boolean | string[]
	/**
	 * Commands & positional arguments
	 */
	_             : string[]
}

// NOTE: Maybe validate if flag is boolean or not, because "-c command" will be parsed as a flag=value and not as a flag and command.

export class Parser {

	argv : string[]

	constructor( argv: string[] | string ) {

		this.argv = typeof argv === 'string' ? argv.split( ' ' ) : argv

	}

	run(): ParsedArgv {

		const argv               = this.argv
		const result: ParsedArgv = { _: [] } // Positional arguments
		let i                    = 0

		while ( i < argv.length ) {

			const arg = argv[i]

			if ( arg.startsWith( '--' ) ) {

				// Long option: --name or --name=value
				const cleanArg = arg.substring( 2 )
				const eqIndex  = cleanArg.indexOf( '=' )

				// --name=value
				if ( eqIndex > -1 )
					result[cleanArg.substring( 0, eqIndex )] = cleanArg.substring( eqIndex + 1 )
				else {

					// --name (boolean true unless the next arg is a value)
					if ( i + 1 < argv.length && !argv[i + 1].startsWith( '-' ) ) {

						// --name value
						result[cleanArg] = argv[i + 1]
						i++ // Consume the value

					}
					// --name (boolean flag)
					else result[cleanArg] = true

				}

			}
			else if ( arg.startsWith( '-' ) ) {

				// Short option(s): -f or -abc or -fvalue
				const cleanArg = arg.substring( 1 )

				if ( cleanArg.length === 1 ) {

					// Single short option: -f
					if ( i + 1 < argv.length && !argv[i + 1].startsWith( '-' ) ) {

						// -f value
						result[cleanArg] = argv[i + 1]
						i++ // Consume the value

					}
					// -f (boolean flag)
					else result[cleanArg] = true

				}
				else {

					// Combined short options: -abc or -f value
					if ( cleanArg.includes( '=' ) ) {

						// Example: -foo=bar (less common for single dash, but handled)
						const [ name, value ] = cleanArg.split( '=' )
						result[name]          = value

					}
					else {

						// -abc (treat as multiple boolean flags)
						for ( const char of cleanArg ) result[char] = true

					}

				}

			}
			// Positional argument
			else ( result._ as string[] ).push( arg )

			i++

		}

		return result

	}

}
