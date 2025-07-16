/* eslint-disable jsdoc/check-tag-names */
/* eslint-disable @stylistic/object-curly-newline */

import type {
	ClippiumData,
	DataWithOptionMeta,
} from '../_shared/data'
import type { Finder }  from '../_shared/finder'
import type {
	Any,
	StripIndexSignature,
} from '../_shared/types'
import type { Parsed } from '../parser'

type ParsedValue = string | number | boolean
type WithValidation<T extends ClippiumData> = DataWithOptionMeta<T, {
	/**
	 *
	 * validate/transform the option value
	 *
	 * @param   {ParsedValue} v - Value
	 * @returns {ParsedValue}   - Transformed value
	 * @experimental
	 */
	transform? : ( value: ParsedValue ) => ParsedValue
}>

type Positional = NonNullable<WithValidation<ClippiumData>['positionals']>[number]
type Flag = NonNullable<WithValidation<ClippiumData>['flags']>[number]
type Command = NonNullable<WithValidation<ClippiumData>['commands']>[number]

export type ParsedStrict<T extends ClippiumData> = StripIndexSignature<Parsed<T>>
export type ParsedWithValidation<T extends ClippiumData> = Omit<ParsedStrict<T>, 'raw'>
type ValidateString = {
	flagRequired       : ( opts: {
		value? : string
		key    : string
		data   : Flag
	} ) => string
	positionalRequired : ( opts:{
		value? : string
		key    : string
		data   : Positional
	} ) => string
	flagInvalidType: ( opts:{
		value? : ParsedValue
		key    : string
		data   : Flag
	} ) => string
	positionalInvalidType: ( opts:{
		value? : ParsedValue
		key    : string
		data   : Positional
	} ) => string
	flagNotExists:( opts: {
		value? : string
		key    : string
		data   : Command
	} ) => string
	positionalNotExists : ( opts:{
		value? : string
		key    : string
		data   : Command
	} ) => string
	commandNotExists : ( opts:{
		value?   : string
		parents? : string[]
		data     : Command
	} ) => string
}

const separator                   = ', '
const newLine                     = '\n\n'
const getFlagString               = ( key: string, flag?: Flag ) => `--${key + ( flag?.alias ? `, ${flag.alias.map( v => `-${v}` ).join( '|' )}` : '' )}`
const getPositionalString         = ( key: string, _data?: Positional ) => `<${key}>`
const getChoicesString            = ( flag: Flag ) => flag.type === 'choices' && flag.choices ? ` (${flag.choices.join( ', ' )})` : ''
const getCommandFlagsString       = ( data: Command ) => data.flags ? `${newLine}Valid flags: ${Object.keys( data.flags ).map( v => getFlagString( v, data.flags?.[v] ) ).join( separator )}` : ''
const getCommandsString           = ( data: Command ) => data.commands ? `${newLine}Valid commands: ${Object.keys( data.commands ).join( separator )}` : ''
const getCommandPositionalsString = ( data: Command ) => data.positionals ? `${newLine}Valid positionals: ${Object.keys( data.positionals ).map( v => getPositionalString( v, data.positionals?.[v] ) ).join( separator )}` : ''
const getTypeString               = ( data: Flag ) => data.type + getChoicesString( data )

const formatInvalidType = ( {
	label,
	key,
	value,
	expected,
}: {
	label    : string
	key      : string
	value    : unknown
	expected : string
} ) =>
	`Invalid input for ${key} ${label}.`
	+ newLine
	+ `Received      -> ${value}\n`
	+ `Expected type -> ${expected}`

const strings: ValidateString = {
	flagRequired : opts =>
		`The flag "${getFlagString( opts.key, opts.data )}" is required and must be: ${getTypeString( opts.data )}`,
	positionalRequired : opts =>
		`The positional ${getPositionalString( opts.key )} is required and must be: ${getTypeString( opts.data )}`,
	positionalInvalidType : opts =>
		formatInvalidType( {
			label    : 'positional',
			key      : getPositionalString( opts.key ),
			value    : opts.value,
			expected : getTypeString( opts.data ),
		} ),
	flagInvalidType : opts =>
		formatInvalidType( {
			label    : 'flag',
			key      : getFlagString( opts.key, opts.data ),
			value    : opts.value,
			expected : getTypeString( opts.data ),
		} ),
	commandNotExists : opts =>
		( opts.value ? `The "${opts.value}" command does not exist` : 'The command does not exist' ) + ( opts.parents ? ` for: ${opts.parents.join( ' ' )}` : '.' ) + getCommandsString( opts.data ),
	flagNotExists : opts =>
		( opts.value ? `The flag "${getFlagString( opts.value )}" does not exist.` : 'The flag does not exist.' ) + getCommandFlagsString( opts.data ),
	positionalNotExists : opts =>
		( opts.value ? `The Positional "${getFlagString( opts.value )}" does not exist.` : 'The Positional does not exist.' ) + getCommandPositionalsString( opts.data ),
}

