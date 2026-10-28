import * as React from "react";
import {
  Autocomplete,
  Badge,
  Banner,
  BlockStack,
  Box,
  Button,
  Clickable,
  Collapsible,
  Divider,
  Icon,
  IconTile,
  InlineStack,
  NumberField,
  RangeSlider,
  SearchField,
  Select,
  Switch,
  Text,
  TextField,
  Tooltip,
} from "@xco-agency/corex-ui";
import type { IconType } from "@xco-agency/corex-ui";
import iconsData from "@/data/icons.json";
import { getDefinition } from "../definitions";
import { useEditor } from "../store";
import { findParent, ROOT_ID } from "../tree";
import { FIELD_SECTIONS, type FieldSectionType, type FieldType } from "../types";

const ICON_NAMES = (iconsData as { name: string }[]).map((icon) => icon.name);
/** Suggestions shown at once in the icon picker; typing narrows the full list. */
const ICON_SUGGESTIONS = 40;

const isSet = (value: unknown) => value !== undefined && value !== "" && value !== null;

const placeholderOf = (field: FieldType) =>
  field.defaultValue !== undefined && typeof field.defaultValue !== "object"
    ? String(field.defaultValue)
    : undefined;

const asText = (value: unknown) =>
  typeof value === "string" || typeof value === "number" ? String(value) : "";

/** Narrows `values` to what the user typed, but shows them all once a value is chosen. */
function suggestions(values: string[], typed: string, limit = Infinity) {
  const query = typed.trim().toLowerCase();
  const matching =
    !query || values.includes(typed)
      ? values
      : values.filter((value) => value.includes(query));
  return matching.slice(0, limit);
}

