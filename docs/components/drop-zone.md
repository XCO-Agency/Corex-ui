# DropZone

Form control for drag-and-drop or browse uploads, over `s-drop-zone`.

```tsx
import { DropZone } from "@xco-agency/corex-ui";

<DropZone label="Attachments" accept="application/pdf" multiple onDrop={upload} />;
```

| Prop                             | Behavior                                                                                                                                    |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `onDrop`                         | v12's callback, called with the files the element accepted.                                                                                 |
| `onChange`                       | The element's own signal: a DOM `change` event, with the files on the element the way a native file input reports them. Both can be passed. |
| `onDropRejected`                 | The element's rejection signal.                                                                                                             |
| `multiple` / `allowMultiple`     | Either name works.                                                                                                                          |
| `required` / `requiredIndicator` | Either name works.                                                                                                                          |
| `helpText`                       | Rendered as the element's `details`.                                                                                                        |

v12's `onDrop` had a third argument, the rejected files. `s-drop-zone` reports only
what it accepted, so that argument is not offered rather than filled with a guess —
`onDropRejected` is the element's own signal for a rejection.

v12's `DropZone.FileUpload` placeholder has no equivalent: the element renders its own.
