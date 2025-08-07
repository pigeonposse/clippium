import { getVersionType } from './package'

console.log( getVersionType( '1.2.3', '2.0.0' ) ) // 'major'
console.log( getVersionType( '1.2.3', '1.3.0' ) ) // 'minor'
console.log( getVersionType( '1.2.3', '1.2.4' ) ) // 'patch'
console.log( getVersionType( '1.2.3', '1.2.3-alpha.1' ) ) // 'prerelease'
console.log( getVersionType( '1.2.3', '1.2.3+build.001' ) ) // 'build'
console.log( getVersionType( '1.2.3', '1.2.3' ) ) // 'latest'
