import { data }             from './data'
import { createJSONSchema } from '../../src/schema'

createJSONSchema( data, './build/schema.json' )
