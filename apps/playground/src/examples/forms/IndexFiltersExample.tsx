import { useState } from "react";
import {
  Card,
  ChoiceList,
  IndexFilters,
  useSetIndexFiltersMode,
} from "@xco-agency/corex-ui";

export function IndexFiltersExample() {
  const { mode, setMode } = useSetIndexFiltersMode();
  const [tab, setTab] = useState(0);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string[]>([]);
  const [sort, setSort] = useState("created_at desc");

  return (
    <Card>
      <IndexFilters
        mode={mode}
        setMode={setMode}
        tabs={[
          { id: "all", content: "All" },
          { id: "open", content: "Open" },
          { id: "archived", content: "Archived" },
        ]}
        selected={tab}
        onSelect={setTab}
        queryValue={query}
        queryPlaceholder="Search orders"
        onQueryChange={setQuery}
        onQueryClear={() => setQuery("")}
        filters={[
          {
            key: "status",
            label: "Status",
            filter: (
              <ChoiceList
                label="Status"
                labelAccessibilityVisibility="exclusive"
                multiple
                choices={[
                  { label: "Open", value: "open" },
                  { label: "Archived", value: "archived" },
                ]}
                selected={status}
                onChange={setStatus}
              />
            ),
          },
        ]}
        appliedFilters={status.map((value) => ({
          key: value,
          label: `Status is ${value}`,
          onRemove: (key) => setStatus(status.filter((entry) => entry !== key)),
        }))}
        onClearAll={() => {
          setStatus([]);
          setQuery("");
        }}
        sortOptions={[
          { value: "created_at desc", directionLabel: "Newest first" },
          { value: "created_at asc", directionLabel: "Oldest first" },
        ]}
        sortSelected={[sort]}
        onSort={([value]) => setSort(value ?? sort)}
      />
    </Card>
  );
}
