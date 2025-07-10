
const input = './src/index.ts'

/**
 * THis is the config for get with this example
 *
 * @type {import('./data').ConfigFileData}
 */
export default {
	commands : {
		build : {
			positionals : {
				input,
				output : './dist/',
			},
			flags : {
				minify : true,
				bundle : true,
			},
		},

		dev : {
			positionals : { input },
			flags       : {
				port  : 3000,
				watch : true,
			},
		},
		nest : { commands: { nest2: { commands: { nest3: { flags: { nestflag: true } } } } } },
	},
	flags : { verbose: true },
}
