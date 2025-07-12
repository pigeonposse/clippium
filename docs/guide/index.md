# What is clippium?

![clippium](/banner.png)

`clippium` is a tool that helps to create command line interfaces (CLI) with powerful and pristine operations.

> ⚠️ beta version

- [Read more](./core)


## 🔑 Installation

::: code-group

```bash [npm]
npm install clippium
```

```bash [pnpm]
pnpm install clippium
```

```bash [yarn]
yarn add clippium
```

```bash [bun]
bun add clippium
```

```bash [deno]
deno add clippium
```

:::

## 🌟 Features

- 🚀 **Easy to Use**: Simple setup with minimal configuration required.
- ⚡ **Fast**: Optimized for quick execution and minimal overhead. [Read more](https://clippium.pigeonposse.com/guide/core/performance/)

- 📦 **lightweight**: Zero dependencies and a small package
- 🌍 **Available for:**
   - 🟢 Node.js
   - 🦕 Deno
   - 🍞 Bun
   - 🌐 Browser
- ⚙️ **Customizable**: 
   - Change the help format, version, and error output.
   - Create style themes for your _CLIs_.

## 🎨 Presets

- [Colored](https://clippium.pigeonposse.com/guide/preset/colored/): Add color to help output. 
- [Default](https://clippium.pigeonposse.com/guide/preset/default): Add standard flags like _--help_ or _--version_.
- [Config](https://clippium.pigeonposse.com/guide/preset/config/): Add configuration file support.

## 🧰 Toolkit

A CLI toolkit to initialize, convert, transform, and create documentation for your Clippium CLI.
[Read more](https://clippium.pigeonposse.com/guide/toolkit/)

### Create documentation

Create documentation from your Clippium CLI

[Read more](https://clippium.pigeonposse.com/guide/toolkit/)

### Init 

Init a Clippium CLI

[Read more](https://clippium.pigeonposse.com/guide/toolkit/)

### Conversion utils

Convert to and from Clippium CLI data.
Convert json schemas, openapi schemas, js functions, typescript types etc to a Clippium CLI and vice versa

[Read more](https://clippium.pigeonposse.com/guide/toolkit/)

## 🛠️ Extra tools

- [Color](https://clippium.pigeonposse.com/guide/color/): Add color support to your text _(with browser support)_.
- [i18n](https://clippium.pigeonposse.com/guide/i18n/): Add **Internalization** to your **CLI** _(with browser support)_.
- [Updater](https://clippium.pigeonposse.com/guide/updater/): Add updater notification to your **CLI**.

## 📈 Usage

### Use with class

```js
import { Clippium } from 'clippium'

const cli = new Clippium( data )
cli.fn = async data => {
  // do something
}
await cli.run( process.argv.slice( 2 ) )
```

### Use with functions

```js
import process from 'node:process'
import { hiddenBin, defineData, parse } from 'clippium'

const data = defineData({ ... })
const argv = hiddenBin( process.argv )

const { 
	flags, 
	positionals, 
	commands 
} = parse( {argv, data} )

// do something
```


## 💡 Examples

```js 
import { Clippium, hiddenBin, defineData } from 'clippium'

const data = defineData({
	name: 'my-cli',
	description: 'My CLI',
	version: '1.0.0',
	flags: {
		help: {
			alias: 'h',
			description: 'help mode',
			type: 'boolean',
		},
	},
	commands: {
		dev: {
			description: 'Run development server',
			flags: {
				port: {
					alias: 'p',
					description: 'Port to run the server on',
					type: 'number',
					default: 3000,
				},
				watch: {
					alias: 'w',
					description: 'Watch for changes and reload the server',
					type: 'boolean',
				},
			},
		}
	}
})

const argv = hiddenBin( process.argv )
const cli = new Clippium( data )

const { flags, commands } = cli.parse(argv)

if ( flags.help ) console.log( cli.getHelp(argv) )
else if ( commands.dev ) {

	console.log( `Running development server on port ${flags.port || 3000}` )
	if ( flags.watch ) console.log( 'Watching for changes...' )

	// run development server here

}

```
