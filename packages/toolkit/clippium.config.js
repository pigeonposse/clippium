/**
 * @type {import('./src/index').Config}
 */
export default { plugin : { random : {
	desc    : 'Random test plugin',
	convert : { toData : {
		flags : { type : {
			type     : 'string',
			desc     : 'Type name',
			alias    : [ 't' ],
			required : true,
		} },
		fn : async ( {
			input, flags,
		} ) => {

			console.log( input, flags )
			return {
				name     : 'testName',
				desc     : 'TestDesc',
				commands : { test: { desc: 'Test command' } },
			}

		},
	} },
} } }
