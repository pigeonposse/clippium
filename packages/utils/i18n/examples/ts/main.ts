/* eslint-disable jsdoc/require-jsdoc */
import { i18n } from '../../src'

async function initializeI18n() {

	const {
		t,
		getCurrentLang,
		getLangs,
		changeLang,
	} = await i18n( {
		locales : {
			en : {
				general : {
					greeting : '🇬🇧 Hello',
					farewell : '🇬🇧 Goodbye',
					nested   : { more: 'Read more...' },
				},
			},
			es : {
				general : {
					greeting : '🇪🇸 Hola',
					farewell : '🇪🇸 Adiós',
				},
			},
			ja : {
				general : {
					greeting : '🇯🇵 こんにちは',
					farewell : '🇯🇵 さようなら',
				},
			},
			zh : {
				general : {
					greeting : '🇨🇳 你好',
					farewell : '🇨🇳 再见',
				},
			},
			fr : {
				general : {
					greeting : '🇫🇷 Bonjour',
					farewell : '🇫🇷 Au revoir',
				},
			},
		},
		// defaultLocale : 'en',
	} )

	console.log( {
		t : {
			greet              : t( 'general:greeting' ), // returns your value in your system lang, if not exists return falback lang (first in object, in this case: en)
			nested             : t( 'general:nested:more' ), // returns fallback because only exists in english
			errorNoNested      : t( 'general:nested:noExist' ),
			errorNoNS          : t( 'greeting' ), // ERROR: returns key an not the value, because namespace is not set
			errorNestedAndNoNS : t( ':nested:more' ), //ERROR: returns key an not the value, because namespace is not set
		},
		currentLang    : getCurrentLang(), // Returns the current locale name,
		availableLangs : getLangs(), // Returns an array of available locales
	} )

	await changeLang( 'fr' )

	console.log( {
		t : {
			greet              : t( 'general:greeting' ), // returns your value in your system lang, if not exists return falback lang (first in object, in this case: en)
			nested             : t( 'general:nested:more' ), // returns fallback because only exists in english
			errorNoNS          : t( 'greeting' ), // ERROR: returns key an not the value, because namespace is not set
			errorNestedAndNoNS : t( ':nested:more' ), //ERROR: returns key an not the value, because namespace is not set
		},
		currentLang    : getCurrentLang(), // Returns the current locale name,
		availableLangs : getLangs(), // Returns an array of available locales
	} )

}

initializeI18n()
