# Combobox

A field with its suggestions beneath it.

```tsx
import { Combobox, Listbox } from "@xco-agency/corex-ui";

<Combobox
  activator={
    <Combobox.TextField
      label="Tags"
      value={query}
      autoComplete="off"
      onChange={setQuery}
    />
  }
>
  {matches.length > 0 ? (
    <Listbox onSelect={pick}>
      {matches.map((match) => (
        <Listbox.Option key={match} value={match}>
          {match}
        </Listbox.Option>
      ))}
    </Listbox>
  ) : null}
</Combobox>;
```

The list of suggestions renders in a floating popover overlay anchored to the
activator text field, automatically sizing to match the trigger's width. Focus
remains on the input so typing continues uninterrupted, and selections dismiss
or maintain the popover according to `allowMultiple`. In-flow elements (such as
selected tags) stay in document flow beneath the activator.

`Combobox.TextField` is [`TextField`](./text-field.md), re-exported so a migrated call
site keeps compiling.
