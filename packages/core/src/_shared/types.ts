export type ObjectValues<Values> = Values[keyof Values]
export type Prettify<T> = {
	[K in keyof T]: T[K]
} & {}

export type NoSpaceString<S extends string> = S extends `${string} ${string}` ? never : S

export type MakeRequired<T, K extends keyof T> = T & {
	[P in K]-?: T[P];
}

export type StringType = ( string & {} )
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type EmptyObject = {}
export type UnionToIntersection<U> =
	( U extends Any ? ( k: U ) => void : never ) extends ( k: infer I ) => void ? I : never

export type MergeIntersectingProps<A, B> = {
	[K in keyof A | keyof B]:
	K extends keyof A
		? K extends keyof B
			? A[K] | B[K] // merge union si está en ambos
			: A[K]
		: K extends keyof B
			? B[K]
			: never
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export type PartialDeep<T> = T extends Function
	? T
	: T extends Array<infer U>
		? Array<PartialDeep<U>>
		: T extends object
			? { [P in keyof T]?: PartialDeep<T[P]> }
			: T

export type ExtractInstanceType<T> = T extends new ( ...args: Any[] ) => infer R ? R : T extends { prototype: infer P } ? P : Any

export type StripIndexSignature<T> = Prettify<{
	[K in keyof T as string extends K ? never : K]:
	T[K] extends object ? StripIndexSignature<T[K]> : T[K]
}>

//////////////////////////////////////////////////////////

export type Argv = string[]
