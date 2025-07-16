# `clippium` - API documentation

## Classes

### Clippium\<C\>

The main class.
Used for create command line interfaces (CLIs).

#### Example

```ts
const cli = new Clippium( data )
cli.fn = async data => {
  // do something
}
await cli.run( process.argv.slice( 2 ) )
```

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `C` *extends* [`ClippiumData`](#clippiumdata) | Must extend from ClippiumData |

#### Constructors

##### new Clippium()

```ts
new Clippium<C>(data: C, config?: ClippiumConfig): Clippium<C>
```

Construct a new Clippium instance.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | `C` | ClippiumData containing information about the commands and flags |
| `config`? | [`ClippiumConfig`](#clippiumconfig) | Clippium configuration options |

###### Returns

[`Clippium`](#clippiumc)\<`C`\>

#### Methods

##### getHelp()

```ts
getHelp(argv: Argv): string
```

Generate a help string based on the current Clippium data and provided arguments.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `argv` | `Argv` | The argument vector array. |

###### Returns

`string`

- The formatted help string.

##### getVersion()

```ts
getVersion(): undefined | string
```

Retrieve the version information from the Clippium data.

###### Returns

`undefined` \| `string`

- The version string, or undefined if not set.

##### parse()

```ts
parse(argv: Argv): Parsed<C>
```

Parse the given Argv and return the parsed data.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `argv` | `Argv` | Argv array |

###### Returns

[`Parsed`](#parsedd)\<`C`\>

- Parsed data

##### run()

```ts
run(argv: Argv): Promise<void>
```

Parse the given Argv and run the function with the parsed data.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `argv` | `Argv` | Argv array |

###### Returns

`Promise`\<`void`\>

- Resolves when the function has finished

##### validate()

```ts
validate(data: FnData<C>): ParsedWithValidation<C>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | `FnData`\<`C`\> |

###### Returns

`ParsedWithValidation`\<`C`\>

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| `config` | [`ClippiumConfig`](#clippiumconfig) | Clippium configuration options |
| `data` | `C` | ClippiumData containing information about the commands and flags |
| `fn` | (`data`: `FnData`\<`C`\>) => `void` \| `Promise`\<`void`\> | - |

## Functions

### defineData()

```ts
function defineData<C>(data: C): C
```

A type assertion function that allows you to define a ClippiumData object
with the correct type parameters.

#### Type Parameters

| Type Parameter |
| ------ |
| `C` *extends* [`ClippiumData`](#clippiumdata) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | `C` | The Clippium Data object |

#### Returns

`C`

- The Clippium Data object

#### Example

```ts
const data = defineData({
  name: 'my-cli',
  commands: {
    hello: {
      desc: 'Say hello',
      flags: {
        name: {
          type: 'string',
          desc: 'Your name',
        },
      },
    },
  },
})
```

***

### getHelp()

```ts
function getHelp<D>(opts: HelpOptions<D>): string
```

Generate help string based on the given ClippiumData and Argv.

#### Type Parameters

| Type Parameter |
| ------ |
| `D` *extends* [`ClippiumData`](#clippiumdata) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts` | `HelpOptions`\<`D`\> | Options |

#### Returns

`string`

- Help string

***

### hideBin()

```ts
function hideBin(args: Argv): string[]
```

Return the given Argv array, but without the first two elements which are generally
the node and script names.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `Argv` | Argv array |

#### Returns

`string`[]

- Argv array without the first two elements

#### Example

```ts
import process from 'node:process'
const args = hideBin( process.argv )
```

***

### parse()

```ts
function parse<D>(opts: ParseOptions<D>): Parsed<D>
```

Parse the given Argv and return the parsed data.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `D` *extends* [`ClippiumData`](#clippiumdata) | extends ClippiumData |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts` | `ParseOptions`\<`D`\> | Options |

#### Returns

[`Parsed`](#parsedd)\<`D`\>

- Parsed data

***

### parseAndValidate()

```ts
function parseAndValidate<D>(opts: ParseAndValidate<D>): ParsedWithValidation<D>
```

Parse the given Argv and validate the parsed data against the given ClippiumData.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `D` *extends* [`ClippiumData`](#clippiumdata) | extends ClippiumData |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts` | `ParseAndValidate`\<`D`\> | Options |

#### Returns

`ParsedWithValidation`\<`D`\>

- Result of the validation

#### Example

```ts
import { parseAndValidate, defineData, withValidation } from 'clippium'
import process from 'node:process'

const data = defineData( withValidation({ ... }) )
const argv = process.argv.slice( 2 )

const validated = parseAndValidate( { data, argv } )
```

***

### validate()

```ts
function validate<D>(opts: ValidateOptions<D>): ParsedWithValidation<D>
```

Validate the parsed data against the given ClippiumData.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `D` *extends* [`ClippiumData`](#clippiumdata) | extends ClippiumData |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts` | `ValidateOptions`\<`D`\> | Options |

#### Returns

`ParsedWithValidation`\<`D`\>

- Result of the validation

#### Example

```ts
import { parse, validate } from 'clippium'
import process from 'node:process'

const data = defineData( {...} )
const argv = process.argv.slice( 2 )
const parsed = parse( { data, argv } )
const validated = validate( { data, parsed } )
```

***

### withValidation()

```ts
function withValidation<C>(data: C): C
```

Return the same data, but with validation enabled.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `C` *extends* [`ClippiumData`](#clippiumdata) \| `WithValidation`\<[`ClippiumData`](#clippiumdata)\> | Must extend from ClippiumData |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | `C` | Clippium data |

#### Returns

`C`

- The same data, but with validation enabled

#### Example

```ts
import { withValidation, validate, parse } from 'clippium'

const cli = new Clippium( withValidation( data ) )

cli.fn = async data => {
    const {flags} = validate( data );
    if(flags.help) return console.log( data.utils.getHelp() )
}
export default cli
```

## Type Aliases

### ClippiumConfig

```ts
type ClippiumConfig: {
  error: {
     on: (data: {
        error: Error;
       }) => void;
    };
  help: PartialDeep<HelpConfig>;
  validate: ValidateSettings;
};
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `error`? | \{ `on`: (`data`: \{ `error`: `Error`; \}) => `void`; \} | Configuration for the error output |
| `error.on`? | (`data`: \{ `error`: `Error`; \}) => `void` | - |
| `help`? | `PartialDeep`\<`HelpConfig`\> | Configuration for the help output |
| `validate`? | `ValidateSettings` | Configuration for the validation process |

***

### ClippiumData

```ts
type ClippiumData: {
  desc: string;
  name: string;
  version: string;
 } & CommandOptions;
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `desc`? | `string` | Description of the CLI |
| `name`? | `string` | Name of the CLI |
| `version`? | `string` | Version of the CLI |

***

### InferFlag\<T\>

```ts
type InferFlag<T>: InferOption<T>;
```

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Flag` |

***

### InferPositional\<T\>

```ts
type InferPositional<T>: InferOption<T>;
```

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Positional` |

***

### InferPositionals\<T\>

```ts
type InferPositionals<T>: T["commands"] extends Record<string, ClippiumData> ? MergeIntersectingProps<_InferedPositionals<T>, UnionToIntersection<{ [K in keyof T["commands"]]: _InferedPositionals<T["commands"][K]> }[keyof T["commands"]]>> : _InferedPositionals<T>;
```

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`ClippiumData`](#clippiumdata) |

***

### Parsed\<D\>

```ts
type Parsed<D>: Prettify<ParsedData<D>> & {
  raw: ParsedArgv;
};
```

#### Type declaration

| Name | Type |
| ------ | ------ |
| `raw` | `ParsedArgv` |

#### Type Parameters

| Type Parameter |
| ------ |
| `D` *extends* [`ClippiumData`](#clippiumdata) |

***

### ParsedStrict\<T\>

```ts
type ParsedStrict<T>: StripIndexSignature<Parsed<T>>;
```

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`ClippiumData`](#clippiumdata) |
