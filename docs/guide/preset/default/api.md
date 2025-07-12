# `@clippium/preset-default` - API documentation

## Functions

### default()

```ts
function default(config?: Config): Clippium<{
  flags: {
     help: {
        alias: string[];
        desc: 'Show help';
        group: undefined | string;
        type: 'boolean';
       };
     version: {
        alias: string[];
        desc: 'Show version';
        group: undefined | string;
        type: 'boolean';
       };
    };
}>
```

A preset to add help and version flags to a clippium app

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config`? | `Config` | The config options |

#### Returns

`Clippium`\<\{
  `flags`: \{
     `help`: \{
        `alias`: `string`[];
        `desc`: `'Show help'`;
        `group`: `undefined` \| `string`;
        `type`: `'boolean'`;
       \};
     `version`: \{
        `alias`: `string`[];
        `desc`: `'Show version'`;
        `group`: `undefined` \| `string`;
        `type`: `'boolean'`;
       \};
    \};
 \}\>

- The modified clippium app

| Name | Type | Default value |
| ------ | ------ | ------ |
| `flags` | \{ `help`: \{ `alias`: `string`[]; `desc`: `'Show help'`; `group`: `undefined` \| `string`; `type`: `'boolean'`; \}; `version`: \{ `alias`: `string`[]; `desc`: `'Show version'`; `group`: `undefined` \| `string`; `type`: `'boolean'`; \}; \} | - |
| `flags.help`? | \{ `alias`: `string`[]; `desc`: `'Show help'`; `group`: `undefined` \| `string`; `type`: `'boolean'`; \} | - |
| `flags.help.alias` | `string`[] | - |
| `flags.help.desc` | `string` | 'Show help' |
| `flags.help.group` | `undefined` \| `string` | - |
| `flags.help.type` | `"boolean"` | 'boolean' |
| `flags.version`? | \{ `alias`: `string`[]; `desc`: `'Show version'`; `group`: `undefined` \| `string`; `type`: `'boolean'`; \} | - |
| `flags.version.alias` | `string`[] | - |
| `flags.version.desc` | `string` | 'Show version' |
| `flags.version.group` | `undefined` \| `string` | - |
| `flags.version.type` | `"boolean"` | 'boolean' |

#### Example

```ts
import presetDefault from '@clippium/preset-default'
import {Clippium} from 'clippium'
const preset = presetDefault(config)
const cli = new Clippium({
   flags: preset.data.flags
})
cli.fn = async data => {
  await preset.data.fn(data)
}

export default cli
```

***

### getData()

```ts
function getData(config?: Config): {
  flags: {
     help: {
        alias: string[];
        desc: 'Show help';
        group: undefined | string;
        type: 'boolean';
       };
     version: {
        alias: string[];
        desc: 'Show version';
        group: undefined | string;
        type: 'boolean';
       };
    };
}
```

Get a clippium Data with help and version flags

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config`? | `Config` | The config options |

#### Returns

```ts
{
  flags: {
     help: {
        alias: string[];
        desc: 'Show help';
        group: undefined | string;
        type: 'boolean';
       };
     version: {
        alias: string[];
        desc: 'Show version';
        group: undefined | string;
        type: 'boolean';
       };
    };
}
```

- The created clippium config

| Name | Type | Default value |
| ------ | ------ | ------ |
| `flags` | \{ `help`: \{ `alias`: `string`[]; `desc`: `'Show help'`; `group`: `undefined` \| `string`; `type`: `'boolean'`; \}; `version`: \{ `alias`: `string`[]; `desc`: `'Show version'`; `group`: `undefined` \| `string`; `type`: `'boolean'`; \}; \} | - |
| `flags.help`? | \{ `alias`: `string`[]; `desc`: `'Show help'`; `group`: `undefined` \| `string`; `type`: `'boolean'`; \} | - |
| `flags.help.alias` | `string`[] | - |
| `flags.help.desc` | `string` | 'Show help' |
| `flags.help.group` | `undefined` \| `string` | - |
| `flags.help.type` | `"boolean"` | 'boolean' |
| `flags.version`? | \{ `alias`: `string`[]; `desc`: `'Show version'`; `group`: `undefined` \| `string`; `type`: `'boolean'`; \} | - |
| `flags.version.alias` | `string`[] | - |
| `flags.version.desc` | `string` | 'Show version' |
| `flags.version.group` | `undefined` \| `string` | - |
| `flags.version.type` | `"boolean"` | 'boolean' |
