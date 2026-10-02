# useBreakpoints

v12's "is this a phone" hook, on [`useDimension`](./architecture.md) so it reports the
same breakpoints as `Grid`, `Layout` and `InlineGrid`: a layout that branches on this
and a grid that collapses change at the same width.

```tsx
import { useBreakpoints } from "@xco-agency/corex-ui";

const { mdUp } = useBreakpoints();

return mdUp ? <Table /> : <ResourceList items={items} renderItem={renderCard} />;
```

Returns `smUp`/`smDown`, `mdUp`/`mdDown` and `lgUp`/`lgDown`, against Polaris's
breakpoints (`sm` 490px, `md` 768px, `lg` 1040px). Polaris's `xl` has no equivalent in
that scale and is not reported.
