## What is clippium?

`clippium` is a tool that helps to create command line interfaces (CLI) with powerful and pristine operations.

> ⚠️ Beta version

## Features

- 🚀 **Easy to Use**: Simple setup with minimal configuration required.
- ⚡ **Fast**: Optimized for quick execution and minimal overhead. [Read more](https://clippium.pigeonposse.com/guide/performance/)

- 📦 **lightweight**: Zero dependencies and a small package
- 🌍 **Available for:**
   - 🟢 Node.js
   - 🦕 Deno
   - 🍞 Bun
   - 🌐 Browser
- 🛠️ **Customizable**: 
   - Change the help format, version, and error output.
   - Create style themes for your _CLIs_.
- 🎨 **Presets**:
   - [Colored](https://clippium.pigeonposse.com/guide/preset/colored/): Add color to help output. 
   - [Default](https://clippium.pigeonposse.com/guide/preset/default): Add standard flags like _--help_ or _--version_.
   - [Config](https://clippium.pigeonposse.com/guide/preset/config/): Add configuration file support.
 - **Toolkit**:
   - A CLI toolkit to initialize, convert, transform, and create documentation for your Clippium CLI.
   [Read more](https://clippium.pigeonposse.com/guide/toolkit/)
 - **Extra tools**: 
   - [Color](https://clippium.pigeonposse.com/guide/color/): Add color support to your text _(with browser support)_.
   - [i18n](https://clippium.pigeonposse.com/guide/i18n/): Add **Internalization** to your **CLI** _(with browser support)_.
   - [Updater](https://clippium.pigeonposse.com/guide/updater/): Add updater notification to your **CLI**.

## Usage

### Simple usage

```js
import { Clippium } from 'clippium'

const cli = new Clippium( data )
cli.fn = async data => {
  // do something
}
await cli.run( process.argv.slice( 2 ) )
```

### Module usage example

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
