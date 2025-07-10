export const getNext = <T>( arr: T[], current: T ): T | undefined => {

	const index = arr.indexOf( current )
	if ( index === -1 || index === arr.length - 1 ) return undefined
	return arr[index + 1]

}
