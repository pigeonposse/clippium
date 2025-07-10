/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	parse as acornParse,
	type Comment,
} from 'acorn'
import * as acornWalk          from 'acorn-walk'
import { parse as parseJSDoc } from 'comment-parser'

import { FunctionInfo } from './types'

export const parseFunctionsJavascript = async (
	code: string,
	targetFunctionName?: string,
): Promise<FunctionInfo[]> => {

	const ast = acornParse( code, {
		ecmaVersion : 'latest',
		sourceType  : 'module',
		locations   : true,
		onComment   : [], // needed for comment parsing
	} ) as any

	const comments = ( ast.comments || [] ) as Comment[]

	const findJsDocBefore = ( nodeStart: number ): string | undefined => {

		const comment = comments
			.reverse()
			.find( c => c.end < nodeStart && c.type === 'Block' && c.value.startsWith( '*' ) )
		return comment ? `/*${comment.value}*/` : undefined

	}

	const functions: FunctionInfo[] = []

	const extractFromFunctionNode = (
		node: any,
		name: string,
		jsdocText?: string,
	) => {

		const jsdoc = jsdocText ? parseJSDoc( jsdocText )[0] : null

		const params = node.params.map( ( param: any ) => {

			const paramName = param.name || param.left?.name || 'unknown'
			const doc       = jsdoc?.tags?.find( t => t.tag === 'param' && t.name === paramName )
			return {
				name        : paramName,
				jsDocType   : doc?.type,
				description : doc?.description,
			}

		} )

		const returnDoc = jsdoc?.tags?.find( t => t.tag === 'returns' || t.tag === 'return' )

		functions.push( {
			name,
			params,
			returns : {
				jsDocType   : returnDoc?.type,
				description : returnDoc?.description,
			},
		} )

	}

	acornWalk.simple( ast, {
		FunctionDeclaration( node: any ) {

			const name = node.id?.name
			if ( !name || ( targetFunctionName && name !== targetFunctionName ) ) return

			const jsdocText = findJsDocBefore( node.start )
			extractFromFunctionNode( node, name, jsdocText )

		},

		ExportNamedDeclaration( node: any ) {

			const decl = node.declaration
			if ( !decl ) return

			if ( decl.type === 'FunctionDeclaration' ) {

				const name = decl.id?.name
				if ( !name || ( targetFunctionName && name !== targetFunctionName ) ) return
				const jsdocText = findJsDocBefore( decl.start )
				extractFromFunctionNode( decl, name, jsdocText )

			}

			if ( decl.type === 'VariableDeclaration' ) {

				for ( const d of decl.declarations ) {

					const name = d.id.name
					const init = d.init
					if (
						init
						&& ( init.type === 'ArrowFunctionExpression' || init.type === 'FunctionExpression' )
					) {

						if ( targetFunctionName && name !== targetFunctionName ) continue
						const jsdocText = findJsDocBefore( node.start )
						extractFromFunctionNode( init, name, jsdocText )

					}

				}

			}

		},

		ExportDefaultDeclaration( node: any ) {

			const func = node.declaration
			if (
				func.type === 'FunctionDeclaration'
				|| func.type === 'FunctionExpression'
				|| func.type === 'ArrowFunctionExpression'
			) {

				if ( targetFunctionName && targetFunctionName !== 'default' ) return
				const jsdocText = findJsDocBefore( func.start )
				extractFromFunctionNode( func, 'default', jsdocText )

			}

		},
	} )

	return functions

}
export const parseFunctionJavascript = async (
	code: string,
	targetFunctionName: string = 'default',
) => {

	const functions = await parseFunctionsJavascript( code, targetFunctionName )
	const res       = functions.find( f => f.name === targetFunctionName )
	if ( !res ) throw new Error( `Function "${targetFunctionName}" not found in code` )
	return res

}
