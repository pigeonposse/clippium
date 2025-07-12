import { createPlugin } from '../plugin'

import type { ClippiumData } from 'clippium'

type Flags = NonNullable<ClippiumData['flags']>
type Commands = NonNullable<ClippiumData['commands']>

type DocsConfig = { heading?: 1 | 2 | 3 | 4 | 5 | 6 }

export class Markdown {

	#renderFlags( flags: Flags ): string[] {

		const lines: string[] = []
		for ( const [ flag, info ] of Object.entries( flags ?? {} ) ) {

			lines.push( `- **\`${flag}\`** (${info.type})${info.required ? ' _(required)_' : ''}: ${info.desc ?? ''}` )
			if ( info.type === 'choices' && info.choices && info.choices.length )
				lines.push( `  - Possible values: ${info.choices.map( c => `\`${c}\`` ).join( ', ' )}` )
			if ( info.default !== undefined )
				lines.push( `  - Default: \`${info.default}\`` )

		}
		return lines

	}

	#renderCommands( commands: Commands, level = 2 ): string[] {

		const lines: string[] = []
		for ( const [ cmd, cmdInfo ] of Object.entries( commands ?? {} ) ) {

			lines.push( `\n${'#'.repeat( level )} ${cmd}\n` )
			if ( typeof cmdInfo === 'object' && cmdInfo !== null ) {

				if ( 'desc' in cmdInfo && cmdInfo.desc )
					lines.push( `${cmdInfo.desc}\n` )
				if ( 'flags' in cmdInfo && cmdInfo.flags ) {

					lines.push( `${'#'.repeat( level + 1 )} Options (${cmd})\n` )
					lines.push( ...this.#renderFlags( cmdInfo.flags ) )

				}
				if ( 'commands' in cmdInfo && cmdInfo.commands ) {

					lines.push( `${'#'.repeat( level + 1 )} Subcommands (${cmd})\n` )
					lines.push( ...this.#renderCommands( cmdInfo.commands, level + 1 ) )

				}

			}

		}
		return lines

	}

	/**
	 * Retrieves and processes documentation data from the given ClippiumData input.
	 *
	 * @param   {ClippiumData}    input - The ClippiumData object that contains the documentation data.
	 * @param   {DocsConfig}      opts  - Optional configuration for the documentation.
	 * @returns {Promise<string>}       A promise that resolves to a string representing the processed documentation.
	 */
	async getDocs( input: ClippiumData, opts?: DocsConfig ) {

		const lines: string[] = []
		const level           = opts?.heading ?? 1
		lines.push( `${'#'.repeat( level )} ${input.name || 'CLI'} documentation\n` )
		if ( input.desc ) lines.push( `${input.desc}\n` )

		if ( input.flags && Object.keys( input.flags ).length > 0 ) {

			lines.push( `\n${'#'.repeat( level + 1 )} Options\n` )
			lines.push( ...this.#renderFlags( input.flags ) )

		}

		if ( input.commands && Object.keys( input.commands ).length > 0 ) {

			lines.push( `\n${'#'.repeat( level + 1 )} Commands\n` )
			lines.push( ...this.#renderCommands( input.commands, level + 2 ) )

		}

		return lines.join( '\n' )

	}

}

export const markdownDocsPlugin = createPlugin( { docs : {
	flags : { heading : {
		type    : 'choices',
		desc    : 'Heading level',
		default : 1,
		choices : [
			1,
			2,
			3,
			4,
			5,
			6,
		] as const,
	} },
	fn : async ( {
		input, flags,
	} ) => {

		return await new Markdown().getDocs( input, { heading: flags.heading } )

	},
} } )