/** JSON props keep a local draft so half-typed JSON never reaches the canvas. */
function JsonControl({
  field,
  value,
  onChange,
}: {
  field: Extract<FieldType, { kind: "json" }>;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const serialized = isSet(value) ? JSON.stringify(value, null, 2) : "";
  const [draft, setDraft] = React.useState(serialized);
  const [error, setError] = React.useState<string>();

  // Accept outside changes (undo, AI edits) unless the draft is mid-edit and invalid.
  React.useEffect(() => {
    if (!error) setDraft(serialized);
  }, [serialized]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <TextField
      label={field.label}
      labelAccessibilityVisibility="exclusive"
      multiline={Math.min(10, Math.max(3, draft.split("\n").length))}
      value={draft}
      placeholder="JSON value"
      error={error}
      helpText={field.shape}
      onChange={(next) => {
        setDraft(next);
        if (!next.trim()) {
          setError(undefined);
          onChange("");
          return;
        }
        try {
          onChange(JSON.parse(next));
          setError(undefined);
        } catch (parseError) {
          setError(parseError instanceof Error ? parseError.message : "Invalid JSON");
        }
      }}
    />
  );
}

function FieldControl({
  field,
  value,
  onChange,
}: {
  field: FieldType;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const placeholder = placeholderOf(field);
  const current = asText(value);

  switch (field.kind) {
    case "text":
    case "textarea":
      return (
        <TextField
          label={field.label}
          labelAccessibilityVisibility="exclusive"
          value={current}
          placeholder={placeholder}
          multiline={field.kind === "textarea" ? 3 : undefined}
          onChange={(next) => onChange(next)}
        />
      );

    case "number":
      return (
        <NumberField
          label={field.label}
          labelAccessibilityVisibility="exclusive"
          value={current}
          placeholder={placeholder}
          onChange={(next) => onChange(next === "" ? "" : Number(next))}
        />
      );

    case "range": {
      const fallback =
        typeof field.defaultValue === "number" ? field.defaultValue : field.min;
      return (
        <RangeSlider
          label={field.label}
          labelHidden
          output
          min={field.min}
          max={field.max}
          step={field.step ?? 1}
          value={typeof value === "number" ? value : Number(current) || fallback}
          suffix={<Text variant="small">{isSet(value) ? current : "auto"}</Text>}
          onChange={(next) => onChange(next)}
        />
      );
    }

    case "boolean":
      return (
        <Switch
          label={field.label}
          labelAccessibilityVisibility="exclusive"
          checked={value === undefined ? field.defaultValue === true : Boolean(value)}
          onChange={(checked) => onChange(checked)}
        />
      );

    case "select": {
      // Token scales and free values (gap, padding, sizes) → Autocomplete; closed lists → Select.
      if (field.allowCustom) {
        const values = field.options.map((option) => option.value);
        return (
          <Autocomplete
            value={current}
            selected={values.includes(current) ? current : undefined}
            placeholder={placeholder ? `default (${placeholder})` : "default"}
            options={suggestions(values, current).map((option) => ({ value: option }))}
            onChange={(next) => onChange(next)}
            onSelect={(next) => onChange(next)}
          />
        );
      }
      return (
        <Select
          label={field.label}
          labelAccessibilityVisibility="exclusive"
          value={current}
          options={[
            { label: placeholder ? `Default (${placeholder})` : "Default", value: "" },
            ...field.options,
          ]}
          onChange={(next) => onChange(next)}
        />
      );
    }

    case "icon":
      return (
        <Autocomplete
          value={current}
          selected={ICON_NAMES.includes(current) ? current : undefined}
          placeholder={placeholder ?? "Search icons"}
          options={suggestions(ICON_NAMES, current, ICON_SUGGESTIONS).map((name) => ({
            value: name,
            label: (
              <InlineStack gap="small-200" alignItems="center">
                <Icon type={name as IconType} size="small" />
                <Text>{name}</Text>
              </InlineStack>
            ),
          }))}
          onChange={(next) => onChange(next)}
          onSelect={(next) => onChange(next)}
        />
      );

    case "json":
      return <JsonControl field={field} value={value} onChange={onChange} />;
  }
}

function FieldRow({
  field,
  value,
  onChange,
}: {
  field: FieldType;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const header = (
    <InlineStack gap="small-300" alignItems="center" wrap={false}>
      <Text variant="small" fontWeight="medium" color="subdued">
        {field.label}
      </Text>
      {field.description && (
        <Tooltip content={`${field.name}: ${field.description}`}>
          <Icon type="question-circle" size="small" tone="neutral" />
        </Tooltip>
      )}
    </InlineStack>
  );
  const reset = isSet(value) && (
    <Tooltip content="Reset to default">
      <Button
        variant="tertiary"
        icon="undo"
        accessibilityLabel={`Reset ${field.label}`}
        onClick={() => onChange(undefined)}
      />
    </Tooltip>
  );

  if (field.kind === "boolean") {
    return (
      <InlineStack
        justifyContent="space-between"
        alignItems="center"
        gap="small"
        wrap={false}
      >
        {header}
        <InlineStack gap="small-300" alignItems="center" wrap={false}>
          {reset}
          <FieldControl field={field} value={value} onChange={onChange} />
        </InlineStack>
      </InlineStack>
    );
  }

  return (
    <BlockStack gap="small-300">
      <InlineStack
        justifyContent="space-between"
        alignItems="center"
        wrap={false}
        minBlockSize="28px"
      >
        {header}
        {reset}
      </InlineStack>
      <FieldControl field={field} value={value} onChange={onChange} />
    </BlockStack>
  );
}

function Section({
  title,
  count,
  defaultOpen,
  forceOpen,
  children,
}: {
  title: FieldSectionType;
  count: number;
  defaultOpen: boolean;
  forceOpen: boolean;
  children: React.ReactNode;
}) {
  return (
    <Collapsible
      // Searching forces every section open; switching keys swaps controlled/uncontrolled.
      key={forceOpen ? "forced" : "free"}
      {...(forceOpen ? { expanded: true } : { defaultExpanded: defaultOpen })}
      content={
        <Box paddingInline="base" paddingBlockEnd="base">
          <BlockStack gap="base">{children}</BlockStack>
        </Box>
      }
    >
      {({ expanded, toggle }) => (
        <Clickable
          onClick={toggle}
          accessibilityLabel={`${expanded ? "Collapse" : "Expand"} ${title}`}
        >
          <Box paddingInline="base" paddingBlock="small-100">
            <InlineStack justifyContent="space-between" alignItems="center">
              <InlineStack gap="small-200" alignItems="center">
                <Icon
                  type={expanded ? "chevron-down" : "chevron-right"}
                  size="small"
                  tone="neutral"
                />
                <Text variant="small" fontWeight="semibold">
                  {title}
                </Text>
              </InlineStack>
              <Badge>{String(count)}</Badge>
            </InlineStack>
          </Box>
        </Clickable>
      )}
    </Collapsible>
  );
}

export function Inspector() {
  const { state, dispatch, selected } = useEditor();
  const [query, setQuery] = React.useState("");
  const node = selected ?? state.root;
  const definition = getDefinition(node.type);
  const isRoot = node.id === ROOT_ID;
  const parent = isRoot ? null : findParent(state.root, node.id);

  if (!definition) {
    return (
      <Box padding="base">
        <Text color="subdued">Unknown component “{node.type}”.</Text>
      </Box>
    );
  }

  const needle = query.trim().toLowerCase();
  const visible = definition.fields.filter(
    (field) =>
      !needle ||
      field.name.toLowerCase().includes(needle) ||
      field.label.toLowerCase().includes(needle),
  );
  const sections = FIELD_SECTIONS.map((section) => ({
    section,
    fields: visible.filter((field) => field.section === section),
  })).filter(({ fields }) => fields.length);
  const setCount = definition.fields.filter((field) =>
    isSet(node.props[field.name]),
  ).length;

  const update = (name: string, value: unknown) =>
    dispatch({ type: "update", id: node.id, props: { [name]: value } });

  const emptyMessage = needle
    ? `No props match “${query}”.`
    : isRoot
      ? "The canvas has no settings: it adds no wrapper, so the export returns your elements in a fragment. Use a Block stack or Page for spacing."
      : definition.group === "Blocks"
        ? "Blocks render as ready-made sections. Compose around them with stacks, cards and grids, or ask the AI agent to build alongside."
        : "This component has no settings.";

  return (
    <BlockStack grow minBlockSize={0}>
      {/* Header and search keep their height; only the field list scrolls. */}
      <BlockStack shrink={false}>
        <Box padding="base">
          <InlineStack gap="small" alignItems="start" wrap={false}>
            <IconTile tone="info" color="base" size="small">
              <definition.icon size={16} />
            </IconTile>
            <BlockStack gap="small-500" grow minInlineSize={0}>
              <Text fontWeight="semibold" lineClamp={1}>
                {definition.label}
              </Text>
              <Text variant="small" color="subdued" lineClamp={2}>
                {definition.description}
              </Text>
            </BlockStack>
            {!isRoot && (
              <InlineStack gap="small-500" wrap={false}>
                {parent && parent.id !== ROOT_ID && (
                  <Tooltip content="Select parent">
                    <Button
                      variant="tertiary"
                      icon="arrow-up"
                      accessibilityLabel="Select parent"
                      onClick={() => dispatch({ type: "select", id: parent.id })}
                    />
                  </Tooltip>
                )}
                <Tooltip content="Duplicate (⌘D)">
                  <Button
                    variant="tertiary"
                    icon="duplicate"
                    accessibilityLabel="Duplicate"
                    onClick={() => dispatch({ type: "duplicate", id: node.id })}
                  />
                </Tooltip>
                <Tooltip content="Delete (⌫)">
                  <Button
                    variant="tertiary"
                    tone="critical"
                    icon="delete"
                    accessibilityLabel="Delete"
                    onClick={() => dispatch({ type: "remove", id: node.id })}
                  />
                </Tooltip>
              </InlineStack>
            )}
          </InlineStack>
        </Box>
        <Divider />

        {(definition.note || definition.fields.length > 6) && (
          <Box padding="base" paddingBlockEnd="small">
            <BlockStack gap="small">
              {definition.note && <Banner tone="warning">{definition.note}</Banner>}
              {definition.fields.length > 6 && (
                <SearchField
                  label="Search props"
                  labelAccessibilityVisibility="exclusive"
                  value={query}
                  placeholder={`Search ${definition.fields.length} props${setCount ? ` · ${setCount} set` : ""}`}
                  onChange={(next) => setQuery(next)}
                />
              )}
            </BlockStack>
          </Box>
        )}
      </BlockStack>

      <BlockStack grow minBlockSize={0} overflowY="auto">
        {/* Sections clip their content (overflow: hidden), so they must not shrink in the scroller. */}
        <BlockStack shrink={false}>
          {sections.length ? (
            sections.map(({ section, fields }, index) => (
              <React.Fragment key={`${node.id}-${section}`}>
                {index > 0 && <Divider />}
                <Section
                  title={section}
                  count={fields.length}
                  defaultOpen={
                    index === 0 ||
                    section === "Content" ||
                    fields.some((field) => isSet(node.props[field.name]))
                  }
                  forceOpen={Boolean(needle)}
                >
                  {fields.map((field) => (
                    <FieldRow
                      key={field.name}
                      field={field}
                      value={node.props[field.name]}
                      onChange={(value) => update(field.name, value)}
                    />
                  ))}
                </Section>
              </React.Fragment>
            ))
          ) : (
            <Box padding="base">
              <Text variant="small" color="subdued">
                {emptyMessage}
              </Text>
            </Box>
          )}

          {isRoot && (
            <Box padding="base">
              <Box padding="base" border="base" borderStyle="dashed" borderRadius="base">
                <BlockStack gap="small-200" alignItems="center">
                  <Icon type="cursor" tone="neutral" />
                  <Text variant="small" color="subdued">
                    Select an element on the canvas or in Layers to edit its props.
                  </Text>
                </BlockStack>
              </Box>
            </Box>
          )}
        </BlockStack>
      </BlockStack>
    </BlockStack>
  );
}
