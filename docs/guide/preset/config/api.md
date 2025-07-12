# `@clippium/preset-config` - API documentation

## Functions

### default()

```ts
function default(config: GetDataConfig): <C>(data: ClippiumFnParameters<C>) => Promise<{
  data: {
     content: ConfigFileData | {
        commands: C extends {
           commands: ...;
          } ? { [K in (...)]: (...) } : never;
        flags: C extends {
           flags: ...;
          } ? { [K in (...)]: (...) } : never;
        positionals: C extends {
           positionals: ...;
          } ? { [K in (...)]: (...) } : never;
       };
     parsed: ClippiumParsedArgv<C>;
    } & Omit<GetDataResult<ConfigFileData>, "value">;
  value: {
     commands: { [K in string | number | symbol]: UnionToIntersection<InferCommandsArray<C> extends U[] ? U extends string ? { [k in string]?: (...) | (...) | (...) } : Object : Object>[K] };
     flags: { [K in string | number | symbol]: (InferFlags<C> & Object)[K] };
     positionals: { [K in string | number | symbol]: (InferPositionals<C> & Object)[K] };
    };
}>
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | `GetDataConfig` |

#### Returns

`Function`

##### Type Parameters

| Type Parameter |
| ------ |
| `C` *extends* `ClippiumData` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | `ClippiumFnParameters`\<`C`\> |

##### Returns

`Promise`\<\{
  `data`: \{
     `content`: [`ConfigFileData`](#configfiledata) \| \{
        `commands`: `C` *extends* \{
           `commands`: ...;
          \} ? `{ [K in (...)]: (...) }` : `never`;
        `flags`: `C` *extends* \{
           `flags`: ...;
          \} ? `{ [K in (...)]: (...) }` : `never`;
        `positionals`: `C` *extends* \{
           `positionals`: ...;
          \} ? `{ [K in (...)]: (...) }` : `never`;
       \};
     `parsed`: `ClippiumParsedArgv`\<`C`\>;
    \} & `Omit`\<`GetDataResult`\<[`ConfigFileData`](#configfiledata)\>, `"value"`\>;
  `value`: \{
     `commands`: \{ \[K in string \| number \| symbol\]: UnionToIntersection\<InferCommandsArray\<C\> extends U\[\] ? U extends string ? \{ \[k in string\]?: (...) \| (...) \| (...) \} : Object : Object\>\[K\] \};
     `flags`: \{ \[K in string \| number \| symbol\]: (InferFlags\<C\> & Object)\[K\] \};
     `positionals`: \{ \[K in string \| number \| symbol\]: (InferPositionals\<C\> & Object)\[K\] \};
    \};
 \}\>

| Name | Type | Description |
| ------ | ------ | ------ |
| `data`? | \{ `content`: [`ConfigFileData`](#configfiledata) \| \{ `commands`: `C` *extends* \{ `commands`: ...; \} ? `{ [K in (...)]: (...) }` : `never`; `flags`: `C` *extends* \{ `flags`: ...; \} ? `{ [K in (...)]: (...) }` : `never`; `positionals`: `C` *extends* \{ `positionals`: ...; \} ? `{ [K in (...)]: (...) }` : `never`; \}; `parsed`: `ClippiumParsedArgv`\<`C`\>; \} & `Omit`\<`GetDataResult`\<[`ConfigFileData`](#configfiledata)\>, `"value"`\> | Data from the config file |
| `value` | \{ `commands`: \{ \[K in string \| number \| symbol\]: UnionToIntersection\<InferCommandsArray\<C\> extends U\[\] ? U extends string ? \{ \[k in string\]?: (...) \| (...) \| (...) \} : Object : Object\>\[K\] \}; `flags`: \{ \[K in string \| number \| symbol\]: (InferFlags\<C\> & Object)\[K\] \}; `positionals`: \{ \[K in string \| number \| symbol\]: (InferPositionals\<C\> & Object)\[K\] \}; \} | Clippium parsed argv data from the config file and merged with the initial argv |
| `value.commands` | \{ \[K in string \| number \| symbol\]: UnionToIntersection\<InferCommandsArray\<C\> extends U\[\] ? U extends string ? \{ \[k in string\]?: (...) \| (...) \| (...) \} : Object : Object\>\[K\] \} | - |
| `value.flags` | \{ \[K in string \| number \| symbol\]: (InferFlags\<C\> & Object)\[K\] \} | - |
| `value.positionals` | \{ \[K in string \| number \| symbol\]: (InferPositionals\<C\> & Object)\[K\] \} | - |

## Type Aliases

### Config

```ts
type Config: GetDataConfig;
```

***

### ConfigFileData

```ts
type ConfigFileData: {
[key: string]: Any;   commands: {};
  flags: {};
  positionals: {};
};
```

#### Index Signature

 \[`key`: `string`\]: `Any`

#### Type declaration

| Name | Type |
| ------ | ------ |
| `commands`? | \{\} |
| `flags`? | \{\} |
| `positionals`? | \{\} |

***

### InferConfigFileData\<T\>

```ts
type InferConfigFileData<T>: Satisfies<ConfigFileData, Prettify<_InferConfigFileData<T>>>;
```

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `ClippiumData` |
