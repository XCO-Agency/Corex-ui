import * as React from "react";
import { Card, BlockStack, TextField } from "@xco-agency/corex-ui";
import type { OfferDetailsCardPropsType } from "../types";

export function OfferDetailsCard({
  data,
  onChange,
}: OfferDetailsCardPropsType) {
  return (
    <Card>
      <BlockStack gap="base">
        <TextField
          label="Campaign title"
          value={data.title}
          onChange={(val) => onChange("title", val)}
          helpText="Displays as the headline of the offer in the cart drawer."
        />

        <TextField
          label="Internal campaign name"
          value={data.internalName}
          onChange={(val) => onChange("internalName", val)}
          helpText="Used for internal reference and analytics attribution only."
        />

        <TextField
          label="Customer callout banner"
          value={data.bannerText}
          onChange={(val) => onChange("bannerText", val)}
          placeholder="e.g. Add 1 more item to unlock free gift!"
          multiline={2}
        />
      </BlockStack>
    </Card>
  );
}
