import { serialize as stringifyTOML } from '@structium/toml'
import { serialize as serializeYAML } from '@structium/yaml'

import { getObjectFromJSContent }   from './js'
import { getObjectFromJSONContent } from './json'
import { getObjectFromTOMLContent } from './toml'
import { getObjectFromYAMLContent } from './yaml'

export const json = {
	deserialize : getObjectFromJSONContent,
	serialize   : ( content: object ) => JSON.stringify( content ),
}
export const toml = {
	deserialize : getObjectFromTOMLContent,
	serialize   : ( content: object ) => stringifyTOML( content ),
}
export const yaml = {
	deserialize : getObjectFromYAMLContent,
	serialize   : ( content: object ) => serializeYAML( content ),
}

export const js = { deserialize: getObjectFromJSContent }
