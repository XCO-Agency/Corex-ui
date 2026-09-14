import * as React from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Button,
  TextField,
  Divider,
} from "@xco-agency/corex-ui";
import type { TemplateChannelType } from "../types";

type TemplateConfigCardPropsType = {
  name: string;
  channel: TemplateChannelType;
  senderName: string;
  subject: string;
  onUpdateName: (name: string) => void;
  onUpdateChannel: (channel: TemplateChannelType) => void;
  onUpdateSenderName: (sender: string) => void;
  onUpdateSubject: (subject: string) => void;
};

export function TemplateConfigCard({
  name,
  channel,
  senderName,
  subject,
  onUpdateName,
  onUpdateChannel,
  onUpdateSenderName,
  onUpdateSubject,
}: TemplateConfigCardPropsType) {
  return (
    <Card>
      <BlockStack gap="base">
        <InlineStack justifyContent="space-between" alignItems="center">
          <BlockStack gap="small-400">
            <Text as="h3" fontWeight="semibold">
              Notification Channel & Details
            </Text>
            <Text color="subdued" variant="bodySm">
              Configure delivery channel and sender identity.
            </Text>
          </BlockStack>

          <InlineStack gap="small-200">
            <Button
              variant={channel === "sms" ? "primary" : "secondary"}
              onClick={() => onUpdateChannel("sms")}
            >
              SMS / WhatsApp
            </Button>
            <Button
              variant={channel === "email" ? "primary" : "secondary"}
              onClick={() => onUpdateChannel("email")}
            >
              Email
            </Button>
          </InlineStack>
        </InlineStack>

        <Divider />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--p-space-400, 16px)",
          }}
        >
          <TextField
            label="Template Title"
            value={name}
            onChange={onUpdateName}
            placeholder="e.g. Shipping Delivery Update"
          />

          <TextField
            label="Sender ID / Brand Name"
            value={senderName}
            onChange={onUpdateSenderName}
            placeholder="e.g. Aura Outfitters"
          />
        </div>

        {channel === "email" && (
          <TextField
            label="Email Subject Line"
            value={subject}
            onChange={onUpdateSubject}
            placeholder="e.g. Your order is on the way! 📦"
          />
        )}
      </BlockStack>
    </Card>
  );
}
