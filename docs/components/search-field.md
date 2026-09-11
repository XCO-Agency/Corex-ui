# SearchField

A specialized text field for search input, backed by Polaris `<s-search-field>` with integrated debounce support.

```tsx
import { useState } from "react";
import { SearchField } from "@xco-agency/corex-ui";

function MySearch() {
  const [query, setQuery] = useState("");

  return (
    <SearchField
      value={query}
      onChange={setQuery}
      onDebouncedChange={(debounced) => console.log("Perform API search:", debounced)}
      placeholder="Search orders, customers, products..."
      clearButton
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | `undefined` | Current search query. |
| `defaultValue` | `string` | `""` | Initial value for uncontrolled usage. |
| `placeholder` | `string` | `"Search"` | Placeholder text when empty. |
| `label` | `ReactNode` | `"Search"` | Accessible field label. |
| `labelAccessibilityVisibility` | `"visible" \| "exclusive" \| "hidden"` | `"exclusive"` | Controls label visibility. |
| `onChange` | `(value: string, id?: string) => void` | `undefined` | Fired immediately on every keystroke. |
| `onDebouncedChange` | `(value: string) => void` | `undefined` | Fired after the debounce delay completes. |
| `debounceDelay` | `number` | `300` | Delay in milliseconds for `onDebouncedChange`. |
| `onClear` | `() => void` | `undefined` | Fired when the input is cleared. |
| `disabled` | `boolean` | `false` | Disables user interaction. |
| `readOnly` | `boolean` | `false` | Prevents value modification. |
| `error` | `ReactNode` | `undefined` | Displays validation error message. |
| `helpText` | `ReactNode` | `undefined` | Supplementary help text. |
