import { run as runClis }   from './clis'
import { run as runParser } from './parser'

const run = async () => {

	await runParser()
	await runClis()

}

run()
