import * as React from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  TextField,
  Select,
} from "@xco-agency/corex-ui";
import type { DiscountMethodType } from "../types";

type DiscountGeneralCardPropsType = {
  title: string;
  code: string;
  method: DiscountMethodType;
  startsAt: string;
  endsAt?: string;
  onUpdateTitle: (title: string) => void;
  onUpdateCode: (code: string) => void;
  onUpdateMethod: (method: DiscountMethodType) => void;
  onUpdateStartsAt: (startsAt: string) => void;
  onUpdateEndsAt: (endsAt: string) => void;
};

export function DiscountGeneralCard({
  title,
  code,
  method,
  startsAt,
  endsAt,
  onUpdateTitle,
  onUpdateCode,
  onUpdateMethod,
  onUpdateStartsAt,
  onUpdateEndsAt,
}: DiscountGeneralCardPropsType) {
  const methodOptions = [
    { label: "Automatic discount (applied at checkout)", value: "automatic" },
    { label: "Discount code (customer enters code)", value: "code" },
  ];

  return (
    <Card>
      <BlockStack gap="base">
        <BlockStack gap="small-400">
          <Text as="h3" fontWeight="semibold">
            Discount Configuration
          </Text>
          <Text color="subdued" variant="bodySm">
            General details, discount method, and active duration.
          </Text>
        </BlockStack>

        <TextField
          label="Internal Title"
          value={title}
          onChange={onUpdateTitle}
          placeholder="e.g. Volume Tiered Breaks Q4"
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--p-space-400, 16px)",
          }}
        >
          <Select
            label="Method"
            value={method}
            options={methodOptions}
            onChange={(val) => onUpdateMethod(val as DiscountMethodType)}
          />

          {method === "code" ? (
            <TextField
              label="Discount Code"
              value={code}
              onChange={onUpdateCode}
              placeholder="e.g. TIERDEAL"
            />
          ) : (
            <TextField
              label="Cart Notice Badge"
              value="Applied automatically"
              disabled
              helpText="Merchants will see volume tags automatically in cart."
            />
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--p-space-400, 16px)",
          }}
        >
          <TextField
            label="Start Date"
            type="date"
            value={startsAt}
            onChange={onUpdateStartsAt}
          />
          <TextField
            label="End Date (Optional)"
            type="date"
            value={endsAt ?? ""}
            onChange={onUpdateEndsAt}
          />
        </div>
      </BlockStack>
    </Card>
  );
}
