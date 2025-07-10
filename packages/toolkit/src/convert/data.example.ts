import { data2schema } from './data'
import { cli }         from '../index'

console.dir( data2schema( cli.data, 'json' ), { depth: null } )
