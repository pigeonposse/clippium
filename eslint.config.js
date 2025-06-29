import { setConfig } from '@dovenv/theme-pigeonposse/eslint'

const config = setConfig(
	{
		general   : 'ts',
		toml      : true,
		json      : true,
		package   : true,
		yaml      : true,
		jsdoc     : true,
		html      : true,
		md        : true,
		gitignore : true,
		ignore    : [
			'**/docs/**/*.md',
			'**/README.md',
			'**/docs/data/**/*.md',
			'**/CHANGELOG.md',
			'**/examples/**/partials/*',
			'**/examples/**/templates/*',
			'**/.dovenv/**/partials/*',
			'**/.dovenv/**/templates/*',
			'**/packages/create/data/**',
			'**/packages/config/**/tests/**',
			// '**/packages/i18n/**/examples/**',
			'**/packages/font/examples/js/**',
		],
	},
)

export default config