const splitRespectingQuotes = ( value: string ): string[] => {

	const result: string[] = []
	let current            = '',
		insideQuotes       = false,
		quoteChar          = '',
		i                  = 0

	while ( i < value.length ) {

		const char = value[i]

		if ( ( char === '"' || char === '\'' ) ) {

			if ( !insideQuotes ) {

				insideQuotes = true
				quoteChar    = char

			}
			else if ( char === quoteChar ) {

				insideQuotes = false
				quoteChar    = ''

			}
			else {

				current += char

			}

		}
		else if ( char === ',' && !insideQuotes ) {

			result.push( current.trim() )
			current = ''

		}
		else {

			current += char

		}
		i++

	}
	if ( current ) result.push( current.trim() )
	return result.map( v => {

		if (
			( v.startsWith( '"' ) && v.endsWith( '"' ) )
			|| ( v.startsWith( '\'' ) && v.endsWith( '\'' ) )
		) {

			return v.slice( 1, -1 )

		}
		return v

	} )

}
const getAfterSequence = <T>( arr: T[], sequence: T[] ): T[] => {

	for ( let i = 0; i <= arr.length - sequence.length; i++ ) {

		const match = sequence.every( ( val, j ) => arr[i + j] === val )
		if ( match ) {

			return arr.slice( i + sequence.length )

		}

	}
	return []

}

export type ValidateOptions<T extends ClippiumData> = {
	parsedData : Parsed<T>
	data       : WithValidation<T> | T
	Finder     : typeof Finder
}

export type ValidateSettings = { strings?: Partial<ValidateString> }

export class Validate<T extends ClippiumData> {

	#data
	#parsed
	#find

	settings : Required<Omit<ValidateSettings, 'strings'>> & { strings: ValidateString }

	constructor( opts: ValidateOptions<T>, settings: ValidateSettings = {} ) {

		this.#data   = opts.data
		this.#parsed = opts.parsedData
		this.#find   = new opts.Finder( this.#data )

		this.settings = {
			...settings,
			strings : {
				...strings,
				...settings.strings,
			},
		}

	}

