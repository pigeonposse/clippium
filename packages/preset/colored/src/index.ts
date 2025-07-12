
import type {
	ClippiumConfig,
	ClippiumData,
} from 'clippium'

const DEFAULT_NAME = '$0'

// const COLORS_DEFAULT = {
// 	title         : color.cyan.inverse.bold,
// 	bin           : color.cyan,
// 	version       : color.cyan.dim.italic,
// 	name          : color.bold,
// 	positionals   : color.green.dim,
// 	commands      : color.green,
// 	flags         : color.yellow,
// 	desc          : color.white.dim,
// 	examples      : color.cyan,
// 	sectionTitle  : color.white.bold.underline,
// 	sectionDesc   : color.white.dim,
// 	sectionsProps : color.white.dim.italic,
// } satisfies { [ key in string ]: ColorFn }

const COLORS_DEFAULT = {
	title         : v => v,
	bin           : v => v,
	version       : v => v,
	name          : v => v,
	positionals   : v => v,
	commands      : v => v,
	flags         : v => v,
	desc          : v => v,
	examples      : v => v,
	sectionTitle  : v => v,
	sectionDesc   : v => v,
	sectionsProps : v => v,
} satisfies { [ key in string ]: ColorFn }

type Formatter = NonNullable<NonNullable<ClippiumConfig['help']>['formatter']>
type Flags = NonNullable<ClippiumData['flags']>
type ColorFn = ( value: string ) => string
type Config = { [ key in keyof typeof COLORS_DEFAULT ]?: ColorFn }

/**
 * Formatter function that generates a formatted help output for a CLIPPIUM application.
 * It accepts an configuration for custom color functions to apply to the output.
 *
 * @param   {Config} opts - Optional configuration object to override default color functions.
 * @returns {string}      A function that generates a formatted help output for a CLIPPIUM application.
 * @example
 * import { Clippium } from 'clippium'
 * import color from '@clippium/color'
 * import { formatter } from '@clippium/preset-colored'
 *
 * const cli = new Clippium({ }, help: { formatter: formatter({
 * 	commands: color.cyan
 * }) } )
 */

