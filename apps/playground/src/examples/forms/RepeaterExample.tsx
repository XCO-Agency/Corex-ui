import { useState } from "react";
import {
  Badge,
  BlockStack,
  Box,
  Button,
  Card,
  Repeater,
  type RepeaterMatchModeType,
  Text,
  TextField,
} from "@xco-agency/corex-ui";

type FieldType = {
  value: string;
  label: string;
  /** Second line in the field menus, searched too. */
  detail?: string;
  /** Leading icon in the field picker menus. */
  icon?: string;
  operators: { label: string; value: string }[];
  /** The operator is the whole choice (Status: Active), so no value area. */
  operatorIsValue?: boolean;
  prefix?: string;
  /** Several values, joined by the row's All / Any mode. */
  multi?: {
    suggestions: string[];
    help: (mode: RepeaterMatchModeType) => string;
    /** A product has one type: several types can only match as Any. */
    lockAnyWhenMany?: boolean;
  };
};

const FIELDS: FieldType[] = [
  {
    value: "title",
    label: "Title",
    icon: "text",
    operators: [
      { label: "contains", value: "contains" },
      { label: "is equal to", value: "equals" },
      { label: "starts with", value: "starts_with" },
    ],
  },
  {
    value: "price",
    label: "Price",
    icon: "cash-dollar",
    prefix: "$",
    operators: [
      { label: "is greater than", value: "gt" },
      { label: "is less than", value: "lt" },
    ],
  },
  {
    value: "status",
    label: "Status",
    icon: "status",
    operatorIsValue: true,
    operators: [
      { label: "Active", value: "active" },
      { label: "Draft", value: "draft" },
    ],
  },
  {
    value: "tag",
    label: "Tag",
    icon: "hashtag",
    operators: [],
    multi: {
      suggestions: ["summer", "sale", "new", "bestseller", "eco"],
      help: (mode) =>
        mode === "all"
          ? "Only products containing all specified tags will be counted."
          : "Products with any of the specified tags will be included.",
    },
  },
  {
    value: "type",
    label: "Product type",
    icon: "product",
    operators: [],
    multi: {
      suggestions: ["Shirts", "Shoes", "Hats", "Bags"],
      lockAnyWhenMany: true,
      help: (mode) =>
        mode === "all"
          ? "Only products with all specified types will be counted."
          : "Products with any of the specified types will be included.",
    },
  },
];

const TEXT_OPERATORS = [
  { label: "contains", value: "contains" },
  { label: "is equal to", value: "equals" },
];
const NUMBER_OPERATORS = [
  { label: "is greater than", value: "gt" },
  { label: "is less than", value: "lt" },
];

/** More condition types than the add menu shows unsearched (10). */
const MORE_FIELDS: FieldType[] = [
  {
    value: "vendor",
    label: "Vendor",
    icon: "store",
    detail: "Brand or supplier",
    operators: TEXT_OPERATORS,
  },
  {
    value: "sku",
    label: "SKU",
    icon: "barcode",
    detail: "Variant stock keeping unit",
    operators: TEXT_OPERATORS,
  },
  {
    value: "barcode",
    label: "Barcode",
    icon: "barcode",
    detail: "ISBN, UPC or GTIN",
    operators: TEXT_OPERATORS,
  },
  {
    value: "compare_at",
    label: "Compare-at price",
    icon: "cash-dollar",
    detail: "Price before a sale",
    prefix: "$",
    operators: NUMBER_OPERATORS,
  },
  {
    value: "weight",
    label: "Weight",
    icon: "product",
    detail: "Shipping weight in kg",
    operators: NUMBER_OPERATORS,
  },
  {
    value: "inventory",
    label: "Inventory stock",
    icon: "inventory",
    detail: "Units available across locations",
    operators: NUMBER_OPERATORS,
  },
  {
    value: "metafield",
    label: "Metafield",
    icon: "metaobject",
    detail: "Custom product data",
    operators: TEXT_OPERATORS,
  },
  {
    value: "variant_title",
    label: "Variant title",
    icon: "text",
    operators: TEXT_OPERATORS,
  },
];

const ALL_FIELDS: FieldType[] = [...FIELDS, ...MORE_FIELDS];

type RuleType = {
  id: number;
  field: string;
  operator: string;
  value: string;
  values: string[];
  mode: RepeaterMatchModeType;
};

const MAX_RULES = 4;

let nextId = 4;

