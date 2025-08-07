import {
	describe,
	it,
	expect,
} from 'vitest'

import { Updater } from './index'

// const mockTinyUpdater = vi.fn()
// vi.mock( 'tiny-updater', () => ( { default: mockTinyUpdater } ) )

const packageName = 'binarium'
const versionOld  = '2.1.1'

describe( 'updater', () => {

	it( 'should return an object with a notify function', () => {

		const result = new Updater( {
			name    : packageName,
			version : versionOld,
		} )
		expect( typeof result.notify ).toBe( 'function' )

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
