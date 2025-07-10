import { JSONSchema7 } from 'json-schema'

export * from '../../../preset/config/src/_shared/_super'
export * from '../../../preset/config/src/_shared/string'
export * from '../../../preset/config/src/_shared/parser'
export { jsonExtension } from '../../../preset/config/src/_shared/json'
export { setObjectFrom } from '../../../preset/config/src/_shared/object'
export { tomlExtension } from '../../../preset/config/src/_shared/toml'
export { yamlExtension } from '../../../preset/config/src/_shared/yaml'
export {
	jsExtension,
	tsExtension,
} from '../../../preset/config/src/_shared/js'

export type JSONSchema = JSONSchema7

