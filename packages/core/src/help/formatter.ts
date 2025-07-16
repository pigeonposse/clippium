import {
	ClippiumData,
	FLAG,
} from '../_shared/data'

const defaultStrings = {
	flagsTitle       : 'Flags:',
	commandsTitle    : 'Commands:',
	command          : '<command>',
	flags            : '[...flags]',
	positionalsTitle : 'Positionals:',
	examplesTitle    : 'Examples:',
	required         : '(required)',
	default          : '[default: {value}]',
	deprecated       : '[deprecated]',
	deprecatedReason : '[deprecated: {value}]',
	choices          : '[choices: {values}]',
	group            : '[group: {value}]',
	usage            : 'Usage:',
	more             : 'More information:',
}

type HelpFormatterStrings = typeof defaultStrings

export type HelpFormatterConfig = {

	separator? : string
	/**
	 * Indent for sections
	 */
	indent?    : string
	/**
	 * Strings to use
	 *
	 * @example
	 * {
	 *   flagsTitle       : 'Flags:',
	 *   commandsTitle    : 'Commands:',
	 * }
	 */
	strings?   : Partial<HelpFormatterStrings>
}

type Flags = NonNullable<ClippiumData['flags']>

const DEFAULT_NAME = '$0'

export class HelpFormatter {

	settings : Required<Omit<HelpFormatterConfig, 'strings'>> & { strings: HelpFormatterStrings }

	constructor( settings: HelpFormatterConfig = {} ) {

		this.settings = {
			indent    : '  ',
			separator : '    ',
			...settings,
			strings   : {
				...defaultStrings,
				...settings.strings,
			},
		}

	}

	setInfo = ( {
		name, version, desc,
	}: ClippiumData ) => {

		return `${name ? `${name} ` : ''}${version ? `(${version})` : ''}${desc ? `\n\n${desc}` : ''}`.trim()

	}

	setMore = ( data: ClippiumData ) => {

		const { more } = data
		if ( !more ) return ''
		return [
			this.setTitle( this.settings.strings.more ),
			more
				.split( '\n' )
				.map( line => `${this.settings.indent}${line}`.trimEnd() )
				.join( '\n' ),
		].join( '\n' )

	}

	setUsage = ( data: ClippiumData ) => {

		const {
			name,
			positionals = {},
			commands = {},
			flags = {},
		} = data

		const positionalKeys = Object.keys( positionals )
		const commandKeys    = Object.keys( commands )
		const flagKeys       = Object.keys( flags )

		const positionalUsage = positionalKeys
			.map( key => `<${key}>` )
			.join( ' ' )

		const commandUsage = commandKeys.length ? this.settings.strings.command : ''
		const FlagsUsage   = flagKeys.length ? this.settings.strings.flags : ''

		const usageLine = [
			name,
			commandUsage,
			positionalUsage,
			FlagsUsage,
		]
			.filter( Boolean )
			.join( ' ' )
			.replace( /\s+/g, ' ' )

		return `${this.settings.strings.usage} ${usageLine}`

	}

	setOptionValue = ( key:keyof Flags, alias?: string[] ) => {

		const aliases = alias?.map( a => `-${a}` ).join( ', ' )
		return `${aliases ? `${aliases}, ` : ''}--${key}`

	}

	setDeprecatedBadge = ( value: Flags[number]['deprecated'] ) => {

		const {
			deprecated: deprecatedTemplate,
			deprecatedReason: deprecatedReasonTemplate,
		} = this.settings.strings

		return value
			? typeof value === 'string' ? deprecatedReasonTemplate.replace( '{value}', JSON.stringify( value ) ) : deprecatedTemplate
			: undefined

	}

	setDefaultBadge = ( value: Flags[number]['default'] ) => {

		const { default: defaultTemplate } = this.settings.strings
		return value !== undefined ? defaultTemplate.replace( '{value}', JSON.stringify( value ) ) : undefined

	}

	setChoicesBadge = ( value: ( string | number )[] ) => {

		const { choices } = this.settings.strings
		return value ? choices.replace( '{values}', value.join( ', ' ) ) : undefined

	}

	setRequiredBadge = ( value: Flags[number]['required'] ) => {

		const { required } = this.settings.strings
		return value ? required : undefined

	}

	#formatOption( key: string, option: Flags[number] ) {

		const props = [
			this.setDeprecatedBadge( option.deprecated ),
			this.setRequiredBadge( option.required ),
			this.setDefaultBadge( option.default ),
			option.type === FLAG.choices && 'choices' in option ? this.setChoicesBadge( option.choices ) : undefined,
		]
			.filter( Boolean )
			.join( ' ' )
			.trim()

