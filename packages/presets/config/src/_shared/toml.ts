import { parse } from 'smol-toml'

import type { CommonObj } from './_super'

export const getObjectFromTOMLContent = async <Res extends CommonObj = CommonObj>( content: string ) => {

	const r = parse( content ) as Res
	return r

}
