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

The list renders in flow rather than in a popover. v12 floated it, but a popover here
would have to own open state, and the one thing this control must not do is swallow a
keystroke or lose focus mid-type. Call sites already render the list only when there
are matches, which is the same behaviour without the risk.

`Combobox.TextField` is [`TextField`](./text-field.md), re-exported so a migrated call
site keeps compiling.
