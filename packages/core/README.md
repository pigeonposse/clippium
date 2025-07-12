# Clippium

[![Web](https://img.shields.io/badge/Web-grey?style=for-the-badge&logoColor=white)](https://pigeonposse.com)
[![About Us](https://img.shields.io/badge/About%20Us-grey?style=for-the-badge&logoColor=white)](https://pigeonposse.com/about)
[![Donate](https://img.shields.io/badge/Donate-pink?style=for-the-badge&logoColor=white)](https://pigeonposse.com/contribute)
[![Twitter](https://img.shields.io/badge/Twitter-black?style=for-the-badge&logoColor=white&logo=twitter)](https://twitter.com/pigeonposse_)
[![Instagram](https://img.shields.io/badge/Instagram-black?style=for-the-badge&logoColor=white&logo=instagram)](https://www.instagram.com/pigeon.posse/)
[![Medium](https://img.shields.io/badge/Medium-black?style=for-the-badge&logoColor=white&logo=medium)](https://medium.com/@pigeonposse)

[![BANNER](https://github.com/pigeonposse/clippium/blob/main/docs/public/banner.png?raw=true)](https://clippium.pigeonposse.com/guide/core)

[![License](https://img.shields.io/github/license/pigeonposse/clippium?style=for-the-badge&color=green&logoColor=white)](/LICENSE)
[![Version](https://img.shields.io/npm/v/clippium?style=for-the-badge&color=blue&label=Version)](https://www.npmjs.com/package/clippium)
[![NPM package minimized gzipped size](https://img.shields.io/bundlejs/size/clippium?style=for-the-badge&color=orange&label=Minimized+size&logoColor=white)](https://www.npmjs.com/package/clippium)
[![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/clippium/0.0.4?style=for-the-badge&color=orange&logoColor=white)](https://www.npmjs.com/package/clippium)

Command Line Interface with Powerful and Pristine Operations

## Table of contents

- [What is clippium?](#what-is-clippium)
- [Features](#features)
- [Usage](#usage)
  - [Simple usage](#simple-usage)
  - [Module usage example](#module-usage-example)
- [🔑 Installation](#-installation)
- [➕ More](#-more)
- [👨‍💻 Development](#-development)
- [❤️ Donate](#-donate)
- [📜 License](#-license)
- [✨ About us](#-about-us)


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



## 🔑 Installation

```bash 
npm install clippium
# or
pnpm install clippium
# or
yarn add clippium
# or
bun add clippium
# or
deno add clippium
```

## ➕ More

- 🌞 [Core](https://clippium.pigeonposse.com/guide/core)
- 📝 [Schema](https://clippium.pigeonposse.com/guide/schema)
- 🧰 [Toolkit](https://clippium.pigeonposse.com/guide/toolkit)
- 🎨 [Color](https://clippium.pigeonposse.com/guide/color)
- 🌐 [I18n](https://clippium.pigeonposse.com/guide/i18n)
- 📦 [Updater](https://clippium.pigeonposse.com/guide/updater)
- 💾 [Preset](https://clippium.pigeonposse.com/guide/preset)
  - 🖼️ [Colored](https://clippium.pigeonposse.com/guide/preset/colored)
  - ⚙️ [Config](https://clippium.pigeonposse.com/guide/preset/config)
  - ➡️ [Default](https://clippium.pigeonposse.com/guide/preset/default)


---

## 👨‍💻 Development

__clippium__ is an open-source project and its development is open to anyone who wants to participate.

[![Issues](https://img.shields.io/badge/Issues-grey?style=for-the-badge)](https://github.com/pigeonposse/clippium/issues)
[![Pull requests](https://img.shields.io/badge/Pulls-grey?style=for-the-badge)](https://github.com/pigeonposse/clippium/pulls)
[![Read more](https://img.shields.io/badge/Read%20more-grey?style=for-the-badge)](https://clippium.pigeonposse.com)

## ❤️ Donate

Help us to develop more interesting things.

[![Donate](https://img.shields.io/badge/Donate-grey?style=for-the-badge)](https://pigeonposse.com/contribute)

## 📜 License

This software is licensed with __[MIT](https://github.com/pigeonposse/clippium/blob/main/LICENSE)__.

[![Read more](https://img.shields.io/badge/Read-more-grey?style=for-the-badge)](https://github.com/pigeonposse/clippium/blob/main/LICENSE)

## ✨ About us

*PigeonPosse* is a __code development collective__ focused on creating practical and interesting tools that help developers and users enjoy a more agile and comfortable experience. Our projects cover various programming sectors and we do not have a thematic limitation in terms of projects.

[![More](https://img.shields.io/badge/Read-more-grey?style=for-the-badge)](https://github.com/pigeonposse)


## Contributors

|   | Name | Role |
| ----- | ---- | ---- |
| ![Angelo](https://github.com/angelespejo.png?size=72) | [Angelo](https://github.com/angelespejo) | 👑 Author |
| ![PigeonPosse](https://github.com/pigeonposse.png?size=72) | [PigeonPosse](https://github.com/pigeonposse) | 🏢 Organization |

---

[![Web](https://img.shields.io/badge/Web-grey?style=for-the-badge&logoColor=white)](https://pigeonposse.com)
[![About Us](https://img.shields.io/badge/About%20Us-grey?style=for-the-badge&logoColor=white)](https://pigeonposse.com/about)
[![Donate](https://img.shields.io/badge/Donate-pink?style=for-the-badge&logoColor=white)](https://pigeonposse.com/contribute)
[![Twitter](https://img.shields.io/badge/Twitter-black?style=for-the-badge&logoColor=white&logo=twitter)](https://twitter.com/pigeonposse_)
[![Instagram](https://img.shields.io/badge/Instagram-black?style=for-the-badge&logoColor=white&logo=instagram)](https://www.instagram.com/pigeon.posse/)
[![Medium](https://img.shields.io/badge/Medium-black?style=for-the-badge&logoColor=white&logo=medium)](https://medium.com/@pigeonposse)

<!--

██████╗ ██╗ ██████╗ ███████╗ ██████╗ ███╗   ██╗██████╗  ██████╗ ███████╗███████╗███████╗
██╔══██╗██║██╔════╝ ██╔════╝██╔═══██╗████╗  ██║██╔══██╗██╔═══██╗██╔════╝██╔════╝██╔════╝
██████╔╝██║██║  ███╗█████╗  ██║   ██║██╔██╗ ██║██████╔╝██║   ██║███████╗███████╗█████╗  
██╔═══╝ ██║██║   ██║██╔══╝  ██║   ██║██║╚██╗██║██╔═══╝ ██║   ██║╚════██║╚════██║██╔══╝  
██║     ██║╚██████╔╝███████╗╚██████╔╝██║ ╚████║██║     ╚██████╔╝███████║███████║███████╗
╚═╝     ╚═╝ ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝      ╚═════╝ ╚══════╝╚══════╝╚══════╝
█████╗█████╗█████╗█████╗█████╗█████╗█████╗█████╗█████╗                                  
╚════╝╚════╝╚════╝╚════╝╚════╝╚════╝╚════╝╚════╝╚════╝                                  
 ██████╗██╗     ██╗██████╗ ██████╗ ██╗██╗   ██╗███╗   ███╗                              
██╔════╝██║     ██║██╔══██╗██╔══██╗██║██║   ██║████╗ ████║                              
██║     ██║     ██║██████╔╝██████╔╝██║██║   ██║██╔████╔██║                              
██║     ██║     ██║██╔═══╝ ██╔═══╝ ██║██║   ██║██║╚██╔╝██║                              
╚██████╗███████╗██║██║     ██║     ██║╚██████╔╝██║ ╚═╝ ██║                              
 ╚═════╝╚══════╝╚═╝╚═╝     ╚═╝     ╚═╝ ╚═════╝ ╚═╝     ╚═╝                              

- Author: [Angelo](https://github.com/angelespejo)



-->

