import type {
	Any,
	Prettify,
	Satisfies,
} from './_shared/_super'
import type {
	Clippium,
	ClippiumData,
	InferFlag,
	InferPositional,
} from 'clippium'

export type ClippiumParsedArgv<C extends ClippiumData> = Omit<ClippiumFnParameters<C>, 'utils'>
export type ClippiumFnParameters<C extends ClippiumData> = Parameters<Clippium<C>['fn']>[0]

export type ConfigFileData = {
	commands?     : { [key: string]: ConfigFileData }
	positionals?  : { [key: string]: Any }
	flags?        : { [key: string]: Any }
	[key: string] : Any
}

type _InferConfigFileData<T extends ClippiumData> = {

	commands?: T extends { commands: infer U }
		? Prettify<{ [K in keyof U]?: U[K] extends ClippiumData ? Prettify<_InferConfigFileData<U[K]>> : never }>
		: never

	positionals?: T extends { positionals: infer P }
		? Prettify<{ [K in keyof P]?: P[K] extends NonNullable<ClippiumData['positionals']>[string] ? InferPositional<P[K]> : never }>
		: never

	flags?: T extends { flags: infer F }
		? Prettify<{ [K in keyof F]?: F[K] extends NonNullable<ClippiumData['flags']>[string] ? InferFlag<F[K]> : never }>
		: never
	[key: string] : Any
}

export type InferConfigFileData<T extends ClippiumData> = Satisfies<
	ConfigFileData,
	Prettify<_InferConfigFileData<T>>
>

