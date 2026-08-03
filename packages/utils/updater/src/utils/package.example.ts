import { getVersionType } from './package'

const compare = ( testRes: string, expectedRes: string ) => {

	if ( testRes !== expectedRes )
		throw new Error( `Expected result "${expectedRes}" is not equal to test result "${testRes}"` )
	console.log( testRes )

}

compare( getVersionType( '1.2.3', '2.0.0' ), 'major' )
compare( getVersionType( '1.2.3', '1.3.0' ), 'minor' )
compare( getVersionType( '1.2.3', '1.2.4' ), 'patch' )
compare( getVersionType( '1.2.3', '1.2.3-alpha.1' ), 'prerelease' )
compare( getVersionType( '1.2.3', '1.2.3+build.001' ), 'build' )
compare( getVersionType( '1.2.3', '1.2.3' ), 'latest' )
