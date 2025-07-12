import { md2terminal } from '@dovenv/core/utils'

import { content } from './create-md.js'

const text = await md2terminal( content )
console.log( text )
