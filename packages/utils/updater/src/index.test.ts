import {
	afterEach,
	describe,
	it,
	expect,
	vi,
} from 'vitest'

import { Updater }                 from './index'
import {
	compareVersions,
	getPackageManager,
	getPackageVersionsFromRegistry,
} from './utils/package'

vi.mock( './utils/cache' )
vi.mock( './utils/package', async importOriginal => {

	const mod = await importOriginal()
	return {
		...mod,
		getPackageManager              : vi.fn(),
		getPackageVersionsFromRegistry : vi.fn(),
	}

} )

const packageName = 'binarium'
const versionOld  = '2.1.1'

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

	afterEach( () => {

		vi.clearAllMocks()

	} )

	it( 'should return an object with a notify function', () => {

		const result = new Updater( {
			name    : packageName,
			version : versionOld,
		} )
		expect( typeof result.notify ).toBe( 'function' )

	} )

	describe( 'get', () => {

		it( 'should pick the highest version regardless of array order', async () => {

			vi.mocked( getPackageVersionsFromRegistry ).mockResolvedValue( [
				'2.1.0',
				'2.2.1',
				'2.0.5',
			] )
			vi.mocked( getPackageManager ).mockResolvedValue( 'npm' )

			const updater = new Updater( {
				name    : 'binarium-nonascending',
				version : '2.1.0',
			} )

			const data = await updater.get()
			expect( data?.latestVersion ).toBe( '2.2.1' )

		} )

		it( 'should return undefined when current is newer than latest', async () => {

			vi.mocked( getPackageVersionsFromRegistry ).mockResolvedValue( [ '2.1.0' ] )
			vi.mocked( getPackageManager ).mockResolvedValue( 'npm' )

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
	// 		ttl     : 1000,
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
