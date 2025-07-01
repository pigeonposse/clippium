# `clippium` - API documentation

## Classes

### Clippium\<C\>

#### Type Parameters

| Type Parameter |
| ------ |
| `C` *extends* [`ClippiumData`](#clippiumdata) |

#### Constructors

##### new Clippium()

```ts
new Clippium<C>(data: C, config: ClippiumConfig): Clippium<C>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | `C` |
| `config` | [`ClippiumConfig`](#clippiumconfig) |

###### Returns

[`Clippium`](#clippiumc)\<`C`\>

#### Methods

##### help()

```ts
help(argv: Argv): string
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `argv` | `Argv` |

###### Returns

`string`

##### run()

```ts
run(argv: Argv): Promise<void>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `argv` | `Argv` |

###### Returns

`Promise`\<`void`\>

##### version()

```ts
version(): undefined | string
```

###### Returns

`undefined` \| `string`

#### Properties

| Property | Type |
| ------ | ------ |
| `config` | [`ClippiumConfig`](#clippiumconfig) |
| `data` | `C` |
| `fn` | (`data`: `FnData`\<`C`\>) => `void` \| `Promise`\<`void`\> |
| `parser` | `ParserData`\<`C`\> |

## Functions

### defineData()

```ts
function defineData<C>(data: C): C
```

#### Type Parameters

| Type Parameter |
| ------ |
| `C` *extends* [`ClippiumData`](#clippiumdata) |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | `C` |

#### Returns

`C`

***

### hiddenBin()

```ts
function hiddenBin(args: Argv): string[]
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `Argv` |

#### Returns

`string`[]

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
  name: string;
  version: string;
 } & CommandOptions;
```

#### Type declaration

| Name | Type |
| ------ | ------ |
| `name`? | `string` |
| `version`? | `string` |

***

### InferFlag\<T\>

```ts
type InferFlag<T>: InferOption<T>;
```

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Option` |

***

### InferPosicional\<T\>

```ts
type InferPosicional<T>: InferOption<T>;
```

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Posicional` |
