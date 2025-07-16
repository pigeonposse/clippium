# `@clippium/preset-colored` - API documentation

## Functions

### formatter()

```ts
function formatter(opts?: Config): (d: {
  data: ClippiumData;
  utils: HelpFormatter;
 }) => string
```

Formatter function that generates a formatted help output for a CLIPPIUM application.
It accepts an configuration for custom color functions to apply to the output.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts`? | `Config` | Optional configuration object to override default color functions. |

#### Returns

`Function`

A function that generates a formatted help output for a CLIPPIUM application.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `d` | `object` |
| `d.data` | `ClippiumData` |
| `d.utils` | `HelpFormatter` |

##### Returns

`string`

#### Example

```ts
import { Clippium } from 'clippium'
import color from '@clippium/color'
import { formatter } from '@clippium/preset-colored'

const cli = new Clippium({ }, help: { formatter: formatter({
	commands: color.cyan
}) } )
```
