import * as React from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Button,
  Box,
  Divider,
} from "@xco-agency/corex-ui";
import type { InvoiceItemType } from "../types";

type InvoiceHistoryCardPropsType = {
  invoices: InvoiceItemType[];
  onDownloadInvoice: (invoice: InvoiceItemType) => void;
};

export function InvoiceHistoryCard({
  invoices,
  onDownloadInvoice,
}: InvoiceHistoryCardPropsType) {
  return (
    <Card>
      <BlockStack gap="base">
        <InlineStack justifyContent="space-between" alignItems="center">
          <BlockStack gap="small-400">
            <Text as="h3" fontWeight="semibold">
              Billing History & Tax Receipts
            </Text>
            <Text color="subdued" variant="bodySm">
              Download GST/VAT compliant PDF receipts for your company accounting records.
            </Text>
          </BlockStack>
          <Badge tone="neutral">{invoices.length} Recent Invoices</Badge>
        </InlineStack>

        <Divider />

        <BlockStack gap="small-200">
          {invoices.map((inv) => {
            const statusTone =
              inv.status === "paid"
                ? "success"
                : inv.status === "pending"
                  ? "caution"
                  : "critical";

            return (
              <Box
                key={inv.id}
                padding="small"
                background="base"
                borderRadius="base"
                borderWidth="small-100"
                borderColor="subdued"
                borderStyle="solid"
              >
                <InlineStack justifyContent="space-between" alignItems="center">
                  <InlineStack gap="base" alignItems="center">
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "var(--p-color-bg-subdued, #f6f6f7)",
                        borderRadius: "var(--p-border-radius-100, 6px)",
                        fontSize: "16px",
                      }}
                    >
                      📄
                    </div>

                    <BlockStack gap="small-500">
                      <InlineStack gap="small-200" alignItems="center">
                        <Text fontWeight="semibold" variant="bodySm">
                          {inv.invoiceNumber}
                        </Text>
                        <Badge tone={statusTone}>
                          {inv.status.toUpperCase()}
                        </Badge>
                      </InlineStack>
                      <Text color="subdued" variant="bodySm">
                        Billed on {inv.date} · Automatic charge
                      </Text>
                    </BlockStack>
                  </InlineStack>

                  <InlineStack gap="base" alignItems="center">
                    <Text fontWeight="bold" variant="bodySm">
                      ${inv.amount.toFixed(2)} {inv.currency}
                    </Text>

                    <Button
                      variant="secondary"
                      onClick={() => onDownloadInvoice(inv)}
                    >
                      Download PDF
                    </Button>
                  </InlineStack>
                </InlineStack>
              </Box>
            );
          })}
        </BlockStack>
      </BlockStack>
    </Card>
  );
}
