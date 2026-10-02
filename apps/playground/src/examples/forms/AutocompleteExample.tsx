import { useState } from "react";
import { Autocomplete, Card, Text } from "@xco-agency/corex-ui";

const vendors = [
  { value: "acme", label: "Acme Supply Co." },
  { value: "northern", label: "Northern Goods" },
  { value: "atlas", label: "Atlas Textiles" },
];

export function AutocompleteExample() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string>("acme");

  const matches = vendors.filter((vendor) =>
    vendor.label.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Card>
      <Autocomplete
        label="Vendors"
        placeholder="Search vendors"
        value={query}
        onChange={setQuery}
        autoComplete="off"
        options={matches}
        selected={selected}
        onSelect={(value) => {
          setSelected(value);
          const found = vendors.find((v) => v.value === value);
          if (found) setQuery(found.label);
        }}
        emptyState={<Text color="subdued">No vendors match “{query}”</Text>}
      />
    </Card>
  );
}
