import { parse } from 'smol-toml'

import type { CommonObj } from './_super'

export const getObjectFromTOMLContent = async <Res extends CommonObj = CommonObj>( content: string ) => {

	return parse( content ) as Res

}

export const tomlExtension = {
	toml : 'toml',
	tml  : 'tml',
} as const
