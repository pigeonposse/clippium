/**
 * Internationalization.
 *
 * @description Internationalize your CLI.
 */

import i18next from 'i18next'

import { I18nextCLILanguageDetector } from './detector'

import type { I18nOpts } from './types'

/**
 * Export types that can be used from outside.
 *
 */
export { I18nOpts }

/**
 * Initializes the i18n library with the provided options and returns an i18n object with helper methods.
 *
 * @param   {import('./types.ts').I18nOpts} opts - Options for configuring i18n.
 * @returns {Promise<object>}                    - An object with helper methods for managing localization.
 * @example
 * import { i18n } from '@clippo/i18n'
 *
 * const I18N = await i18n({
 *   locales: {
 *     en: { general: { greet: '🇬🇧 Hello pigeon' } },
 *     es: { general: { greet: '🇪🇸 Hola paloma' } }
 *   },
 * });
 *
 * const currentLang = I18N.getCurrentLang();
 * const availableLangs = I18N.getLangs();
 * const translatedString = I18N._('general:greet');
 *
 * console.log(
 *   currentLang,
 *   availableLangs,  // returns ['es', 'en']
 *   translatedString
 * )
 *
 * // change lang to spanish
 * I18N.changeLang('es')
 *
 * console.log(I18N.getCurrentLang()) // returns 'es'
 */
export async function i18n<Opts extends I18nOpts>( opts: Opts ) {

	type GetLang<L> = L extends Record<infer U extends string, L[keyof L]> ? `${U}` : string
	type Lang = GetLang<Opts['locales']>

	type GetTParams<L> = L extends Record<infer U extends string, infer V>
		? V extends Record<infer W extends string, infer X>
			? X extends Record<infer I extends string, unknown> ? `${U}:${W}:${I}` : `${U}:${W}`
			: string
		: string
	type TParam = GetTParams<Opts['locales'][keyof Opts['locales']]>

	// type GetDefault<L> = L extends string ? L : Opts['locales'][1]
	// type DefaultLang = GetDefault<Opts['defaultLocale']>

	const lang    = opts.defaultLocale || Object.keys( opts.locales )[0]
	const options = {
		// ns            : 'translations',
		// defaultNS     : 'translations',
		initImmediate : false, // setting initImediate to false, will load the resources synchronously
		resources     : opts.locales,
		fallbackLng   : lang,
		cleanCode     : true,
	}

	if ( !opts.defaultLocale )
		// @ts-ignore
		await i18next.use( I18nextCLILanguageDetector ).init( options )
	else
		// @ts-ignore
		await i18next.init( {
			...options,
			lng : opts.defaultLocale,
		} )

	const langs          = Object.keys( opts.locales ) as Lang[]
	const getCurrentLang = (): Lang => {

		const curr = i18next.language as Lang

		if ( langs.includes( curr ) ) return curr
		const matchedLang = langs.find( lang => curr.startsWith( lang ) )
		if ( matchedLang ) return matchedLang
		return langs[0]

	}

	return {
		/**
		 * Retrieves the object with the current language translations.
		 *
		 * @returns {string} - The object with the current language translations.
		 * @example
		 * const { getCurrentLocales } = await i18n({
		 *   // your config
		 * })
		 * const locales = await getCurrentLocales();
		 * console.log(locales)
		 */
		getCurrentLocales : async () => opts.locales[getCurrentLang()],
		/**
		 * Retrieves the object with the current language translations.
		 *
		 * @param   {string} lang - Lang string.
		 * @returns {string}      - The object with the current language translations.
		 * @example
		 * const { getLocales } = await i18n({
		 *   // your config
		 * })
		 * const locales = await getLocales();
		 * console.log(locales)
		 */
		getLocales        : async ( lang?: Lang ) => lang ? opts.locales[lang] : opts.locales,
		/**
		 * Retrieves the ID of the current locale.
		 *
		 * @returns {string} - The ID of the current locale.
		 * @example
		 * const { getCurrentLang } = await i18n({
		 *   // your config
		 * })
		 * const currentLang = getCurrentLang();
		 * console.log(currentLang) // Returns for example: 'es'
		 */
		getCurrentLang    : (): Lang => getCurrentLang(),
		/**
		 * Retrieves an array of available locales.
		 *
		 * @returns {string[]} - An array of available locales.
		 * @example
		 * const { getLangs } = await i18n({
		 *   // your config
		 * })
		 * const appLocales = getLangs()
		 * console.log(appLocales) // Returns for example: ['en', 'es', 'de']
		 */
		getLangs          : (): Lang[] => langs,
		/**
		 * Translates a given string key to the current locale.
		 *
		 * @param   {string} value - The key to translate.
		 * @param   {object} opts  - The opts to translate.
		 * @returns {string}       - The translated string.
		 * @example
		 * const { t } = await i18n({
		 * // your config
		 * })
		 * console.log( t('general:greet') )
		 */
		// @ts-ignore
		t                 : ( value: TParam, opts?: Parameters<typeof i18next.t>[1] ): string => i18next.t( value, opts ) as string,
		/**
		 * Change language.
		 *
		 * @param   {string}           lang - Lang string.
		 * @returns {Promise<boolean>}      - Returns `true` if is changed.
		 * @example
		 * const { changeLanguage } = yourI18nInstance
		 * // change lang to spanish
		 * const isChanged = changeLang('es')
		 */
		changeLang        : async ( lang: Lang ) => {

			try {

				await i18next.changeLanguage( lang )
				return true

			}
			catch ( _e ) {

				return false

			}

		},

	}

}
