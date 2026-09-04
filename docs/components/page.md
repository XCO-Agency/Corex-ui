# Page

Composed pattern: top-level layout wrapper over `s-page`. `primaryAction`/`secondaryActions`
follow the same `Button`-composition convention as [`Modal`](./modal.md). See
[architecture.md](../architecture.md#3-composed--imperative-bridge).

```tsx
import { Page, Button } from "@xco-agency/corex-ui";

<Page
  heading="Products"
  subheading="Manage your catalog"
  inlineSize="large"
  primaryAction={{ content: "Add product", onAction: openCreateModal }}
  secondaryActions={[
    { content: "Export", onAction: handleExport },
    <Button key="import" variant="secondary">
      Import
    </Button>,
  ]}
  breadcrumbActions={<a href="/admin">Back to Dashboard</a>}
  aside={<div>Sidebar content</div>}
>
  {/* Page content */}
</Page>;
```

## Native `s-page` Props

| Prop                | Type                                                         | Description                                                                                             |
| ------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `heading`           | `string`                                                     | The main page heading.                                                                                  |
| `subheading`        | `string`                                                     | The text to be used as subtitle.                                                                        |
| `inlineSize`        | `"base" \| "large" \| "small"`                               | Controls the max layout width (`base`: standard, `large`: full-width, `small`: narrow / single-column). |
| `id`                | `string`                                                     | Unique identifier for the element.                                                                      |
| `children`          | `ReactNode`                                                  | The main content of the page.                                                                           |
| `aside`             | `ReactNode`                                                  | Supplementary content displayed in a sidebar alongside the main content (`slot="aside"`).               |
| `accessory`         | `ReactNode`                                                  | Additional contextual status/information displayed in the header (`slot="accessory"`).                  |
| `breadcrumbActions` | `ReactNode`                                                  | Navigation links rendered in the page header (`slot="breadcrumb-actions"`).                             |
| `primaryAction`     | `PagePrimaryActionType \| ReactNode`                         | Rendered into `slot="primary-action"`. Accepts action descriptor or a React component.                  |
| `secondaryActions`  | `(PageMenuActionDescriptorType \| ReactNode)[] \| ReactNode` | Rendered into `slot="secondary-actions"`.                                                               |

## Legacy Polaris Prop Mapping (`@deprecated`)

| Legacy prop                   | Status        | Recommended replacement & Behavior                                                                                |
| ----------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------- |
| `title`                       | `@deprecated` | Use `heading`. Automatically forwarded to `heading` if `heading` is not specified.                                |
| `subtitle`                    | `@deprecated` | Use `subheading`. Automatically forwarded to `subheading` if `subheading` is not specified.                       |
| `fullWidth`                   | `@deprecated` | Use `inlineSize="large"`. Sets `inlineSize="large"` when `true`.                                                  |
| `narrowWidth`                 | `@deprecated` | Use `inlineSize="small"`. Sets `inlineSize="small"` when `true`.                                                  |
| `backAction`                  | `@deprecated` | Use `breadcrumbActions`. Automatically rendered as a `Link` targeting `slot="breadcrumb-actions"`.                |
| `titleMetadata`               | `@deprecated` | Use `accessory` or render inside page body. Rendered into `slot="accessory"` if `accessory` is omitted.           |
| `additionalMetadata`          | `@deprecated` | Use `accessory` or render inside page body. Rendered into `slot="accessory"` if `accessory` is omitted.           |
| `primaryAction`               | Supported     | Accepts legacy action descriptor objects (e.g. `{ content, onAction, destructive, disabled }`) or React elements. |
| `secondaryActions`            | Supported     | Accepts array of legacy action descriptor objects or React elements.                                              |
| `actionGroups`                | `@deprecated` | Provide individual actions via `secondaryActions` or a custom header menu. Logs dev-mode warning.                 |
| `pagination`                  | `@deprecated` | Render pagination controls directly inside the page body. Logs dev-mode warning.                                  |
| `titleHidden`                 | `@deprecated` | Visually hiding titles is not supported on `s-page`. Logs dev-mode warning.                                       |
| `pageReadyAccessibilityLabel` | `@deprecated` | Accessibility labels are handled differently on web components.                                                   |
| `filterActions`               | `@deprecated` | Filtering action lists is not supported on `s-page`.                                                              |
| `compactTitle`                | `@deprecated` | Spacing is managed automatically by `s-page`.                                                                     |
| `hasSubtitleMaxWidth`         | `@deprecated` | Subtitle max-width is managed automatically by `s-page`.                                                          |
| `onActionRollup`              | `@deprecated` | Action rollup is handled automatically by `s-page`.                                                               |
