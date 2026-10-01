# ResourceList

A list that renders each item through a callback, as v12 did.

```tsx
import { ResourceItem, ResourceList, Thumbnail } from "@xco-agency/corex-ui";

<ResourceList
  resourceName={{ singular: "product", plural: "products" }}
  items={products}
  emptyState={<EmptyState heading="No products yet" />}
  renderItem={(product, id) => (
    <ResourceItem
      id={id}
      url={`/products/${id}`}
      media={<Thumbnail source={product.image} alt="" />}
    >
      {product.title}
    </ResourceItem>
  )}
/>;
```

| Prop           | Behavior                                                                  |
| -------------- | ------------------------------------------------------------------------- |
| `renderItem`   | `(item, id, index)`. `id` falls back to the index when the item has none. |
| `emptyState`   | Replaces the whole list when there are no items.                          |
| `loading`      | Renders a `Spinner` in place of the list.                                 |
| `resourceName` | Names the list for assistive technology.                                  |
| `gap`          | Space between rows. Defaults to `none`, so rows sit flush as in v12.      |

`ResourceItem` is a [`Clickable`](./clickable.md): a link when given a `url` and a
button otherwise, so the row is one focusable control either way. `media` is rendered
ahead of the content. v12's `persistActions` and `shortcutActions` are not
reproduced — pass row actions in `children`.

Selection, sorting and bulk actions are deliberately absent:
[`IndexTable`](./index-table.md) is the component for a list that does those.
