import { logBench }         from './_super'
import { get as getClis }   from './clis'
import { get as runParser } from './parser'

const run = async () => {

	await logBench( await runParser() )
	await logBench( await getClis() )

}

run()
