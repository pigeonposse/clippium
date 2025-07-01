
import type { CommonObj } from './_super'

export const getObjectFromJSContent = async <Res extends CommonObj = CommonObj>(
	content: string,
	part: string = 'default',
): Promise<Res> => {

	let base64: string

	if ( typeof Buffer !== 'undefined' ) {

		base64 = Buffer.from( content, 'utf8' ).toString( 'base64' )

	}
	else if ( typeof btoa !== 'undefined' ) {

		base64 = btoa( unescape( encodeURIComponent( content ) ) )

	}
	else {

		throw new Error( 'The base64 encoding method could not be determined for this environment.' )

	}

	const dataUrl = `data:text/javascript;base64,${base64}`

	try {

		const mod = await import( /* @vite-ignore */ dataUrl )

		if ( !( part in mod ) ) {

			throw new Error( `Export "${part}" not found in module.` )

		}
		return mod[part] as Res

	}
	catch ( err ) {

		throw new Error(
			`Error importing JS module from base64: ${err instanceof Error ? err.message : String( err )}`,
		)

	}

}