export const formatter = ( opts?: Config ): Formatter => ( {
	data, utils,
} ) => {

	const COLORS         = {
		...COLORS_DEFAULT,
		...opts || {},
	}
	const setOptionValue = utils.setOptionValue
	utils.setOptionValue = ( ...opts ) => COLORS.flags( setOptionValue( ...opts ) )
	const setTitle       = utils.setTitle
	utils.setTitle       = value => setTitle( COLORS.sectionTitle( value ) )

	const _formatOption = ( key: string, option: Flags[number] ) => {

		const props = [
			utils.setDeprecatedBadge( option.deprecated ),
			utils.setRequiredBadge( option.required ),
			utils.setDefaultBadge( option.default ),
			option.type === 'choices' && 'choices' in option ? utils.setChoicesBadge( option.choices ) : undefined,
		]
			.filter( Boolean )
			.join( ' ' )
			.trim()

		return {
			value : utils.setOptionValue( key, option.alias ),
			desc  : option.desc,
			props,
			group : option.group,
		}

	}

	const _setRow = ( value: string, desc: string, extra?: string ) => {

		return `${utils.settings.indent}${value}${utils.settings.separator}${COLORS.sectionDesc( desc )}${extra ? `${utils.settings.separator}${COLORS.sectionsProps( extra )}` : ''}`

	}

	utils.setInfo = ( {
		name, version, desc,
	} ) => {

		if ( !name ) name = DEFAULT_NAME
		const [ nameV, ...commands ] = name.split( ' ' )
		const cmds                   = commands?.map( c => COLORS.commands( c ) ).join( ' ' )
		const nameColored            = [ COLORS.title( ` ${nameV} ` ), cmds ].filter( Boolean ).join( ' ' )
		return `\n${nameColored} ${version ? COLORS.version( `(${version})` ) : ''}${desc ? `\n\n${COLORS.desc( desc )}` : ''}`.trimEnd()

	}

	utils.setUsage = data => {

		const {
			name = DEFAULT_NAME,
			positionals = {},
			commands = {},
			flags = {},
		} = data

		const positionalKeys = Object.keys( positionals )
		const commandKeys    = Object.keys( commands )
		const flagKeys       = Object.keys( flags )

		const positionalUsage = positionalKeys
			.map( key => COLORS.positionals( `<${key}>` ) )
			.join( ' ' )

		const commandUsage       = commandKeys.length ? COLORS.commands( utils.settings.strings.command ) : ''
		const FlagsUsage         = flagKeys.length ? COLORS.flags( utils.settings.strings.flags ) : ''
		const [ first, ...rest ] = name.split( ' ' )
		const nameColored        = COLORS.bin( first ) + ' ' + rest.map( n => COLORS.commands( n ) ).join( ' ' )
		const usageLine          = [
			nameColored,
			commandUsage,
			positionalUsage,
			FlagsUsage,
		]
			.filter( Boolean )
			.join( ' ' )
			.replace( /\s+/g, ' ' )

		return `\n${COLORS.sectionTitle( utils.settings.strings.usage )} ${usageLine}`

	}
	utils.setPositionals = ( { positionals = {} } ) => {

		const posts = Object.entries( positionals )
		if ( !posts.length ) return ''
		const postsMapped = posts.map( ( [ k, v ] ) => ( [ `<${k}>`, v ] ) ) as typeof posts
		const maxLength   = Math.max( ...postsMapped.map( ( [ k ] ) => k.length ) )
		const rendered    = postsMapped.map( ( [ name, v ] ) =>
			v.hidden ? undefined : _setRow( COLORS.positionals( name.padEnd( maxLength, ' ' ) ), v.desc ),
		).filter( Boolean )
		return [ utils.setTitle( utils.settings.strings.positionalsTitle ), ...rendered ].join( '\n' )

	}
	utils.setFlags = ( { flags = {} } ) => {

		if ( !Object.keys( flags ).length ) return ''

		const opts       = Object.entries( flags )
			.map( ( [ key, opt ] ) => opt.hidden ? undefined : _formatOption( key, opt ) )
			.filter( v => v !== undefined )
		const maxVLength = Math.max( ...opts.map( ( { value: v } ) => v.length ) )

		const maxDLength = Math.max( ...opts.map( ( { desc: d } ) => d.length ) )
		const rendered   = opts.map( ( {
			value: v, desc: d, props: o, group,
		} ) =>
			( {
				group : group || 'default',
				value : _setRow( v.padEnd( maxVLength, ' ' ), !o ? d : d.padEnd( maxDLength, ' ' ), o ),
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
					utils.setTitle(
						group === 'default' ? utils.settings.strings.flagsTitle : group ),
					...entries.map( ( { value } ) => value ),
				],
			)
		return res.join( '\n' )

	}
	utils.setExamples = ( {
		examples = [], name,
	} ) => {

		if ( !examples.length ) return ''

		const examplesR = examples.map( ( {
			value, desc,
		} ) => ( {
			value : name ? value.replace( DEFAULT_NAME, name ) : value,
			desc,
		} ) )
		const maxLength = Math.max( ...examplesR.map( k => k.value.length ) )
		const rendered  = examplesR.map( e =>
			_setRow( COLORS.examples( e.value.padEnd( maxLength, ' ' ) ), e.desc ),
		)
		return [ utils.setTitle( utils.settings.strings.examplesTitle ), ...rendered ].join( '\n' )

	}
	utils.setCommands = ( { commands = {} } ) => {

		if ( !Object.keys( commands ).length ) return ''
		const maxLength = Math.max( ...Object.keys( commands ).map( k => k.length ) )
		const rendered  = Object.entries( commands ).map( ( [ name, cmd ] ) =>
			cmd.hidden ? undefined : _setRow( COLORS.commands( name.padEnd( maxLength, ' ' ) ), cmd.desc ),
		).filter( Boolean )

		return [ utils.setTitle( utils.settings.strings.commandsTitle ), ...rendered ].join( '\n' )

	}

	const lines: string[] = []
	data.name             = data.name || '$0'

	const info = utils.setInfo( data )
	if ( info.trim() !== '' ) lines.push( info )

	lines.push( utils.setUsage( data ) )
	lines.push( utils.setPositionals( data ) )
	lines.push( utils.setCommands( data ) )
	lines.push( utils.setFlags( data ) )
	lines.push( utils.setExamples( data ) )

	return lines.filter( Boolean ).join( '\n' )

}
