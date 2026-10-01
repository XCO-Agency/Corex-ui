import { useState } from "react";
import { Autocomplete, Card, Text } from "@xco-agency/corex-ui";

const vendors = [
  { value: "acme", label: "Acme Supply Co." },
  { value: "northern", label: "Northern Goods" },
  { value: "atlas", label: "Atlas Textiles" },
];

export function AutocompleteExample() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>(["acme"]);

  const matches = vendors.filter((vendor) =>
    vendor.label.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Card>
      <Autocomplete
        allowMultiple
        options={matches}
        selected={selected}
        onSelect={setSelected}
        emptyState={<Text color="subdued">No vendors match “{query}”</Text>}
        textField={
          <Autocomplete.TextField
            label="Vendors"
            value={query}
            autoComplete="off"
            placeholder="Search vendors"
            onChange={setQuery}
          />
        }
      />
    </Card>
  );
}
