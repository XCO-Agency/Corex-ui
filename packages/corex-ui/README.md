# @xco-agency/corex-ui

Legacy-`@shopify/polaris`-compatible React components, backed by Shopify's actively-maintained
Polaris web components (`s-*` custom elements). Swap your import source, keep your prop names.

```diff
-import { Button, Card } from "@shopify/polaris";
+import { Button, Card } from "@xco-agency/corex-ui";
```

## Install

```sh
npm install @xco-agency/corex-ui
npm install --save-dev @shopify/polaris-types # optional, recommended
```

Your app must load Shopify's Polaris web components CDN script (Shopify CLI-scaffolded apps
already do this):

```html
<script src="https://cdn.shopify.com/shopifycloud/polaris-1.js"></script>
```

`@xco-agency/corex-ui` has no runtime dependency on Polaris — that CDN script is what actually
registers the `s-*` elements; this package only provides the React wrapper layer.

## Usage

```tsx
import { Page, Card, TextField, Button } from "@xco-agency/corex-ui";

function ProductForm() {
  const [title, setTitle] = useState("");

  return (
    <Page title="New product">
      <Card>
        <TextField label="Title" value={title} onChange={setTitle} />
        <Button primary onClick={save}>
          Save
        </Button>
      </Card>
    </Page>
  );
}
```

## Components in this release

`Button`, `ButtonGroup`, `Text`, `Badge`, `Banner`, `Box`, `BlockStack`, `InlineStack`, `Card`,
`Modal`, `TextField`, `Select`, `Checkbox`, `Spinner`, `Page`, `Tabs`, `Link`, `Icon`, `Divider`,
`Avatar`, `Thumbnail`, `Tooltip`, `ChoiceList`, `DateField`, `DatePicker`, `Menu`.

Plus the [App Bridge](../../docs/app-bridge.md) subsystem: `AppWindow`, `AppNav`, `SaveBar`,
`useToast`, `useSaveBar`.

Each has a dedicated doc page under [`docs/components/`](../../docs/components/) with a full
legacy-prop-to-new-prop mapping table. See [`docs/component-coverage.md`](../../docs/component-coverage.md)
for what's not yet covered. More components are added incrementally — see
[`docs/architecture.md`](../../docs/architecture.md#adding-a-new-component) for the pattern.

## Documentation

- [Architecture](../../docs/architecture.md) — how the wrapper layer is built, and how to add components.
- [Migration guide](../../docs/migration-guide.md) — moving an app off `@shopify/polaris`.
- [Component docs](../../docs/components/) — one page per component.
- [Component coverage](../../docs/component-coverage.md) — full audit against Polaris's web component catalog.
- [App Bridge](../../docs/app-bridge.md) — `AppWindow`, `AppNav`, `SaveBar`, `useToast`, `useSaveBar`.

## Development

This package lives in a pnpm workspace alongside `apps/playground`, a Vite app used to manually
exercise every component against the real Polaris CDN script. It has a category-grouped
sidebar, an overview page listing every available component, and a detail page per component
with a live example next to its copyable source code.

```sh
pnpm install
pnpm --filter @xco-agency/corex-ui test        # Vitest unit tests (prop/event mapping)
pnpm --filter @xco-agency/corex-ui typecheck
pnpm --filter @xco-agency/corex-ui build       # tsup -> dist/ (ESM + CJS + .d.ts)
pnpm --filter playground dev            # manual QA app, http://localhost:5173
```
