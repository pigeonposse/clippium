import {
	afterEach,
	beforeEach,
	describe,
	it,
	expect,
	vi,
} from 'vitest'

import { Updater }         from './index'
import { Cache }           from './utils/cache'
import { compareVersions } from './utils/package'

// const mockTinyUpdater = vi.fn()
// vi.mock( 'tiny-updater', () => ( { default: mockTinyUpdater } ) )

const packageName = 'binarium'
const versionOld  = '2.1.1'

const cacheOf = ( name: string ) => new Cache( `clippium-updater-${name}-latest` )

const mockRegistry = ( versions: string[] ) => {

	vi.stubGlobal( 'fetch', vi.fn().mockResolvedValue( {
		ok   : true,
		json : async () => ( { versions: Object.fromEntries( versions.map( v => [ v, {} ] ) ) } ),
	} ) )

}

describe( 'compareVersions', () => {

	it( 'should compare numerically regardless of string order', () => {

		expect( compareVersions( '2.2.1', '2.1.0' ) ).toBe( 1 )
		expect( compareVersions( '2.1.0', '2.2.1' ) ).toBe( -1 )
		expect( compareVersions( '2.2.1', '2.2.1' ) ).toBe( 0 )
		expect( compareVersions( '2.10.0', '2.9.0' ) ).toBe( 1 )

	} )

	it( 'should treat prerelease as lower than release', () => {

		expect( compareVersions( '2.2.1-beta.1', '2.2.1' ) ).toBe( -1 )
		expect( compareVersions( '2.2.1', '2.2.1-beta.1' ) ).toBe( 1 )

	} )

} )

describe( 'updater', () => {

	it( 'should return an object with a notify function', () => {

		const result = new Updater( {
			name    : packageName,
			version : versionOld,
		} )
		expect( typeof result.notify ).toBe( 'function' )

	} )

	describe( 'get', () => {

		beforeEach( async () => {

			await cacheOf( 'binarium-nonascending' ).clear()
			await cacheOf( 'binarium-downgrade' ).clear()

		} )

		afterEach( () => {

			vi.unstubAllGlobals()
			vi.restoreAllMocks()

		} )

		it( 'should pick the highest version regardless of array order', async () => {

			mockRegistry( [
				'2.1.0',
				'2.2.1',
				'2.0.5',
			] )

			const updater = new Updater( {
				name    : 'binarium-nonascending',
				version : '2.1.0',
			} )

			const data = await updater.get()
			expect( data?.latestVersion ).toBe( '2.2.1' )

		} )

		it( 'should return undefined when current is newer than latest', async () => {

			mockRegistry( [ '2.1.0' ] )

			const updater = new Updater( {
				name    : 'binarium-downgrade',
				version : '2.2.1',
			} )

			const data = await updater.get()
			expect( data ).toBeUndefined()

		} )

	} )

	// it( 'should call updaterTiny with default ttl', () => {

	// 	mockTinyUpdater.mockClear()

	// 	const result = updater( {
	// 		name    : packageName,
	// 		version : versionOld,
	// 	} )

	// 	result.notify()

	// 	expect( mockTinyUpdater ).toHaveBeenCalledWith( {
	// 		name    : packageName,
	// 		version : versionOld,
	// 		ttl     : 86400000,
	// 	} )

	// } )

	// it( 'should override ttl even if one is provided', () => {

	// 	mockTinyUpdater.mockClear()

	// 	const result = updater( {
	// 		name    : packageName,
	// 		version : versionOld,
	// 		ttl     : 1000,
	// 	} )

	// 	result.notify()

	// 	expect( mockTinyUpdater ).toHaveBeenCalledWith( {
	// 		name    : packageName,
	// 		version : versionOld,
	// 		ttl     : 86400000, // override confirmed
	// 	} )

	// } )

} )
