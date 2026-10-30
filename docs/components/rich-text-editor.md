# RichTextEditor

Self-contained custom control — see
[architecture.md](../architecture.md#4-self-contained-custom-control). Shopify's Polaris web
component catalog has no rich-text element, so this ships a Shopify-admin-style editor chrome
(subdued toolbar, bordered shell, Paragraph/H1–H6/blockquote, formatting, alignment, link/image/
video/table inserts, more menu, HTML source toggle) on top of a `contentEditable` surface.
Formatting uses the browser Selection / `document.execCommand` APIs — no TipTap, Quill, or
ProseMirror dependency.

```tsx
import { RichTextEditor } from "@xco-agency/corex-ui";

const [html, setHtml] = useState("<p>Hello</p>");

<RichTextEditor
  label="Description"
  value={html}
  onChange={setHtml}
  placeholder="Start typing…"
  minHeight="220px"
/>;
```

## Props

| Prop           | Behavior                                                                 |
| -------------- | ------------------------------------------------------------------------ |
| `value`        | Controlled HTML string.                                                  |
| `defaultValue` | Uncontrolled initial HTML.                                               |
| `onChange`     | Called with the current HTML on every content change.                    |
| `label`        | Visible label above the editor; also used as the accessible name.        |
| `labelHidden`  | Hides the visible label while keeping `aria-labelledby` when `label` set.|
| `placeholder`  | Shown when the surface is empty.                                         |
| `disabled`     | Disables editing and toolbar actions.                                    |
| `minHeight`    | Minimum height of the editing surface. Default `"160px"`.                |
| `id` / `name`  | Surface id and optional form field name (hidden input when not in code view). |

## Toolbar

- **Block type** — Paragraph, Heading 1–6, Blockquote
- **Inline** — Bold, Italic, Underline, text color swatches
- **Alignment** — Left, Center, Right, Justify
- **Insert** — Link and image URL modals, video embed modal (iframe snippet), table sizes
- **More** — Bulleted/numbered lists, strikethrough, clear formatting
- **Code** — Toggle raw HTML source view

## Caveat

`document.execCommand` is deprecated but remains the leanest path that keeps `@xco-agency/corex-ui`
dependency-free. Behavior can vary slightly across browsers; prefer controlled `value`/`onChange`
and sanitize HTML server-side before rendering merchant-facing content.
