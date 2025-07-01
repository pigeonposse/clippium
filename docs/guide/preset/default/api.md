# `@clippium/preset-default` - API documentation

## Functions

### default()

```ts
function default(config: Config): Clippium<{
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

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | `Config` |

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
