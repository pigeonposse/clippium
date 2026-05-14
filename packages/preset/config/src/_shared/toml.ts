import { deserialize as parse } from '@structium/toml'

import type { CommonObj } from './_super'

export const getObjectFromTOMLContent = async <Res extends CommonObj = CommonObj>( content: string ) => {

	return parse<Res>( content )

}

export const tomlExtension = {
	toml : 'toml',
	tml  : 'tml',
} as const
