# clippium-toolkit

ToolKit for working with clippium CLIs

## Setup

Execute:

::: code-group
```bash [npm]
npx clippium-toolkit 
```
```bash [pnpm]
pnpx install clippium-toolkit 
```
```bash [yarn]
yarn dlx clippium-toolkit 
```
```bash [bun]
bunx clippium-toolkit
```
```bash [deno]
deno run -A npm:clippium-toolkit 
```
:::

Install:

::: code-group
```bash [npm]
npm install clippium-toolkit
```
```bash [pnpm]
pnpm install clippium-toolkit
```
```bash [yarn]
yarn add clippium-toolkit
```
```bash [bun]
bun add clippium-toolkit
```
```bash [deno]
deno add clippium-toolkit
```
:::

## `docs` command

Create documentation for your **Clippium** command instantly.

```js
// src/clippium-data.ts
import { defineData } from 'clippium'

export default defineData( {
	// your data
})
```
```bash
clippium-toolkit docs -i src/clippium-data.ts -o docs/cli-api.md
# or
clippium-toolkit docs -i src/clippium-data.ts > docs/cli-api.md
```

## `convert` command

Convert to and from Clippium CLI data

```js
// src/clippium-data.ts
import { defineData } from 'clippium'

export default defineData( {
	// your data
})
```

### From data

Examples:

#### Convert a clippium data to json schema

```bash
clippium-toolkit convert schema from-data -i src/clippium-data.ts -o dist/schema.json
```

### to data

Examples:

#### Convert a json schema to clippium data

```bash
clippium-toolkit convert schema to-data -i src/schema.json -o src/clippium-data.ts
```

#### Convert a openapi schema to clippium data
```bash
clippium-toolkit convert openapi to-data -i https://petstore.swagger.io/v2/swagger.json -o ./src/data.js
```

#### Convert a typescript type to clippium data

```bash
clippium-toolkit convert type to-data -i ./my-type.ts -o ./clippium-data.ts --type MyType 
```

#### Convert a ESM (JS/TS) function to clippium data

```bash
clippium-toolkit convert esm to-data -i ./src/index.js -o ./clippium-data.ts
## or specify function exported
clippium-toolkit convert esm to-data -i /src/index.js -o ./clippium-data.ts --export add
```

## `create` command

```bash
clippium-toolkit create
```

## Plugins

Plugins are a way to extend the functionality of `clippium-toolkit`

Read API documentation for more information. [Read more](https://clippium.pigeonposse.com/guide/toolkit/api)

### Add plugin

```js
import myplugin from './my-plugin'

/**
 * @type {import('clippium-toolkit').Config}
 */
export default {
	plugins: {
		myPlugin: myplugin()
	}
}
```

or: 

```js
import { defineConfig } from 'clippium-toolkit'
import myplugin from './my-plugin'

export default defineConfig( {
	plugins: {
		myPlugin: myplugin()
	}
})
```

- [Read more](https://clippium.pigeonposse.com/guide/toolkit/api#defineConfig)

### Create a plugin

```js
import { createPlugin } from 'clippium-toolkit'

export default createPlugin( {
	desc: 'My Plugin description',
	// Add documentation command
	docs : {
		fn : async data => {
			// your code
			return ''
		}
	}
	// Add convert commands
	convert : {
		// your convert functions
	}
})
```

- [Read more](https://clippium.pigeonposse.com/guide/toolkit/api#createPlugin)

## Other uses

### Run cli as a library

```js
import { run } from 'clippium-toolkit'

run( process.argv.slice( 2 ) )
```

### Run functions 
```js
import { Converter } from 'clippium-toolkit'

const converter = new Converter( {
	// your data
} )

await converter.toData( ... )

```

## ➕ More

- 📖 [API Docs](api.md)
- 📦 [NPM](https://www.npmjs.com/package/clippium-toolkit)
