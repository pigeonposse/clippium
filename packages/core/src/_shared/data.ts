
////////////////////////////////////////////////

import {
	EmptyObject,
	MergeIntersectingProps,
	ObjectValues,
	Prettify,
	StringType,
	UnionToIntersection,
} from './types'

export const FLAG = {
	string  : 'string',
	boolean : 'boolean',
	choices : 'choices',
	object  : 'object',
	number  : 'number',
	array   : 'array',
} as const

export type FlagType = ObjectValues<typeof FLAG>

////////////////////////////////////////////////

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

type FlagSuper = CommandSuper & {
	/** Alias of the option */
	alias?    : string[]
	required? : boolean
}

type OptionMap = {
	string  : FlagSuper & { default?: StringType }
	boolean : FlagSuper & { default?: boolean }
	number  : FlagSuper & { default?: number }
	array   : FlagSuper & { default?: ( string | number )[] }
	choices : FlagSuper & {
		choices  : ( string | number )[]
		default? : string | number
	}
	object : FlagSuper & { default?: object }
}
type PosicionalMap = { [k in FlagType]: Omit<OptionMap[k], 'alias'> }

type OptionValueMap = { [K in FlagType] : Required<OptionMap[K]>['default'] }

type Option = Prettify<{ [K in FlagType] : OptionMap[K] & { type: K } }[keyof OptionMap]>

type Options = Record<string, Option>
type Posicional = Prettify<{ [K in FlagType] : PosicionalMap[K] & { type: K } }[keyof PosicionalMap]>

type CommandOptions = {
	desc?     : string
	examples?    : ( {
		value : string
		desc  : string
	} )[]
	flags?       : Record<string, Option>
	commands?    : Record<string, Command>
	positionals? : Record<string, Posicional>
}
export type Command = CommandSuper & CommandOptions

export type ClippiumData = {
	name?    : string
	version? : string
} & CommandOptions

///////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////// INFER //////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

type InferOption<T extends Option> =
	T extends { choices: ( infer V )[] }
		? V
		: T extends { default: infer D }
			? D | OptionValueMap[T['type']]
			: T extends { required: infer B }
				? B extends true ? OptionValueMap[T['type']] : OptionValueMap[T['type']] | undefined
				: OptionValueMap[T['type']] | undefined

export type InferOptions<T extends Options> = Prettify<{
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

export type InferFlag<T extends Option> = InferOption<T>

type _InferedFlags<T extends ClippiumData> =
	T['flags'] extends Record<string, Option>
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

export type InferPosicional<T extends Posicional> = InferOption<T>

type _InferedPositionals<T extends ClippiumData> =
	T['positionals'] extends Record<string, Option>
		? InferOptions<T['positionals']>
		: EmptyObject

export type InferPosicionals<T extends ClippiumData> =
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
