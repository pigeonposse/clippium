import { ClippiumData } from 'clippium'
import {
	Project,
	Type,
} from 'ts-morph'

import { Any } from '../_shared/_super'
import {
	getTs,
	Input,
} from '../_shared/file'
import { createPlugin } from '../plugin'

import type { CreateInterface } from './_super'

type Flags = NonNullable<ClippiumData['flags']>

export class TypeScript implements CreateInterface {

	async convertToData( i: Input, opts:{
		type      : string
		tsconfig? : string
	} ): Promise<ClippiumData> {

		if ( !i || typeof i !== 'string' ) throw new Error( 'Invalid input. Must be a string' )

		const type       = opts.type || '*'
		const tsconfig   = opts.tsconfig || './tsconfig.json'
		const project    = new Project( { tsConfigFilePath: tsconfig } )
		const sourceFile = project.getSourceFileOrThrow( i )
		const typeAlias  = sourceFile.getTypeAliasOrThrow( type )
		const typeNode   = typeAlias.getType()

		if ( !typeNode.isObject() ) throw new Error( 'Type must be an object' )

		const properties                              = typeNode.getProperties()
		const result: ClippiumData & { flags: Flags } = { flags: {} }

		const getFlagType = ( propType: Type ): Flags[number]['type'] | undefined => {

			if ( propType.isString() ) return 'string'
			if ( propType.isNumber() ) return 'number'
			if ( propType.isBoolean() ) return 'boolean'
			if ( propType.isObject() ) return 'object'
			if ( propType.isArray() ) return 'array'
			if ( propType.isEnum() ) return 'choices'
			return undefined

		}

		for ( const prop of properties ) {

			const propType = prop.getTypeAtLocation( typeAlias )
			let type       = getFlagType( propType ),
				choices: ( string | number )[] | undefined = undefined

			if ( !type && propType.isUnion() ) {

				const unionTypes = propType.getUnionTypes()
				unionTypes.forEach( t => {

					const v = getFlagType( t )
					if ( v ) type = v

				} )
				const literalTypes    = unionTypes.filter( t => t.isStringLiteral() || t.isNumberLiteral() )
				const nonLiteralTypes = unionTypes.filter( t => !t.isStringLiteral() && !t.isNumberLiteral() )

				if ( literalTypes.length > 0 && nonLiteralTypes.length === 0 ) {

					type    = 'choices'
					choices = literalTypes.map( t => t.getLiteralValue() ).filter( v => v !== undefined ) as ( string | number )[]

				}
				else if (
					literalTypes.length > 0
					&& nonLiteralTypes.every( t => t.isUndefined() || t.isNull() )
				) {

					type    = 'choices'
					choices = literalTypes.map( t => t.getLiteralValue() ).filter( v => v !== undefined ) as ( string | number )[]

				}

			}

			if ( !type ) continue

			if ( type === 'choices' && propType.isEnum() )
				choices = propType.getSymbol()?.getExports()?.map( e => e.getName() ) ?? []
			const getDefault = () => {

				const res = prop.getJsDocTags()
					.find( t => t.getName() === 'default' )?.getText().map( t => t.text.replaceAll( '\'', '' ) ).join( '' )

				if ( !res ) return

				try {

					const r = Number( res )
					if ( !Number.isNaN( r ) ) return r

				}
				catch ( _ ) {

					//

				}

				return res

			}
			const getDesc = () => {

				return prop.getJsDocTags()
					.find( t => t.getName() === 'description' )?.getText()
					.map( t => t.text ).join( '' )
					|| prop.getName() + ' flag'

			}

			result.flags[prop.getName()] = {
				desc     : getDesc(),
				required : propType.isNullable() ? undefined : true,
				choices  : choices as ( string | number )[],
				default  : getDefault() as Any,
				type,
			}

		}

		return result as ClippiumData

	}

	async convertFromData( i: ClippiumData, opts:{
		type?    : string
		asConst? : boolean
	} ):Promise<string> {

		const ts = await getTs()

		const code = `
		const config = ${JSON.stringify( i, null, 2 )} ${opts.asConst ? 'as const' : ''};
		type Config = typeof config;
		`
		const sourceFile = ts.createSourceFile( 'virtual.ts', code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS )

		const host         = ts.createCompilerHost( {} )
		host.getSourceFile = fileName => fileName === 'virtual.ts' ? sourceFile : undefined

		const program = ts.createProgram( [ 'virtual.ts' ], {}, host )
		const checker = program.getTypeChecker()

		const configSymbol = checker.getSymbolsInScope( sourceFile, ts.SymbolFlags.Variable ).find( s => s.name === 'config' )

		if ( !configSymbol ) throw new Error( 'Config symbol not found' )

		const configType = checker.getTypeOfSymbolAtLocation( configSymbol, sourceFile )
		const typeStr    = checker.typeToString( configType, undefined, ts.TypeFormatFlags.NoTruncation )

		return `export type ${opts.type || 'ClippiumData'} = ${typeStr}`

	}

}

export const ts = new TypeScript()

export const tsPlugin = createPlugin( {
	desc    : 'Converter utils for TypeScript (types) [experimental]',
	convert : {
		fromData : {
			examples : [
				{
					value : '$0 -i ./clippium-data.ts -o ./out.ts --type Config',
					desc  : 'convert "clippium data" to "Config" type',
				},
			],
			flags : {
				'type' : {
					type  : 'string',
					desc  : 'Output type name',
					alias : [ 't' ],
				},
				'as-const' : {
					type : 'boolean',
					desc : 'Output type as const',
				},
			},
			fn : ( {
				input, flags,
			} ) => ts.convertFromData( input, {
				type    : flags.type,
				asConst : flags['as-const'],
			} ),
		},
		toData : {
			examples : [
				{
					value : '$0 -i ./ts.ts -o ./out.ts --type MyType',
					desc  : 'convert "MyType" type to clippium data',
				},
			],
			flags : {
				type : {
					type     : 'string',
					desc     : 'Type name',
					alias    : [ 't' ],
					required : true,
				},
				tsconfig : {
					type     : 'string',
					desc     : 'TypeScript config file',
					required : false,
				},
			},
			fn : ( {
				input, flags,
			} ) => ts.convertToData( input, {
				type     : flags.type,
				tsconfig : flags.tsconfig,
			} ),
		},
	},
} )