		return {
			value : this.setOptionValue( key, option.alias ),
			desc  : option.desc,
			props,
			group : option.group,
		}

	}

	#setRow( value: string, desc: string, extra?: string ) {

		return `${this.settings.indent}${value}${this.settings.separator}${desc}${extra ? `${this.settings.separator}${extra}` : ''}`

	}

	setFlags = ( { flags = {} }:ClippiumData ): string => {

		if ( !Object.keys( flags ).length ) return ''

		const opts       = Object.entries( flags )
			.map( ( [ key, opt ] ) => opt.hidden ? undefined : this.#formatOption( key, opt ) )
			.filter( v => v !== undefined )
		const maxVLength = Math.max( ...opts.map( ( { value: v } ) => v.length ) )

		const maxDLength = Math.max( ...opts.map( ( { desc: d } ) => d.length ) )
		const rendered   = opts.map( ( {
			value: v, desc: d, props: o, group,
		} ) =>
			( {
				group : group || 'default',
				value : this.#setRow( v.padEnd( maxVLength, ' ' ), !o ? d : d.padEnd( maxDLength, ' ' ), o ),
			} ),
		)

		const grouped = Object.groupBy( rendered, ( { group } ) => group ) as Record<string, typeof rendered>

		const res = Object.entries( grouped )
			.sort( ( [ a ], [ b ] ) => {

				const getPriority = ( group: string ) => {

					if ( group === 'default' ) return -1
					if ( group === 'global' ) return 1
					return 0

				}
				return getPriority( a ) - getPriority( b )

			} )
			.flatMap( ( [ group, entries ] ) =>
				[
					this.setTitle(
						group === 'default' ? this.settings.strings.flagsTitle : group ),
					...entries.map( ( { value } ) => value ),
				],
			)
		return res.join( '\n' )

	}

	setTitle = ( title: string ): string => {

		return `\n${title}\n`

	}

	setExamples = ( {
		examples = [], name = DEFAULT_NAME,
	}: ClippiumData ): string => {

		if ( !examples.length ) return ''

		const examplesR = examples.map( ( {
			value, desc,
		} ) => ( {
			value : value.replace( DEFAULT_NAME, name ),
			desc,
		} ) )
		const maxLength = Math.max( ...examplesR.map( k => k.value.length ) )
		const rendered  = examplesR.map( e =>
			this.#setRow( e.value.padEnd( maxLength, ' ' ), e.desc ),
		)
		return [ this.setTitle( this.settings.strings.examplesTitle ), ...rendered ].join( '\n' )

	}

	setCommands = ( { commands = {} }: ClippiumData ): string => {

		if ( !Object.keys( commands ).length ) return ''
		const maxLength = Math.max( ...Object.keys( commands ).map( k => k.length ) )
		const rendered  = Object.entries( commands ).map( ( [ name, cmd ] ) =>
			cmd.hidden ? undefined : this.#setRow( name.padEnd( maxLength, ' ' ), cmd.desc ),
		).filter( Boolean )
		return [ this.setTitle( this.settings.strings.commandsTitle ), ...rendered ].join( '\n' )

	}

	setPositionals = ( { positionals = {} }: ClippiumData ): string => {

		if ( !Object.keys( positionals ).length ) return ''
		const maxLength = Math.max( ...Object.keys( positionals ).map( k => k.length ) )
		const rendered  = Object.entries( positionals ).map( ( [ name, cmd ] ) =>
			cmd.hidden ? undefined : this.#setRow( name.padEnd( maxLength, ' ' ), cmd.desc ),
		).filter( Boolean )
		return [ this.setTitle( this.settings.strings.positionalsTitle ), ...rendered ].join( '\n' )

	}

	/**
	 * Return a string with the formatted help message.
	 *
	 * @param   {ClippiumData} data - {ClippiumData} The data to format.
	 * @returns {string}            The formatted help message.
	 */
	setAll = ( data: ClippiumData ) => {

		const lines: string[] = []
		data.name             = data.name || '$0'

		const info = this.setInfo( data )
		if ( info.trim() !== '' ) lines.push( info + '\n' )

		lines.push( this.setUsage( data ) )
		lines.push( this.setPositionals( data ) )
		lines.push( this.setCommands( data ) )
		lines.push( this.setFlags( data ) )
		lines.push( this.setExamples( data ) )
		lines.push( this.setMore( data ) )

		return lines.filter( Boolean ).join( '\n' )

	}

}
