# Image

Component for rendering responsive images. Wraps Polaris `<s-image>`.

```tsx
import { Image } from "@xco-agency/corex-ui";

<Image
  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
  alt="Red athletic sneaker"
  aspectRatio="16/9"
  objectFit="cover"
  borderRadius="base"
/>;
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | `string` | `undefined` | Image source URL. |
| `source` | `string` | `undefined` | Legacy Polaris alias for `src`. |
| `alt` | `string` | **required** | Alternative text describing the image for accessibility. |
| `aspectRatio` | `string \| number` | `undefined` | Aspect ratio constraint (e.g. `"16/9"`, `"1/1"`). |
| `objectFit` | `"cover" \| "contain" \| "fill" \| "none" \| "scale-down"` | `undefined` | Sizing behavior of image within its box. |
| `loading` | `"lazy" \| "eager"` | `undefined` | Image loading behavior. |
| `width` | `string \| number` | `undefined` | Explicit width. |
| `height` | `string \| number` | `undefined` | Explicit height. |
| `borderRadius` | `string` | `undefined` | Border radius token (`"small"`, `"base"`, `"large"`, `"max"`). |
| `onLoad` | `(event: Event) => void` | `undefined` | Load event handler. |
| `onError` | `(event: Event) => void` | `undefined` | Error event handler. |
