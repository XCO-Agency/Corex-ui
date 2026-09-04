# AppNav

App Bridge component — see [app-bridge.md](../app-bridge.md#appnav). Thin wrapper over
`s-app-nav`, holding [`Link`](./link.md) children.

```tsx
import { AppNav, Link } from "@xco/corex-ui";

<AppNav>
  <Link url="/app" removeUnderline>
    Home
  </Link>
  <Link url="/app/settings">Settings</Link>
</AppNav>;
```
