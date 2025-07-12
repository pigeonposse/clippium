# `clippium-toolkit` - API documentation

## Classes

### Converter\<Plugins\>

#### Type Parameters

| Type Parameter |
| ------ |
| `Plugins` *extends* \{\} |

#### Constructors

##### new Converter()

```ts
new Converter<Plugins>(plugins: Plugins, fnData: FnData<ClippiumData>): Converter<Plugins>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `plugins` | `Plugins` |
| `fnData` | `FnData`\<`ClippiumData`\> |

###### Returns

[`Converter`](#converterplugins)\<`Plugins`\>

#### Methods

##### fromData()

```ts
fromData(key: string): Promise<void>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

###### Returns

`Promise`\<`void`\>

##### toData()

```ts
toData(key: string): Promise<void>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

###### Returns

`Promise`\<`void`\>

##### toDataSchema()

```ts
toDataSchema(key: string): Promise<void>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

###### Returns

`Promise`\<`void`\>

***

### ESMFunctions

#### Implements

- `CreateInterface`

#### Constructors

##### new ESMFunctions()

```ts
new ESMFunctions(): ESMFunctions
```

###### Returns

[`ESMFunctions`](#esmfunctions)

#### Methods

##### convertToData()

```ts
convertToData(i: Input, opts?: {
  name: string;
}): Promise<ClippiumData>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `i` | `Input` |
| `opts`? | `object` |
| `opts.name`? | `string` |

###### Returns

`Promise`\<`ClippiumData`\>

###### Implementation of

`CreateInterface.convertToData`

***

### JSONSchemaGneneric

#### Implements

- `CreateInterface`

#### Constructors

##### new JSONSchemaGneneric()

```ts
new JSONSchemaGneneric(): JSONSchemaGneneric
```

###### Returns

[`JSONSchemaGneneric`](#jsonschemagneneric)

#### Methods

##### convertFromData()

```ts
convertFromData(input: ClippiumData, opts?: {
  output: string;
  type: SchemaType;
}): Promise<string>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | `ClippiumData` |
| `opts`? | `object` |
| `opts.output`? | `string` |
| `opts.type`? | `SchemaType` |

###### Returns

`Promise`\<`string`\>

###### Implementation of

`CreateInterface.convertFromData`

##### convertToData()

```ts
convertToData(i: Input): Promise<ClippiumData>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `i` | `Input` |

###### Returns

`Promise`\<`ClippiumData`\>

###### Implementation of

`CreateInterface.convertToData`

***

### Markdown

#### Constructors

##### new Markdown()

```ts
new Markdown(): Markdown
```

###### Returns

[`Markdown`](#markdown)

#### Methods

##### getDocs()

```ts
getDocs(input: ClippiumData, opts?: DocsConfig): Promise<string>
```

Retrieves and processes documentation data from the given ClippiumData input.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `ClippiumData` | The ClippiumData object that contains the documentation data. |
| `opts`? | `DocsConfig` | Optional configuration for the documentation. |

###### Returns

`Promise`\<`string`\>

A promise that resolves to a string representing the processed documentation.

***

### OpenAPI

#### Implements

- `CreateInterface`

#### Constructors

##### new OpenAPI()

```ts
new OpenAPI(): OpenAPI
```

###### Returns

[`OpenAPI`](#openapi)

#### Methods

##### convertFromData()

```ts
convertFromData(_input: ClippiumData): Promise<string>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `_input` | `ClippiumData` |

###### Returns

`Promise`\<`string`\>

###### Implementation of

`CreateInterface.convertFromData`

##### convertToData()

```ts
convertToData(i: Input, opts?: ParserOptions): Promise<ClippiumData>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `i` | `Input` |
| `opts`? | `ParserOptions` |

###### Returns

`Promise`\<`ClippiumData`\>

###### Implementation of

`CreateInterface.convertToData`

##### validate()

```ts
validate(i: any): Promise<JSONSchema7>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `i` | `any` |

###### Returns

`Promise`\<`JSONSchema7`\>

***

### TypeScript

#### Implements

- `CreateInterface`

#### Constructors

##### new TypeScript()

```ts
new TypeScript(): TypeScript
```

###### Returns

[`TypeScript`](#typescript)

#### Methods

##### convertFromData()

```ts
convertFromData(i: ClippiumData, opts: {
  asConst: boolean;
  type: string;
}): Promise<string>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `i` | `ClippiumData` |
| `opts` | `object` |
| `opts.asConst`? | `boolean` |
| `opts.type`? | `string` |

###### Returns

`Promise`\<`string`\>

###### Implementation of

`CreateInterface.convertFromData`

##### convertToData()

```ts
convertToData(i: Input, opts: {
  tsconfig: string;
  type: string;
}): Promise<ClippiumData>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `i` | `Input` |
| `opts` | `object` |
| `opts.tsconfig`? | `string` |
| `opts.type` | `string` |

###### Returns

`Promise`\<`ClippiumData`\>

###### Implementation of

`CreateInterface.convertToData`

## Functions

### createPlugin()

```ts
function createPlugin<To, From, Docs>(plugin: Plugin<To, From, Docs>): Plugin<To, From, Docs>
```

#### Type Parameters

| Type Parameter |
| ------ |
| `To` *extends* `undefined` \| `Flags$1` |
| `From` *extends* `undefined` \| `Flags$1` |
| `Docs` *extends* `undefined` \| `Flags$1` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `plugin` | [`Plugin`](#pluginto-from-docs)\<`To`, `From`, `Docs`\> |

#### Returns

[`Plugin`](#pluginto-from-docs)\<`To`, `From`, `Docs`\>

***

### defineConfig()

```ts
function defineConfig<C>(config: C): C
```

Defines and returns the provided configuration object.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `C` *extends* [`Config`](#config) | Must extend from Config. |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | `C` | The configuration object to define. |

#### Returns

`C`

- Returns the provided configuration object.

***

### run()

```ts
function run(args: string[]): Promise<void>
```

The main function to run the CLI.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `string`[] | The argument vector array. |

#### Returns

`Promise`\<`void`\>

- Resolves when the function has finished.

## Type Aliases

### AnyPlugin

```ts
type AnyPlugin: Plugin<Any, Any, Any>;
```

***

### Config

```ts
type Config: {
  plugin: Plugins;
};
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `plugin` | [`Plugins`](#plugins) | Set plugins for clippium toolkit |

***

### Plugin\<To, From, Docs\>

```ts
type Plugin<To, From, Docs>: {
  convert: {
     fromData: {
        examples: ClippiumData["examples"];
        flags: From;
        fn: (utils: PluginUtils<From> & {
           input: ClippiumData;
          }) => Promise<string>;
       };
     toData: {
        examples: ClippiumData["examples"];
        flags: To;
        fn: (utils: PluginUtils<To> & {
           input: string;
          }) => Promise<ClippiumData>;
       };
    };
  desc: string;
  docs: {
     examples: ClippiumData["examples"];
     flags: Docs;
     fn: (utils: PluginUtils<Docs> & {
        input: ClippiumData;
       }) => Promise<string>;
    };
};
```

#### Type Parameters

| Type Parameter |
| ------ |
| `To` *extends* `ClippiumData`\[`"flags"`\] |
| `From` *extends* `ClippiumData`\[`"flags"`\] |
| `Docs` *extends* `ClippiumData`\[`"flags"`\] |

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `convert`? | \{ `fromData`: \{ `examples`: `ClippiumData`\[`"examples"`\]; `flags`: `From`; `fn`: (`utils`: `PluginUtils`\<`From`\> & \{ `input`: `ClippiumData`; \}) => `Promise`\<`string`\>; \}; `toData`: \{ `examples`: `ClippiumData`\[`"examples"`\]; `flags`: `To`; `fn`: (`utils`: `PluginUtils`\<`To`\> & \{ `input`: `string`; \}) => `Promise`\<`ClippiumData`\>; \}; \} | Convert function for plugin |
| `convert.fromData`? | \{ `examples`: `ClippiumData`\[`"examples"`\]; `flags`: `From`; `fn`: (`utils`: `PluginUtils`\<`From`\> & \{ `input`: `ClippiumData`; \}) => `Promise`\<`string`\>; \} | - |
| `convert.fromData.examples`? | `ClippiumData`\[`"examples"`\] | Add usage examples for the plugin command |
| `convert.fromData.flags`? | `From` | Add custom flags for use in plugin command |
| `convert.fromData.fn` | (`utils`: `PluginUtils`\<`From`\> & \{ `input`: `ClippiumData`; \}) => `Promise`\<`string`\> | - |
| `convert.toData`? | \{ `examples`: `ClippiumData`\[`"examples"`\]; `flags`: `To`; `fn`: (`utils`: `PluginUtils`\<`To`\> & \{ `input`: `string`; \}) => `Promise`\<`ClippiumData`\>; \} | - |
| `convert.toData.examples`? | `ClippiumData`\[`"examples"`\] | Add usage examples for the plugin command |
| `convert.toData.flags`? | `To` | Add custom flags for use in plugin command |
| `convert.toData.fn` | (`utils`: `PluginUtils`\<`To`\> & \{ `input`: `string`; \}) => `Promise`\<`ClippiumData`\> | - |
| `desc`? | `string` | Plugin description |
| `docs`? | \{ `examples`: `ClippiumData`\[`"examples"`\]; `flags`: `Docs`; `fn`: (`utils`: `PluginUtils`\<`Docs`\> & \{ `input`: `ClippiumData`; \}) => `Promise`\<`string`\>; \} | Docs function for plugin |
| `docs.examples`? | `ClippiumData`\[`"examples"`\] | Add usage examples for the plugin command |
| `docs.flags`? | `Docs` | Add custom flags for use in plugin command |
| `docs.fn` | (`utils`: `PluginUtils`\<`Docs`\> & \{ `input`: `ClippiumData`; \}) => `Promise`\<`string`\> | - |

***

### Plugins

```ts
type Plugins: Record<string, AnyPlugin>;
```

## Variables

### cli

```ts
const cli: Clippium<{
  commands: {
     convert: {
        desc: 'Transform input to and from "clippium data" based on multiple content types';
        examples: {
           desc: 'Convert from OpenAPI to clippium data';
           value: '$0 openapi to-data -i https://petstore.swagger.io/v2/swagger.json -o ./src/data.js';
          }[];
       };
     create: {
        commands: Record<string, Command>;
        deprecated: string | boolean;
        desc: string;
        examples: {
           desc: 'Show promp to create a new clippium CLI project';
           value: '$0';
          }[];
        flags: Flags$1;
        group: string;
        hidden: boolean;
        positionals: Positionals;
       };
     docs: {
        desc: 'Generate documentation from clippium data';
       };
    };
  flags: any;
  name: string;
  version: string;
}>;
```

#### Type declaration

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `commands` | \{ `convert`: \{ `desc`: `'Transform input to and from "clippium data" based on multiple content types'`; `examples`: \{ `desc`: `'Convert from OpenAPI to clippium data'`; `value`: `'$0 openapi to-data -i https://petstore.swagger.io/v2/swagger.json -o ./src/data.js'`; \}[]; \}; `create`: \{ `commands`: `Record`\<`string`, `Command`\>; `deprecated`: `string` \| `boolean`; `desc`: `string`; `examples`: \{ `desc`: `'Show promp to create a new clippium CLI project'`; `value`: `'$0'`; \}[]; `flags`: `Flags$1`; `group`: `string`; `hidden`: `boolean`; `positionals`: `Positionals`; \}; `docs`: \{ `desc`: `'Generate documentation from clippium data'`; \}; \} | - | - |
| `commands.convert` | \{ `desc`: `'Transform input to and from "clippium data" based on multiple content types'`; `examples`: \{ `desc`: `'Convert from OpenAPI to clippium data'`; `value`: `'$0 openapi to-data -i https://petstore.swagger.io/v2/swagger.json -o ./src/data.js'`; \}[]; \} | - | - |
| `commands.convert.desc` | `string` | 'Transform input to and from "clippium data" based on multiple content types' | - |
| `commands.convert.examples` | \{ `desc`: `'Convert from OpenAPI to clippium data'`; `value`: `'$0 openapi to-data -i https://petstore.swagger.io/v2/swagger.json -o ./src/data.js'`; \}[] | - | - |
| `commands.create` | \{ `commands`: `Record`\<`string`, `Command`\>; `deprecated`: `string` \| `boolean`; `desc`: `string`; `examples`: \{ `desc`: `'Show promp to create a new clippium CLI project'`; `value`: `'$0'`; \}[]; `flags`: `Flags$1`; `group`: `string`; `hidden`: `boolean`; `positionals`: `Positionals`; \} | - | - |
| `commands.create.commands`? | `Record`\<`string`, `Command`\> | - | Set commands |
| `commands.create.deprecated`? | `string` \| `boolean` | - | Set if the command/option is deprecated |
| `commands.create.desc` | `string` | - | Description of the command/option |
| `commands.create.examples` | \{ `desc`: `'Show promp to create a new clippium CLI project'`; `value`: `'$0'`; \}[] | - | - |
| `commands.create.flags`? | `Flags$1` | - | flags of the command |
| `commands.create.group`? | `string` | - | Group to which the command/option belongs |
| `commands.create.hidden`? | `boolean` | - | Set if the command/option is hidden |
| `commands.create.positionals`? | `Positionals` | - | positionals of the command |
| `commands.docs` | \{ `desc`: `'Generate documentation from clippium data'`; \} | - | - |
| `commands.docs.desc` | `string` | 'Generate documentation from clippium data' | - |
| `flags` | `any` | - | - |
| `name` | `string` | - | - |
| `version` | `string` | - | - |
