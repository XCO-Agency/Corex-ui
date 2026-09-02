# Link

Thin wrapper over `s-link`.

```tsx
import { Link } from "@xco/corex-ui";

<Link url="https://example.com" external>
  View documentation
</Link>;
```

## Prop mapping

| Legacy prop | Behavior |
| --- | --- |
| `url` | Maps to `href`. |
| `external` | Adds `target="_blank"` and `rel="noopener noreferrer"`. |
| `onClick` | Bound to the native `click` event. |
| `monochrome`, `removeUnderline` | Passed straight through. |
