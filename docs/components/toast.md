# Toast

v12 rendered a Toast element inside a `Frame`. 2.x raises one through App Bridge, so
this component renders nothing and fires the platform's toast instead — call sites
keep mounting it conditionally, exactly as they did.

```tsx
import { Toast } from "@xco-agency/corex-ui";

{
  saved && <Toast content="Changes saved" onDismiss={() => setSaved(false)} />;
}
```

| Prop        | Behavior                                                                                                                                |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `content`   | Nothing is raised without it.                                                                                                           |
| `error`     | Raises it as App Bridge's error toast.                                                                                                  |
| `duration`  | Milliseconds the toast stays up.                                                                                                        |
| `onDismiss` | Fires once the toast has been raised. App Bridge gives no dismissal callback, and clearing local state is what call sites use this for. |
| `action`    | Ignored, and warns in development: App Bridge's toast has no action.                                                                    |

The toast only appears inside a real embedded admin session. Outside one — including
this repo's playground — [`useToast`](../architecture.md) no-ops with a development
warning rather than throwing. Prefer `useToast` directly in new code; this component
exists so migrated call sites keep working.
