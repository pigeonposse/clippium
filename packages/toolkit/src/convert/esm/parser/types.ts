import { Any } from '../../../_shared/_super'

export type Param = {
	name          : string
	tsType?       : string
	jsDocType?    : string
	defaultValue? : Any
	description?  : string
}
export type FunctionParam = Param & { params?: Param[] }

export type FunctionInfo = {
	name     : string
	params   : FunctionParam[]
	returns?: {
		tsType?      : string
		jsDocType?   : string
		description? : string
	}
}
