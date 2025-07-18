import { type CommonObj } from './_super'

// /**
//  * Get object from a JSON file.
//  *
//  * @param   {string}                     path - Path to the JSON file.
//  * @returns {Promise<object | object[]>}      - The parsed JSON object.
//  * @throws {Error} If there is an error reading the JSON file.
//  * @example import { getObjectFromJSONFile } from "@dovenv/utils"
//  *
//  * const object = await getObjectFromJSONFile('/my/file.json')
//  * console.log( object )
//  */
// export const getObjectFromJSONFile = async <Res extends CommonObj = CommonObj>( path: string ) => {

// 	try {

// 		const fileContent = await getFileContent( path )
// 		return await getObjectFromJSONContent( fileContent ) as Res

// 	}
// 	catch ( error ) {

// 		// @ts-ignore
// 		throw new Error( `Error reading JSON file ${path}: ${error.message}` )

// 	}

// }

export const getObjectFromJSONContent = async <Res extends CommonObj = CommonObj>( content: string ) => {

	return JSON.parse( content ) as Res

}
/**
 * The extension for JSON files.
 */
export const jsonExtension = { json: 'json' } as const