export function RepeaterExample() {
  const [rules, setRules] = useState<RuleType[]>([
    {
      id: 1,
      field: "title",
      operator: "contains",
      value: "Summer",
      values: [],
      mode: "any",
    },
    { id: 2, field: "status", operator: "active", value: "", values: [], mode: "any" },
    {
      id: 3,
      field: "tag",
      operator: "",
      value: "",
      values: ["summer", "sale"],
      mode: "all",
    },
  ]);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const fieldOf = (rule: RuleType) => ALL_FIELDS.find((f) => f.value === rule.field)!;
  const update = (id: number, patch: Partial<RuleType>) =>
    setRules((current) => current.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const fieldOptions = ALL_FIELDS.map(({ label, value, detail, icon }) => ({
    label,
    value,
    detail,
    icon,
  }));

  return (
    <Card>
      <BlockStack gap="base">
        <Text variant="headingSm">Products must match all conditions</Text>
        <Repeater<RuleType>
          items={rules}
          maxItems={MAX_RULES}
          limitNote={
            <BlockStack gap="small-300">
              <Text variant="bodySm" color="subdued">
                Your plan allows {MAX_RULES} conditions per collection.
              </Text>
              <Box>
                <Button variant="tertiary">Upgrade</Button>
              </Box>
            </BlockStack>
          }
          emptyState="Add a condition to save this collection."
          renderControls={(rule) => {
            const field = fieldOf(rule);
            const operator = field.operators.find((o) => o.value === rule.operator);
            const fieldKey = `field-${rule.id}`;
            const operatorKey = `operator-${rule.id}`;
            return (
              <>
                <Repeater.Pill
                  label={field.label}
                  open={openMenu === fieldKey}
                  onOpenChange={(open) => setOpenMenu(open ? fieldKey : null)}
                  menu={
                    <Repeater.Options
                      options={fieldOptions}
                      selected={rule.field}
                      onSelect={(value) => {
                        const next = ALL_FIELDS.find((f) => f.value === value)!;
                        update(rule.id, {
                          field: value,
                          operator: next.operators[0]?.value ?? "",
                          value: "",
                          values: [],
                          mode: "any",
                        });
                        setOpenMenu(null);
                      }}
                    />
                  }
                />
                {field.multi ? (
                  <Repeater.MatchMode
                    value={rule.mode}
                    onChange={(mode) => update(rule.id, { mode })}
                    help={field.multi.help}
                    locked={field.multi.lockAnyWhenMany && rule.values.length > 1}
                    open={openMenu === operatorKey}
                    onOpenChange={(open) => setOpenMenu(open ? operatorKey : null)}
                  />
                ) : (
                  <Repeater.Pill
                    label={operator?.label ?? "Operator"}
                    open={openMenu === operatorKey}
                    onOpenChange={(open) => setOpenMenu(open ? operatorKey : null)}
                    menu={
                      <Repeater.Options
                        options={field.operators}
                        selected={rule.operator}
                        onSelect={(value) => {
                          update(rule.id, { operator: value });
                          setOpenMenu(null);
                        }}
                      />
                    }
                  />
                )}
              </>
            );
          }}
          renderValue={(rule) => {
            const field = fieldOf(rule);
            if (field.operatorIsValue) return null;
            if (field.multi) {
              const lock = field.multi.lockAnyWhenMany;
              return (
                <Repeater.TagsInput
                  values={rule.values}
                  mode={rule.mode}
                  suggestions={field.multi.suggestions}
                  suggestionsKey={rule.field}
                  onChange={(values) =>
                    update(rule.id, {
                      values,
                      ...(lock && values.length > 1 ? { mode: "any" as const } : {}),
                    })
                  }
                />
              );
            }
            return (
              <Box padding="small-200">
                <TextField
                  label="Value"
                  labelAccessibilityVisibility="exclusive"
                  prefix={field.prefix}
                  value={rule.value}
                  autoComplete="off"
                  onChange={(value) => update(rule.id, { value })}
                />
              </Box>
            );
          }}
          onRemove={(rule) =>
            setRules((current) => current.filter((r) => r.id !== rule.id))
          }
          removeAccessibilityLabel={(rule) => `Remove ${fieldOf(rule).label} condition`}
          addMenuOpen={addOpen}
          onAddMenuOpenChange={setAddOpen}
          addMenu={
            <Repeater.Options
              options={fieldOptions}
              searchPlaceholder="Search conditions"
              noResultsText="No condition matches your search."
              onSelect={(value) => {
                const field = ALL_FIELDS.find((f) => f.value === value)!;
                setRules((current) => [
                  ...current,
                  {
                    id: nextId++,
                    field: value,
                    operator: field.operators[0]?.value ?? "",
                    value: "",
                    values: [],
                    mode: "any",
                  },
                ]);
                setAddOpen(false);
              }}
            />
          }
          footerEnd={
            <Button
              variant="tertiary"
              icon="product-add"
              accessibilityLabel="Pinned products (2)"
            >
              <Badge tone="neutral">2</Badge>
            </Button>
          }
        />
      </BlockStack>
    </Card>
  );
}
