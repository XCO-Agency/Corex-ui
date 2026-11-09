import * as React from "react";
import {
  Badge,
  Banner,
  BlockStack,
  Box,
  Button,
  InlineStack,
  SearchField,
  Skeleton,
  Table,
  Text,
} from "@xco-agency/corex-ui";
import { InlineMarkdown } from "@/components/InlineMarkdown";
import type {
  ComponentReferenceType,
  ReferencePropType,
  ReferenceTableType,
} from "@/lib/skill-reference";

export const API_SECTION_IDS = {
  props: "api-props",
  subcomponents: "api-subcomponents",
  deprecated: "api-deprecated",
} as const;

export const extraTableId = (title: string) =>
  `api-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;

const COLLAPSED_PROP_COUNT = 14;

function SectionHeading({
  id,
  title,
  count,
}: {
  id: string;
  title: string;
  count?: number;
}) {
  return (
    <Box id={id}>
      <InlineStack gap="small-200" alignItems="center">
        <Text as="h3" variant="headingSm" heading>
          <InlineMarkdown>{title}</InlineMarkdown>
        </Text>
        {count !== undefined && <Badge>{count}</Badge>}
      </InlineStack>
    </Box>
  );
}

function PropsTable({ props }: { props: ReferencePropType[] }) {
  const [query, setQuery] = React.useState("");
  const [expanded, setExpanded] = React.useState(false);

  const sorted = React.useMemo(
    () =>
      [...props].sort(
        (a, b) =>
          Number(b.required) - Number(a.required) ||
          Number(Boolean(b.description)) - Number(Boolean(a.description)),
      ),
    [props],
  );

  const normalized = query.trim().toLowerCase();
  const filtered = normalized
    ? sorted.filter(
        (prop) =>
          prop.name.toLowerCase().includes(normalized) ||
          prop.description.toLowerCase().includes(normalized),
      )
    : sorted;
  const canCollapse = !normalized && filtered.length > COLLAPSED_PROP_COUNT;
  const visible =
    canCollapse && !expanded ? filtered.slice(0, COLLAPSED_PROP_COUNT) : filtered;

  return (
    <BlockStack gap="small">
      {props.length > 6 && (
        <Box maxInlineSize="320px">
          <SearchField
            label="Filter props"
            labelAccessibilityVisibility="exclusive"
            placeholder={`Filter ${props.length} props…`}
            value={query}
            onChange={setQuery}
          />
        </Box>
      )}

      <Table>
        <Table.HeaderRow>
          <Table.HeaderCell>Prop</Table.HeaderCell>
          <Table.HeaderCell>Type</Table.HeaderCell>
          <Table.HeaderCell>Description</Table.HeaderCell>
        </Table.HeaderRow>
        <Table.Body>
          {visible.map((prop) => (
            <Table.Row key={prop.name}>
              <Table.Cell>
                <InlineStack gap="small-200" alignItems="center" wrap>
                  <Text fontWeight="semibold">{prop.name}</Text>
                  {prop.required && <Badge tone="critical">Required</Badge>}
                </InlineStack>
              </Table.Cell>
              <Table.Cell>
                <Text variant="small">{prop.type.replace(/\s*\|\s*undefined$/, "")}</Text>
              </Table.Cell>
              <Table.Cell>
                {prop.description ? (
                  <InlineMarkdown>{prop.description}</InlineMarkdown>
                ) : (
                  <Text color="subdued">—</Text>
                )}
              </Table.Cell>
            </Table.Row>
          ))}
          {visible.length === 0 && (
            <Table.Row>
              <Table.Cell>
                <Text color="subdued">No props match “{query}”.</Text>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
      {canCollapse && (
        <Button
          variant="tertiary"
          inlineSize="fill"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Show fewer props" : `Show all ${filtered.length} props`}
        </Button>
      )}
    </BlockStack>
  );
}

function GenericTable({ table }: { table: ReferenceTableType }) {
  return (
    <Table>
      <Table.HeaderRow>
        {table.headers.map((header) => (
          <Table.HeaderCell key={header}>{header}</Table.HeaderCell>
        ))}
      </Table.HeaderRow>
      <Table.Body>
        {table.rows.map((row, rowIndex) => (
          <Table.Row key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <Table.Cell key={cellIndex}>
                {cell === "—" ? (
                  <Text color="subdued">—</Text>
                ) : (
                  <InlineMarkdown>{cell}</InlineMarkdown>
                )}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

function DeprecationList({ items }: { items: ComponentReferenceType["deprecations"] }) {
  return (
    <Banner tone="warning" heading="Deprecated props">
      <Text as="p" color="subdued">
        Accepted for legacy compatibility only. Don&apos;t use these in new code.
      </Text>
      <BlockStack gap="small-200">
        {items.map((item) => (
          <InlineStack key={item.prop} gap="small" alignItems="start" wrap>
            <Text color="subdued">{item.prop}</Text>
            {item.note && <InlineMarkdown>{item.note}</InlineMarkdown>}
          </InlineStack>
        ))}
      </BlockStack>
    </Banner>
  );
}

export type ComponentApiReferencePropsType = {
  reference: ComponentReferenceType | null | undefined;
};

export function ComponentApiReference({ reference }: ComponentApiReferencePropsType) {
  if (reference === null) return null;

  return (
    <BlockStack gap="large-200" id="api-reference">
      <BlockStack gap="small-200">
        <Text as="h2" variant="headingMd" heading>
          API reference
        </Text>
        <Text as="p" color="subdued">
          Modern props only, generated from the Corex UI agent skill.
        </Text>
      </BlockStack>

      {reference === undefined ? (
        <BlockStack gap="small">
          <Skeleton inlineSize={224} blockSize={32} />
          <Skeleton blockSize={192} />
        </BlockStack>
      ) : (
        <>
          {reference.props.length > 0 && (
            <BlockStack gap="small">
              <SectionHeading
                id={API_SECTION_IDS.props}
                title="Props"
                count={reference.props.length}
              />
              <PropsTable props={reference.props} />
            </BlockStack>
          )}

          {reference.subcomponents && (
            <BlockStack gap="small">
              <SectionHeading
                id={API_SECTION_IDS.subcomponents}
                title="Subcomponents"
                count={reference.subcomponents.rows.length}
              />
              <GenericTable table={reference.subcomponents} />
            </BlockStack>
          )}

          {reference.extraTables.map((table) => (
            <BlockStack key={table.title} gap="small">
              <SectionHeading id={extraTableId(table.title)} title={table.title} />
              <GenericTable table={table} />
            </BlockStack>
          ))}

          {reference.deprecations.length > 0 && (
            <BlockStack gap="small">
              <SectionHeading
                id={API_SECTION_IDS.deprecated}
                title="Deprecated props"
                count={reference.deprecations.length}
              />
              <DeprecationList items={reference.deprecations} />
            </BlockStack>
          )}
        </>
      )}
    </BlockStack>
  );
}
