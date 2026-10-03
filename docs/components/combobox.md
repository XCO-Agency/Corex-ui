# Combobox

A field with its suggestions beneath it.

```tsx
import { Combobox } from "@xco-agency/corex-ui";

<Combobox items={frameworks} onValueChange={setSelected}>
  <Combobox.Input placeholder="Select a framework" showClear />
  <Combobox.Content>
    <Combobox.Empty>No items found.</Combobox.Empty>
    <Combobox.List>
      {frameworks.map((item) => (
        <Combobox.Item key={item} value={item}>
          {item}
        </Combobox.Item>
      ))}
    </Combobox.List>
  </Combobox.Content>
</Combobox>;
```

The list of suggestions renders in a floating popover overlay anchored to the
input field. Focus remains on the input so typing continues uninterrupted, and
keyboard navigation and search filtering are supported out of the box.
