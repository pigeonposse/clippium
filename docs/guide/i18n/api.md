# `@clippium/i18n` - API documentation

## Functions

### i18n()

```ts
function i18n<Opts>(opts: Opts): Promise<{
  changeLang: (lang: Lang) => Promise<boolean>;
  getCurrentLang: () => Lang;
  getCurrentLocales: () => Promise<{}>;
  getLangs: () => Lang[];
  getLocales: (lang?: Lang) => Promise<{}>;
  t: (value: TParam, opts?: string | TOptionsBase & $Dictionary | TOptionsBase & $Dictionary & {}) => string;
}>
```

Initializes the i18n library with the provided options and returns an i18n object with helper methods.

#### Type Parameters

| Type Parameter |
| ------ |
| `Opts` *extends* [`I18nOpts`](#i18nopts) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts` | `Opts` | Options for configuring i18n. |

#### Returns

`Promise`\<\{
  `changeLang`: (`lang`: `Lang`) => `Promise`\<`boolean`\>;
  `getCurrentLang`: () => `Lang`;
  `getCurrentLocales`: () => `Promise`\<\{\}\>;
  `getLangs`: () => `Lang`[];
  `getLocales`: (`lang`?: `Lang`) => `Promise`\<\{\}\>;
  `t`: (`value`: `TParam`, `opts`?: `string` \| `TOptionsBase` & `$Dictionary` \| `TOptionsBase` & `$Dictionary` & \{\}) => `string`;
 \}\>

- An object with helper methods for managing localization.

| Name | Type | Description |
| ------ | ------ | ------ |
| `changeLang` | (`lang`: `Lang`) => `Promise`\<`boolean`\> | Change language. **Example** `const { changeLanguage } = yourI18nInstance // change lang to spanish const isChanged = changeLang('es')` |
| `getCurrentLang` | () => `Lang` | Retrieves the ID of the current locale. **Example** `const { getCurrentLang } = await i18n({ // your config }) const currentLang = getCurrentLang(); console.log(currentLang) // Returns for example: 'es'` |
| `getCurrentLocales` | () => `Promise`\<\{\}\> | Retrieves the object with the current language translations. **Example** `const { getCurrentLocales } = await i18n({ // your config }) const locales = await getCurrentLocales(); console.log(locales)` |
| `getLangs` | () => `Lang`[] | Retrieves an array of available locales. **Example** `const { getLangs } = await i18n({ // your config }) const appLocales = getLangs() console.log(appLocales) // Returns for example: ['en', 'es', 'de']` |
| `getLocales` | (`lang`?: `Lang`) => `Promise`\<\{\}\> | Retrieves the object with the current language translations. **Example** `const { getLocales } = await i18n({ // your config }) const locales = await getLocales(); console.log(locales)` |
| `t` | (`value`: `TParam`, `opts`?: `string` \| `TOptionsBase` & `$Dictionary` \| `TOptionsBase` & `$Dictionary` & \{\}) => `string` | Translates a given string key to the current locale. **Example** `const { t } = await i18n({ // your config }) console.log( t('general:greet') )` |

#### Example

```ts
import { i18n } from '@clippo/i18n'

const I18N = await i18n({
  locales: {
    en: { general: { greet: '🇬🇧 Hello pigeon' } },
    es: { general: { greet: '🇪🇸 Hola paloma' } }
  },
});

const currentLang = I18N.getCurrentLang();
const availableLangs = I18N.getLangs();
const translatedString = I18N._('general:greet');

console.log(
  currentLang,
  availableLangs,  // returns ['es', 'en']
  translatedString
)

// change lang to spanish
I18N.changeLang('es')

console.log(I18N.getCurrentLang()) // returns 'es'
```

## Type Aliases

### I18nOpts

```ts
type I18nOpts: {
  defaultLocale: string;
  locales: {};
};
```

Options for configuring i18n.

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `defaultLocale`? | `string` | Default language. If not set, gets the system language and takes the locales object's first language as the fallback language. |
| `locales` | \{\} | Set your translations. **Example** `const locales = { en: { general: { greet: '🇬🇧 Hello pigeon' } }, es: { general: { greet: '🇪🇸 Hola paloma' } } }` |
