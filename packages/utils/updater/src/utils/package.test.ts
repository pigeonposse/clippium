import {
	describe,
	it,
} from 'vitest'

describe( 'Package', () => {

	it( 'Shoud be correct', async () => {

		await import( './package.example' )

	} )

} )
