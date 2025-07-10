import yamlLib from 'js-yaml'

import type { CommonObj } from './_super'

export const getObjectFromYAMLContent = async <Res extends CommonObj = CommonObj>( content: string ) => {

	const r = yamlLib.load( content ) as Res
	return r

}

export const yamlExtension = {
	yaml : 'yaml',
	yml  : 'yml',
} as const
