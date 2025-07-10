import { parse as parseJSDoc } from 'comment-parser'

import {
	FunctionInfo,
	FunctionParam,
	Param,
} from './types'
import { Any }   from '../../../_shared/_super'
import { getTs } from '../../../_shared/file'

import type ts from 'typescript'

export const parseFunctionsTypescript = async (
	code: string,
	targetFunctionName?: string,
): Promise<FunctionInfo[]> => {

	const ts       = await getTs()
	const fileName = 'input.ts'

	const compilerHost         = ts.createCompilerHost( {}, true )
	compilerHost.getSourceFile = ( fileName, languageVersion ) => {

		return ts.createSourceFile( fileName, code, languageVersion, true )

	}
	compilerHost.readFile = () => code
	compilerHost.fileExists    = () => true

	const program    = ts.createProgram( [ fileName ], {}, compilerHost )
	const checker    = program.getTypeChecker()
	const sourceFile = program.getSourceFile( fileName )!

	const functions: FunctionInfo[] = []

	// Extraer propiedades de un tipo de objeto (interface, literal, etc.)
	const extractObjectProperties = ( type: ts.Type ): Param[] => {

		return checker.getPropertiesOfType( type ).map( ( symbol ): Param => {

			const name        = symbol.getName()
			const declaration = symbol.valueDeclaration
			const propType    = declaration ? checker.getTypeOfSymbolAtLocation( symbol, declaration ) : undefined
			// console.log( propType ? checker.getPropertiesOfType( propType ) : undefined )
			return {
				name,
				tsType : propType ? checker.typeToString( propType ) : undefined,
			}

		} )

	}

	const extractFromFunctionNode = (
		node: ts.FunctionDeclaration | ts.ArrowFunction | ts.FunctionExpression,
		name: string,
		jsdocText?: string,
	) => {

		const jsdoc = jsdocText ? parseJSDoc( jsdocText )[0] : null

		const params: FunctionParam[] = node.parameters.map( param => {

			const paramName = param.name.getText()
			const doc       = jsdoc?.tags?.find( t => t.tag === 'param' && t.name === paramName )

			let tsType: string | undefined,
				nestedParams: Param[] | undefined,
				defaultValue: Any | undefined

			if ( param.type ) {

				const type = checker.getTypeAtLocation( param.type )
				tsType     = checker.typeToString( type )

				// si es objeto (literal, interface, etc.)
				if (
					type.getSymbol()?.getName() === '__type'
					|| type.isClassOrInterface()
					|| type.isUnionOrIntersection()
				) {

					nestedParams = extractObjectProperties( type )

				}

			}
			if ( param.initializer ) defaultValue = param.initializer.getText()
			return {
				name        : paramName,
				tsType,
				jsDocType   : doc?.type,
				description : doc?.description,
				params      : nestedParams,
				defaultValue,
			}

		} )

		const returnDoc  = jsdoc?.tags?.find( t => t.tag === 'returns' || t.tag === 'return' )
		const returnType = node.type ? checker.typeToString( checker.getTypeAtLocation( node.type ) ) : undefined

		functions.push( {
			name,
			params,
			returns : {
				tsType      : returnType,
				jsDocType   : returnDoc?.type,
				description : returnDoc?.description,
			},
		} )

	}

	const visit = ( node: ts.Node ) => {

		if ( ts.isFunctionDeclaration( node ) && node.name ) {

			const name = node.name.getText()
			if ( targetFunctionName && name !== targetFunctionName ) return
			// @ts-ignore
			const jsdocText = node.jsDoc?.[0]?.getFullText() || ''
			extractFromFunctionNode( node, name, jsdocText )

		}
		else if (
			ts.isVariableStatement( node )
			// && node.modifiers?.some( m => m.kind === ts.SyntaxKind.ExportKeyword )
		) {

			for ( const decl of node.declarationList.declarations ) {

				const name        = decl.name.getText()
				const initializer = decl.initializer
				const jsdocText   = node.getFullText().split( '\n' ).slice( 0, 5 ).join( '\n' )

				if (
					initializer
					&& ( ts.isArrowFunction( initializer ) || ts.isFunctionExpression( initializer ) )
				) {

					if ( targetFunctionName && name !== targetFunctionName ) continue
					extractFromFunctionNode( initializer, name, jsdocText )

				}

			}

		}

		else if (
			ts.isExportAssignment( node )
			&& ( ts.isFunctionExpression( node.expression ) || ts.isArrowFunction( node.expression ) )
		) {

			if ( targetFunctionName && targetFunctionName !== 'default' ) return
			extractFromFunctionNode( node.expression, 'default', node.getFullText() )

		}

		ts.forEachChild( node, visit )

	}

	visit( sourceFile )
	return functions

}

export const parseFunctionTypescript = async (
	code: string,
	targetFunctionName: string = 'default',
) => {

	const functions = await parseFunctionsTypescript( code, targetFunctionName )
	const res       = functions.find( f => f.name === targetFunctionName )
	if ( !res ) throw new Error( `Function "${targetFunctionName}" not found in code` )
	return res

}
