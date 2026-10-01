import { useState } from "react";
import { Card, Combobox, Listbox, Tag, InlineStack } from "@xco-agency/corex-ui";

const allTags = ["sale", "seasonal", "clearance", "bundle", "new"];

export function ComboboxExample() {
  const [query, setQuery] = useState("");
  const [tags, setTags] = useState<string[]>(["sale"]);

  const matches = allTags.filter(
    (tag) => tag.includes(query.toLowerCase()) && !tags.includes(tag),
  );

  return (
    <Card>
      <Combobox
        activator={
          <Combobox.TextField
            label="Tags"
            value={query}
            autoComplete="off"
            placeholder="Search tags"
            onChange={setQuery}
          />
        }
      >
        {tags.length > 0 ? (
          <InlineStack gap="small-300" wrap>
            {tags.map((tag) => (
              <Tag
                key={tag}
                onRemove={() => setTags(tags.filter((entry) => entry !== tag))}
              >
                {tag}
              </Tag>
            ))}
          </InlineStack>
        ) : null}

        {query && matches.length > 0 ? (
          <Listbox
            onSelect={(value) => {
              setTags([...tags, value]);
              setQuery("");
            }}
          >
            {matches.map((tag) => (
              <Listbox.Option key={tag} value={tag}>
                {tag}
              </Listbox.Option>
            ))}
          </Listbox>
        ) : null}
      </Combobox>
    </Card>
  );
}
