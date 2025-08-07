import { isBrowser } from './sys'

export const onExit = async ( cb: () => Promise<void> | void ) => {

	let called = false

	const callOnce = async () => {

		if ( called ) return
		called = true
		try {

			await cb()

		}
		catch ( err ) {

			console.error( 'Error in onExit callback:', err )

		}

	}

	if ( isBrowser ) {

		const handler = () => void callOnce()

		window.addEventListener( 'beforeunload', handler )
		document.addEventListener( 'visibilitychange', () => {

			if ( document.visibilityState === 'hidden' ) handler()

		} )

	}
	else {

		const process = ( await import( 'node:process' ) ).default
		process.on( 'exit', () => {

			cb()

		} )

	}

}
