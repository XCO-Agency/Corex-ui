import { useState } from "react";
import {
  Badge,
  BlockStack,
  Box,
  Button,
  Card,
  ConditionsRepeater,
  Text,
  TextField,
} from "@xco-agency/corex-ui";

type FieldType = {
  value: string;
  label: string;
  operators: { label: string; value: string }[];
  /** The operator is the whole choice (Status: Active), so no value area. */
  operatorIsValue?: boolean;
  prefix?: string;
};

const FIELDS: FieldType[] = [
  {
    value: "title",
    label: "Title",
    operators: [
      { label: "contains", value: "contains" },
      { label: "is equal to", value: "equals" },
      { label: "starts with", value: "starts_with" },
    ],
  },
  {
    value: "price",
    label: "Price",
    prefix: "$",
    operators: [
      { label: "is greater than", value: "gt" },
      { label: "is less than", value: "lt" },
    ],
  },
  {
    value: "status",
    label: "Status",
    operatorIsValue: true,
    operators: [
      { label: "Active", value: "active" },
      { label: "Draft", value: "draft" },
    ],
  },
];

type RuleType = { id: number; field: string; operator: string; value: string };

const MAX_RULES = 3;

let nextId = 3;

export function ConditionsRepeaterExample() {
  const [rules, setRules] = useState<RuleType[]>([
    { id: 1, field: "title", operator: "contains", value: "Summer" },
    { id: 2, field: "status", operator: "active", value: "" },
  ]);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const fieldOf = (rule: RuleType) => FIELDS.find((f) => f.value === rule.field)!;
  const update = (id: number, patch: Partial<RuleType>) =>
    setRules((current) => current.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const fieldOptions = FIELDS.map(({ label, value }) => ({ label, value }));

  return (
    <Card>
      <BlockStack gap="base">
        <Text variant="headingSm">Products must match all conditions</Text>
        <ConditionsRepeater<RuleType>
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
                <ConditionsRepeater.Pill
                  label={field.label}
                  open={openMenu === fieldKey}
                  onOpenChange={(open) => setOpenMenu(open ? fieldKey : null)}
                  menu={
                    <ConditionsRepeater.Options
                      options={fieldOptions}
                      selected={rule.field}
                      onSelect={(value) => {
                        const next = FIELDS.find((f) => f.value === value)!;
                        update(rule.id, {
                          field: value,
                          operator: next.operators[0]!.value,
                          value: "",
                        });
                        setOpenMenu(null);
                      }}
                    />
                  }
                />
                <ConditionsRepeater.Pill
                  label={operator?.label ?? "Operator"}
                  open={openMenu === operatorKey}
                  onOpenChange={(open) => setOpenMenu(open ? operatorKey : null)}
                  menu={
                    <ConditionsRepeater.Options
                      options={field.operators}
                      selected={rule.operator}
                      onSelect={(value) => {
                        update(rule.id, { operator: value });
                        setOpenMenu(null);
                      }}
                    />
                  }
                />
              </>
            );
          }}
          renderValue={(rule) => {
            const field = fieldOf(rule);
            if (field.operatorIsValue) return null;
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
            <ConditionsRepeater.Options
              options={fieldOptions}
              onSelect={(value) => {
                const field = FIELDS.find((f) => f.value === value)!;
                setRules((current) => [
                  ...current,
                  {
                    id: nextId++,
                    field: value,
                    operator: field.operators[0]!.value,
                    value: "",
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