	#transformValue<Type extends 'positional' | 'flag'>( {
		value, data, key, type,
	}:{
		value : ParsedValue
		data  : Type extends 'positional' ? Positional : Flag
		type  : Type
		key   : string
	} ): Any {

		const getString = ( value: ParsedValue ) => {

			if ( typeof value === 'boolean' ) return value ? 'true' : 'false'
			return value

		}
		const getNumber = ( value: ParsedValue ) => {

			if ( typeof value === 'boolean' ) throw new Error( )
			const num = Number( value )
			if ( isNaN( num ) ) throw new Error( )
			return num

		}
		const getBoolean = ( value: ParsedValue ) => {

			const str = String( value ).toLowerCase()

			if ( str === 'true' || str === '1' ) return true
			if ( str === 'false' || str === '0' ) return false
			throw new Error( )

		}

		const getStringOrNumberOrBoolean = ( value: ParsedValue ) => {

			try {

				return getNumber( value )

			}
			catch ( _ ) {

				try {

					return getString( value )

				}
				catch ( _ ) {

					// must be the last
					return getBoolean( value )

				}

			}

		}

		const getObject = ( value: ParsedValue ) => {

			if ( typeof value !== 'string' )
				throw new Error( `Expected string for object type, got ${typeof value}` )

			try {

				const parsed = JSON.parse( value )
				if (
					typeof parsed === 'object'
					&& parsed !== null
					&& !Array.isArray( parsed )
				) {

					return parsed

				}
				throw new Error()

			}
			catch {

				throw new Error( `Invalid JSON object: "${value}"` )

			}

		}

		try {

			if ( data.type === 'string' ) return getString( value )
			else if ( data.type === 'number' ) return getNumber( value )
			else if ( data.type === 'boolean' ) return getBoolean( value )
			else if ( data.type === 'object' ) return getObject( value )
			else if ( data.type === 'array' ) {

				if ( typeof value !== 'string' )
					throw new Error( `Expected string for array type, got ${typeof value}` )

				try {

					const parsed = splitRespectingQuotes( value )

					if ( Array.isArray( parsed ) ) return parsed.map( v => getStringOrNumberOrBoolean( v ) )
					throw new Error()

				}
				catch {

					throw new Error( `Invalid JSON array: "${value}"` )

				}

			}
			else if ( data.type === 'choices' ) {

				const parsedValue = getStringOrNumberOrBoolean( value )
				const found       = data.choices.find( v => v === parsedValue )
				if ( found ) return parsedValue
				throw new Error( `Invalid choice: "${value}"` )

			}

		}
		catch ( _ ) {

			throw new Error( this.settings.strings[type === 'positional' ? 'positionalInvalidType' : 'flagInvalidType']( {
				value,
				key,
				data : data as Any,
			} ) )

		}
		throw new Error( `Unsupported type: "${type}"` )

	}

	#setFlags( data: Command ): Parsed<T>['flags'] {

		const res: Parsed<T>['flags'] = this.#parsed.flags
		const flags                   = data.flags ?? {}
		const allowedFlags            = Object.entries( flags ).map( ( [ key, value ] ) => [ key ].concat( value.alias ?? [] ) ).flat()

		for ( const key of Object.keys( this.#parsed.flags ) ) {

			if ( !allowedFlags.includes( key ) )
				throw new Error( this.settings.strings.flagNotExists( {
					data  : data,
					key,
					value : key,
				} ) )

		}

		for ( const key in flags ) {

			const meta = flags[key]
			let value  = this.#parsed.flags[key]

			if ( meta.required && value === undefined && meta.default === undefined )
				throw new Error( this.settings.strings.flagRequired( {
					value,
					key,
					data : meta,
				} ) )
			else if ( value === undefined && meta.default )
				value = meta.default

			if ( value === undefined ) continue

			value = this.#transformValue( {
				value,
				data : meta,
				key,
				type : 'flag',
			} )
			if ( meta?.transform ) value = meta.transform( value )

			res[key as keyof typeof res] = value

			if ( meta.alias )
				for ( const alias of meta.alias )res[alias as keyof typeof res] = value

		}
		return res

	}

	#setPositionals( data: Command ): Parsed<T>['positionals'] {

		const res: Parsed<T>['positionals'] = this.#parsed.positionals
		const positionals                   = data.positionals ?? {}

		for ( const key in positionals ) {

			const meta = positionals[key]

			let value = res[key]

			if ( meta.required && value === undefined && meta.default === undefined )
				throw new Error( this.settings.strings.positionalRequired( {
					value,
					key,
					data : meta,
				} ) )
			else if ( value === undefined && meta.default !== undefined )
				value = meta.default

			if ( value === undefined ) continue

			value = this.#transformValue( {
				value,
				data : meta,
				key,
				type : 'positional',
			} )
			if ( meta?.transform ) value = meta.transform( value )

			res[key as keyof typeof res] = value

		}
		return res

	}

	run( ): ParsedWithValidation<T> {

		const {
			positionals, flags,
		} = this.#data

		const cmd = this.#find.nearCommand( { keys: this.#parsed.raw._ } )

		if ( !cmd && this.#parsed.raw._.length && this.#data.commands ) throw new Error( this.settings.strings.commandNotExists( {
			value : this.#parsed.raw._[0],
			data  : this.#data as Command,
		} ) )
		else if ( cmd && cmd.value.commands && !cmd.value.positionals ) {

			const commandsSecuence = ( cmd.parents ?? [] ).concat( cmd.key )
			const values           = getAfterSequence( this.#parsed.raw._, commandsSecuence )
			for ( const k of values ) {

				const command = cmd.value.commands || {}
				if ( k in command ) continue
				throw new Error( this.settings.strings.commandNotExists( {
					value   : k,
					parents : commandsSecuence,
					data    : cmd.value,
				} ) )

			}

		}

		const valid: Command = {
			...this.#data as Command,
			...cmd?.value || {},
			positionals : {
				...positionals,
				...cmd?.value.positionals || {},
			},
			flags : {
				...flags,
				...cmd?.value.flags || {},
			},
		}

		return {
			commands    : this.#parsed.commands,
			flags       : this.#setFlags( valid ),
			positionals : this.#setPositionals( valid ),
		}

	}

}

/**
 * Return the same data, but with validation enabled.
 *
 * @template C Must extend from ClippiumData
 * @param   {C} data - Clippium data
 * @returns {C}      - The same data, but with validation enabled
 * @example import { withValidation, validate, parse } from 'clippium'
 *
 * const cli = new Clippium( withValidation( data ) )
 *
 * cli.fn = async data => {
 *     const {flags} = validate( data );
 *     if(flags.help) return console.log( data.utils.getHelp() )
 * }
 * export default cli
 */
export const withValidation = <C extends WithValidation<ClippiumData> | ClippiumData>( data: C ) =>
	data

