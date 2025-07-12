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
parse(argv: Argv): ParserRes<C>
```

Parse the given Argv and return the parsed data.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `argv` | `Argv` | Argv array |

###### Returns

`ParserRes`\<`C`\>

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
function getHelp(opts: {
  argv: Argv;
  config: ClippiumConfig;
  data: ClippiumData;
 }): string
```

Generate help string based on the given ClippiumData and Argv.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts` | `object` | Options |
| `opts.argv` | `Argv` | Argv array |
| `opts.config` | [`ClippiumConfig`](#clippiumconfig) | Options for the help formatter |
| `opts.data` | [`ClippiumData`](#clippiumdata) | ClippiumData containing information about the commands and flags |

#### Returns

`string`

- Help string

***

### hiddenBin()

```ts
function hiddenBin(args: Argv): string[]
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
const args = hiddenBin( process.argv )
```

***

### parse()

```ts
function parse<D>(opts: {
  argv: Argv;
  data: D;
}): ParserRes<D>
```

Parse the given Argv and return the parsed data.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `D` *extends* [`ClippiumData`](#clippiumdata) | extends ClippiumData |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts` | `object` | Options |
| `opts.argv` | `Argv` | Argv array |
| `opts.data` | `D` | ClippiumData containing information about the commands and flags |

#### Returns

`ParserRes`\<`D`\>

- Parsed data

## Type Aliases

### ClippiumConfig

```ts
type ClippiumConfig: {
  help: PartialDeep<HelpConfig>;
};
```

#### Type declaration

| Name | Type |
| ------ | ------ |
| `help`? | `PartialDeep`\<`HelpConfig`\> |

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

### ParsedDataArgv\<T\>

```ts
type ParsedDataArgv<T>: {
  commands: InferCommands<T>;
  flags: Prettify<InferFlags<T> & {}>;
  positionals: Prettify<InferPositionals<T> & {}>;
};
```

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`ClippiumData`](#clippiumdata) |

#### Type declaration

| Name | Type |
| ------ | ------ |
| `commands` | `InferCommands`\<`T`\> |
| `flags` | `Prettify`\<`InferFlags`\<`T`\> & \{\}\> |
| `positionals` | `Prettify`\<[`InferPositionals`](#inferpositionalst)\<`T`\> & \{\}\> |
