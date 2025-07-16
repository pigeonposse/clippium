import presetDefault    from '@clippium/preset-default'
import { ClippiumData } from 'clippium'

import { jsExtension } from './_shared/_super'
import {
	name,
	version,
	coreName,
} from './_shared/const'
import { commandOptions as addCommandOptions } from './add'
import { schemaType }                          from './convert/data'
import { initCommandOptions }                  from './init'
import { Plugins }                             from './plugin'

const group      = 'Global flags:'
const cliDefault = presetDefault( { grouped: group } )
export const data = {
	name,
	version,
	commands : {
		init    : { ...initCommandOptions },
		add     : { ...addCommandOptions },
		docs    : { desc: 'Generate documentation from clippium data' },
		convert : {
			desc     : 'Transform input to and from "clippium data" based on multiple content types',
			examples : [
				{
					value : '$0 openapi to-data -i https://petstore.swagger.io/v2/swagger.json -o ./src/data.js',
					desc  : 'Convert from OpenAPI to clippium data',
				},
				{
					value : '$0 type to-data -i ./my-type.ts -o ./clippium-data.ts --type MyType',
					desc  : 'Convert from TypeScript type to clippium data',
				},
				{
					value : '$0 schema from-data -i ./clippium-data.ts -o ./my-schema.json',
					desc  : 'Convert from clippium data to JSON Schema',
				},
			],
		},
	},
	flags : {
		...cliDefault.data.flags,
		config : {
			type  : 'string',
			desc  : `Configuration file. If not provided, ./${coreName}.config.{${Object.values( jsExtension ).join( ',' )}} will be shearched for.`,
			alias : [ 'c' ],
			group,
		},
	},
} satisfies ClippiumData

export const validaConfigFiles = Object.values( jsExtension ).map( ext => `./${coreName}.config.${ext}` )

// EXAMPKES OF USE
// clippium-toolkit convert type to-data -i ./src/data.ts -o ./src/data.{js,ts,json,yaml,json}
// clippium-toolkit convert type to-data-schema -i ./src/data.ts -o ./src/data.{js,ts,json,yaml,json}
// clippium-toolkit convert type from-data -i ./src/data.ts -o ./src/data.{js,ts,json,yaml,json}
export const convertCommand = {
	toData       : 'to-data',
	toDataSchema : 'to-data-schema',
	fromData     : 'from-data',
}
type PluginData = {
	convert : ClippiumData
	docs    : ClippiumData
}
export const setPluginsData = <R extends PluginData>( data: Plugins ): R => {

	const res  = {} as R['convert']
	const docs = {} as R['docs']

	const title     = ( from: string, to: string ) => `Convert from "${from}" to ${to}`
	const dataTitle = 'clippium data'

	for ( const key in data ) {

		const value = data[key]

		if ( !res.commands ) res.commands = {}

		if ( value.docs ) {

			if ( !docs.commands ) docs.commands = {}
			docs.commands[key] = {
				desc  : `Create documentation from "${dataTitle}"`,
				flags : {
					...value.docs.flags,
					input : {
						type     : 'string',
						desc     : 'Input file (Allow path, string and URL)',
						alias    : [ 'i' ],
						required : true,
					},
					output : {
						type  : 'string',
						desc  : 'Output file (Allow path, string and URL)',
						alias : [ 'o' ],
					},
				},
				examples : value.docs.examples,
			}

		}

		if ( !value.convert || ( !value.convert?.fromData && !value.convert?.toData ) ) continue
		res.commands[key] = { desc: value.desc || `Converter utils for: ${key}` }
		if ( value.convert?.fromData ) {

			if ( !res.commands[key].commands ) res.commands[key].commands = {}
			res.commands[key].commands[convertCommand.fromData] = {
				desc  : title( dataTitle, key ),
				flags : {
					...value.convert.fromData.flags,
					input : {
						type     : 'string',
						desc     : 'Input file (Allow path, string and URL)',
						alias    : [ 'i' ],
						required : true,
					},
					output : {
						type  : 'string',
						desc  : 'Output file (Allow path, string and URL)',
						alias : [ 'o' ],
					},
				},
				examples : value.convert.fromData.examples,
			}

		}
		if ( value.convert?.toData ) {

			if ( !res.commands[key].commands ) res.commands[key].commands = {}
			res.commands[key].commands[convertCommand.toData]       = {
				desc  : title( key, dataTitle ),
				flags : {
					...value.convert.toData.flags,
					input : {
						type     : 'string',
						desc     : 'Input file (Allow path, string and URL)',
						alias    : [ 'i' ],
						required : true,
					},
					output : {
						type  : 'string',
						desc  : 'Output file (Allow path, string and URL)',
						alias : [ 'o' ],
					},
				},

				examples : value.convert.toData.examples,
			}
			res.commands[key].commands[convertCommand.toDataSchema] = {
				desc  : title( key, dataTitle + ' schema' ),
				flags : {
					...value.convert.toData.flags,
					input : {
						type     : 'string',
						desc     : 'Input file (Allow path, string and URL)',
						alias    : [ 'i' ],
						required : true,
					},
					output : {
						type  : 'string',
						desc  : 'Output file (Allow path, string and URL)',
						alias : [ 'o' ],
					},
					res : {
						type    : 'choices',
						desc    : 'Set output schema type',
						default : schemaType.json,
						choices : Object.values( schemaType ),
					},
				},
				examples : value.convert.toData.examples,
			}

		}

	}

	return {
		convert : res,
		docs,
	} as R

}
