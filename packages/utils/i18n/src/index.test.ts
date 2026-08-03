import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
} from 'vitest'

import { I18nextCLILanguageDetector } from './detector'
import { i18n }                       from './index'

import type {
	FallbackLng,
	Services,
} from 'i18next'

const locales = {
	es : {
		general : {
			greet         : 'Hola',
			greetWithName : 'Hola, {{name}}',
		},
	},
	en : {
		general : {
			greet         : 'Hello',
			greetWithName : 'Hello, {{name}}',
		},
	},
}

const envKeys = [
	'LC_ALL',
	'LC_MESSAGES',
	'LANG',
	'LANGUAGE',
]

describe( 'i18n', () => {

	it( 'should return an object with the expected helpers', async () => {

		const I18N = await i18n( {
			locales,
			defaultLocale : 'en',
		} )

		expect( I18N ).toMatchObject( {
			getCurrentLocales : expect.any( Function ),
			getLocales        : expect.any( Function ),
			getCurrentLang    : expect.any( Function ),
			getLangs          : expect.any( Function ),
			t                 : expect.any( Function ),
			changeLang        : expect.any( Function ),
		} )

	} )

	it( 'should translate a key in the default locale', async () => {

		const I18N = await i18n( {
			locales,
			defaultLocale : 'en',
		} )

		expect( I18N.getCurrentLang() ).toBe( 'en' )
		expect( I18N.t( 'general:greet' ) ).toBe( 'Hello' )

	} )

	it( 'should translate interpolated values', async () => {

		const I18N = await i18n( {
			locales,
			defaultLocale : 'en',
		} )

		expect( I18N.t( 'general:greetWithName', { name: 'pigeon' } ) ).toBe( 'Hello, pigeon' )

	} )

	it( 'should change the language and translate in the new locale', async () => {

		const I18N = await i18n( {
			locales,
			defaultLocale : 'en',
		} )

		expect( I18N.t( 'general:greet' ) ).toBe( 'Hello' )

		const changed = await I18N.changeLang( 'es' )
		expect( changed ).toBe( true )
		expect( I18N.getCurrentLang() ).toBe( 'es' )
		expect( I18N.t( 'general:greet' ) ).toBe( 'Hola' )

	} )

	it( 'should return the available languages', async () => {

		const I18N = await i18n( {
			locales,
			defaultLocale : 'en',
		} )

		expect( I18N.getLangs() ).toEqual( [ 'es', 'en' ] )

	} )

	it( 'should return all locales and the current one', async () => {

		const I18N = await i18n( {
			locales,
			defaultLocale : 'en',
		} )

		expect( await I18N.getLocales() ).toEqual( locales )
		expect( await I18N.getLocales( 'es' ) ).toEqual( locales.es )
		expect( await I18N.getCurrentLocales() ).toEqual( locales.en )

	} )

	it( 'should fall back to the first locale when current is not available', async () => {

		const I18N = await i18n( {
			locales,
			defaultLocale : 'fr',
		} )

		expect( I18N.getCurrentLang() ).toBe( 'es' )

	} )

} )

describe( 'I18nextCLILanguageDetector', () => {

	beforeEach( () => {

		for ( const key of envKeys ) delete process.env[key]

	} )

	afterEach( () => {

		for ( const key of envKeys ) delete process.env[key]

	} )

	const getServices = ( languages: string[] ) => ( {

		languageUtils : {
			isSupportedCode    : ( code: string ) => languages.includes( code ),
			formatLanguageCode : ( code: string ) => code,
		},

	} ) as unknown as Services

	const getDetector = ( fallbackLng: FallbackLng, languages: string[] ) => {

		const detector = new I18nextCLILanguageDetector()
		detector.init(
			getServices( languages ),
			{},
			{ fallbackLng },
		)
		return detector

	}

	it( 'should fall back to fallbackLng when no shell locale is set', () => {

		const detector = getDetector( 'es', [
			'es',
			'es-ES',
			'en',
			'en-US',
		] )
		expect( detector.detect() ).toBe( 'es' )

	} )

	it( 'should detect the language from LANG', () => {

		process.env.LANG = 'es_ES.UTF-8'

		const detector = getDetector( 'es', [
			'es',
			'es-ES',
			'en',
			'en-US',
		] )
		expect( detector.detect() ).toBe( 'es-ES' )

	} )

	it( 'should return the array when multiple languages are supported', () => {

		process.env.LANGUAGE = 'en_US.UTF-8:fr_FR.UTF-8'

		const detector = getDetector( 'es', [
			'en',
			'en-US',
			'fr',
			'fr-FR',
			'es',
		] )
		expect( detector.detect() ).toEqual( [ 'en-US', 'fr-FR' ] )

	} )

	it( 'should return fallbackLng when the detected language is C', () => {

		process.env.LANG = 'C'

		const detector = getDetector( 'es', [
			'C',
			'es',
			'es-ES',
			'en',
			'en-US',
		] )
		expect( detector.detect() ).toBe( 'es' )

	} )

	it( 'should filter out unsupported languages', () => {

		process.env.LANG = 'xx_XX.UTF-8'

		const detector = getDetector( 'es', [ 'es', 'en' ] )
		expect( detector.detect() ).toEqual( [] )

	} )

	it( 'should return a copy of fallbackLng when it is an array', () => {

		const detector = getDetector( [ 'es', 'en' ], [ 'es', 'en' ] )
		expect( detector.detect() ).toEqual( [ 'es', 'en' ] )

	} )

} )
