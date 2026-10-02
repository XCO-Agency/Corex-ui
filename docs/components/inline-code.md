# InlineCode

A snippet of code inside a sentence.

```tsx
import { InlineCode, Text } from "@xco-agency/corex-ui";

<Text>
  Run <InlineCode>pnpm dev</InlineCode> to start the app.
</Text>;
```

A real `code` element rather than a `Text`, because the monospace face and the tinted
surface are the component and `s-text` offers neither. The colours are Polaris
variables with plain fallbacks, so it still reads correctly outside an embedded admin
session. Pass `style` to override anything, such as `whiteSpace` for a snippet that
should wrap.
