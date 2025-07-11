
import {
	EmptyObject,
	MergeIntersectingProps,
	Prettify,
	StringType,
	UnionToIntersection,
} from './types'

export type OptionType = 'string' | 'boolean' | 'choices' | 'object' | 'number' | 'array'
export type PositionalType = Exclude<OptionType, 'array'>
export type FlagType = OptionType

export const OPTION: Record<OptionType, OptionType> = {
	string  : 'string',
	boolean : 'boolean',
	choices : 'choices',
	object  : 'object',
	number  : 'number',
	array   : 'array',
}

const {
	array: _array,
	...POSITIONAL
} = OPTION

const FLAG: Record<FlagType, FlagType> = OPTION

export {
	POSITIONAL,
	FLAG,
}

///////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// ClippiumData //////////////////////////////////////////////
//
// NOTE: DONT USE PRETTIFY IN ClippiumData FOR BUILD CORRECT SCHEMA
//
///////////////////////////////////////////////////////////////////////////////////////////////////

type CommandSuper = {
	/** Description of the command/option */
	desc        : string
	/** Group to which the command/option belongs */
	group?      : string
	/** Set if the command/option is deprecated */
	deprecated? : boolean | string
	/** Set if the command/option is hidden */
	hidden?     : boolean
}

type OptionSuper = CommandSuper & {
	/** Alias of the option */
	alias?    : string[]
	/** Set if the command/option is required */
	required? : boolean
}
type SetOption<D> = OptionSuper & { default?: D }
type OptionMap = {
	string  : SetOption<StringType>
	boolean : SetOption<boolean>
	number  : SetOption<number>
	array   : SetOption<( string | number )[]>
	choices : SetOption<string | number> & { choices: ( string | number )[] }
	object  : SetOption<Record<string, unknown>>
}

type OptionValueMap = { [K in OptionType] : Required<OptionMap[K]>['default'] }

type Flag = { [K in FlagType] : OptionMap[K] & { type: K } }[keyof OptionMap]
type Flags = Record<string, Flag>

type PositionalMap = { [k in PositionalType]: Omit<OptionMap[k], 'alias'> }
type Positional = { [K in keyof PositionalMap] : PositionalMap[K] & { type: K } }[keyof PositionalMap]
type Positionals = Record<string, Positional>

type CommandOptions = {
	/** Examples of the command */
	examples?    : ( {
		/**
		 * Value of the example
		 *
		 * @example '$0 build --minify'
		 */
		value : string
		/** Description of the example */
		desc  : string
	} )[]
	/** flags of the command */
	flags?       : Flags
	/** Set commands */
	commands?    : Record<string, Command>
	/** positionals of the command */
	positionals? : Positionals
}
export type Command = CommandSuper & CommandOptions

export type ClippiumData = {
	/**
	 * Name of the CLI
	 */
	name?    : string
	/**
	 * Version of the CLI
	 */
	version? : string
	/**
	 * Description of the CLI
	 */
	desc?    : string
} & CommandOptions

///////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////// INFER //////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

type InferOption<T extends Flag> =
	T extends { choices: ( infer V )[] }
		? V
		: T extends { default: infer D }
			? D | OptionValueMap[T['type']]
			: T extends { required: infer B }
				? B extends true ? OptionValueMap[T['type']] : OptionValueMap[T['type']] | undefined
				: OptionValueMap[T['type']] | undefined

export type InferOptions<T extends Flags> = Prettify<{
	[K in keyof T]: InferOption<T[K]>
}>
type _GetValue<T extends ClippiumData, K extends keyof ClippiumData> =
	T[K] extends NonNullable<ClippiumData[K]>
		? T[K]
		// eslint-disable-next-line @typescript-eslint/no-empty-object-type
		: {}
export type GetValue<T extends ClippiumData, K extends keyof ClippiumData> =
	T['commands'] extends NonNullable<ClippiumData['commands']>
		? GetValue<T['commands'], K> & _GetValue<T, K>
		: _GetValue<T, K>

////////////////////////////////////////////// FLAGS //////////////////////////////////////////////

export type GetFlags<T extends ClippiumData> = GetValue<T, 'flags'>

export type InferFlag<T extends Flag> = InferOption<T>

type _InferedFlags<T extends ClippiumData> =
	T['flags'] extends Record<string, Flag>
		? InferOptions<T['flags']>
		: EmptyObject

export type InferFlags<T extends ClippiumData> =
	T['commands'] extends Record<string, ClippiumData>
		? MergeIntersectingProps<
			_InferedFlags<T>,
			UnionToIntersection<{
				[K in keyof T['commands']]: InferFlags<T['commands'][K]>
			}[keyof T['commands']]>
		>
		: _InferedFlags<T>

////////////////////////////////////////////// POSICIONALS /////////////////////////////////////////////

export type GetPositionals<T extends ClippiumData> = GetValue<T, 'positionals'>

export type InferPositional<T extends Positional> = InferOption<T>

type _InferedPositionals<T extends ClippiumData> =
	T['positionals'] extends Record<string, Positional>
		? InferOptions<T['positionals']>
		: EmptyObject

export type InferPositionals<T extends ClippiumData> =
	T['commands'] extends Record<string, ClippiumData>
		? MergeIntersectingProps<
			_InferedPositionals<T>,
			UnionToIntersection<{
				[K in keyof T['commands']]: _InferedPositionals<T['commands'][K]>
			}[keyof T['commands']]>
		>
		: _InferedPositionals<T>

////////////////////////////////////////////// COMMANDS /////////////////////////////////////////////

type _InferCommands<T extends ClippiumData> =
	T['commands'] extends Record<string, ClippiumData>
		? {
			[K in keyof T['commands']]:
				K | ( T['commands'][K] extends ClippiumData
					? _InferCommands<T['commands'][K]>
					: never )
		}[keyof T['commands']]
		: never

type InferCommandsArray<T extends ClippiumData> = _InferCommands<T> extends never ? StringType[] : ( _InferCommands<T> | StringType )[]
export type InferCommands<T extends ClippiumData> = Prettify<UnionToIntersection<
	InferCommandsArray<T> extends ( infer U )[]
		? U extends string
			? { [k in U]?: boolean }
			: { [k: string]: boolean }
		: { [k: string]: boolean }
>>
