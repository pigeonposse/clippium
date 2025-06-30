# `@clippium/updater` - API documentation

## Functions

### updater()

```ts
function updater(opts: UpdaterOptions): {
  notify: () => Promise<boolean>;
}
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | [`UpdaterOptions`](#updateroptions) |

#### Returns

```ts
{
  notify: () => Promise<boolean>;
}
```

| Name | Type |
| ------ | ------ |
| `notify` | () => `Promise`\<`boolean`\> |

## Type Aliases

### UpdaterOptions

```ts
type UpdaterOptions: {
  name: string;
  ttl: number;
  version: string;
};
```

#### Type declaration

| Name | Type |
| ------ | ------ |
| `name` | `string` |
| `ttl`? | `number` |
| `version` | `string` |
