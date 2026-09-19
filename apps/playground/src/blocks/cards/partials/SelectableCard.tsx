import * as React from "react";
import {
  Box,
  BlockStack,
  InlineStack,
  Clickable,
  Image,
  Text,
  Button,
  Badge,
  Floating,
  Modal,
  Grid,
  TextField,
  Avatar,
  Icon,
  Switch,
} from "@xco-agency/corex-ui";
import type { SelectableCardPropsType } from "../types";

export function SelectableCard({
  title,
  description,
  imageUrl,
  imageAlt,
  selected = false,
  onSelectChange,
  onTitleChange,
}: SelectableCardPropsType) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [currentTitle, setCurrentTitle] = React.useState(title);
  const [editableTitle, setEditableTitle] = React.useState(title);
  const [brandName, setBrandName] = React.useState("Shopify Store");
  const [messageBody, setMessageBody] = React.useState(
    "Hi {{customer_name}}, your order has been placed successfully! Click below to view order confirmation.",
  );
  const [buttonLabel, setButtonLabel] = React.useState("View Order Details");

  React.useEffect(() => {
    setCurrentTitle(title);
    setEditableTitle(title);
  }, [title]);

  const handleToggle = () => {
    onSelectChange?.(!selected);
  };

  const handleOpenModal = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setEditableTitle(currentTitle);
    setIsModalOpen(true);
  };

  const handleSaveConfig = () => {
    setCurrentTitle(editableTitle);
    onTitleChange?.(editableTitle);
    setIsModalOpen(false);
  };

  return (
    <Box position="relative" inlineSize="100%">
      {selected && (
        <Floating position="top-left" strategy="absolute" offset={12} zIndex={10}>
          <Badge tone="success">Selected</Badge>
        </Floating>
      )}

      <Clickable onClick={handleToggle} inlineSize="fill" borderRadius="large-100">
        <Box
          borderRadius="large-100"
          overflow="hidden"
          borderWidth={selected ? "050" : "0165"}
          borderColor={selected ? "strong" : "border"}
          background={selected ? "bg-surface-secondary" : "bg-surface"}
        >
          <BlockStack>
            <Image
              src={imageUrl}
              alt={imageAlt || currentTitle}
              aspectRatio="9/6"
              objectFit="cover"
            />

            <Box padding="base">
              <BlockStack gap="small">
                <InlineStack justifyContent="space-between" alignItems="center">
                  <Text as="h3">{currentTitle}</Text>
                  <Clickable onClick={(e) => e.stopPropagation()}>
                    <Switch
                      checked={selected}
                      onChange={(checked) => onSelectChange?.(checked)}
                      accessibilityLabel={`Select ${currentTitle}`}
                    />
                  </Clickable>
                </InlineStack>
                {description && (
                  <Text color="subdued" as="p" variant="base" lineClamp={2}>
                    {description}
                  </Text>
                )}

                {selected && (
                  <Button variant="primary" inlineSize="fill" onClick={handleOpenModal}>
                    setup
                  </Button>
                )}
              </BlockStack>
            </Box>
          </BlockStack>
        </Box>
      </Clickable>

      <Modal
        size="large"
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Configure ${currentTitle}`}
        primaryAction={{
          content: "Save configuration",
          onAction: handleSaveConfig,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => {
              setEditableTitle(currentTitle);
              setIsModalOpen(false);
            },
          },
        ]}
      >
        <Box padding="base">
          <Grid columns={{ xs: 1, md: 3 }} gap="large-100">
            {/* Column 1: span of 2 - Form for editable title and parameters */}
            <Grid.Item columnSpan={{ xs: 1, md: 2 }}>
              <BlockStack gap="base">
                <BlockStack gap="small-200">
                  <Text variant="headingSm" as="h4" fontWeight="semibold">
                    Template Configuration
                  </Text>
                  <Text variant="bodySm" color="subdued">
                    Update the template title and WhatsApp notification parameters.
                  </Text>
                </BlockStack>

                <TextField
                  label="Template Title"
                  value={editableTitle}
                  onChange={(val) => setEditableTitle(val)}
                  autoComplete="off"
                  helpText="Displayed on your storefront onboarding dashboard."
                />

                <TextField
                  label="Brand / Sender Name"
                  value={brandName}
                  onChange={(val) => setBrandName(val)}
                  autoComplete="off"
                />

                <TextField
                  label="WhatsApp Message Body"
                  value={messageBody}
                  onChange={(val) => setMessageBody(val)}
                  multiline={4}
                  helpText="Supported variables: {{customer_name}}, {{order_id}}, {{checkout_url}}"
                />

                <TextField
                  label="WhatsApp CTA Button Text"
                  value={buttonLabel}
                  onChange={(val) => setButtonLabel(val)}
                  autoComplete="off"
                />
              </BlockStack>
            </Grid.Item>

            {/* Column 2: span of 1 - WhatsApp message preview */}
            <Grid.Item columnSpan={{ xs: 1, md: 1 }}>
              <BlockStack gap="small-300">
                <Text variant="headingSm" as="h4" fontWeight="semibold">
                  WhatsApp Preview
                </Text>
                <Text variant="bodySm" color="subdued">
                  Live preview on customer device.
                </Text>

                <Box
                  background="bg-surface-secondary"
                  borderRadius="large-100"
                  padding="base"
                  borderWidth="0165"
                  borderColor="border"
                >
                  <BlockStack gap="base">
                    <InlineStack gap="small-200" alignItems="center">
                      <Avatar size="small" name={brandName} />
                      <BlockStack gap="none">
                        <Text variant="bodySm" fontWeight="semibold">
                          {brandName}
                        </Text>
                        <Text variant="bodySm" color="subdued">
                          WhatsApp Business
                        </Text>
                      </BlockStack>
                    </InlineStack>

                    <Box
                      background="bg-surface"
                      padding="base"
                      borderRadius="base"
                      borderWidth="0165"
                      borderColor="border"
                    >
                      <BlockStack gap="small-200">
                        <Box borderRadius="small-100" overflow="hidden">
                          <Image
                            src={imageUrl}
                            alt={editableTitle}
                            aspectRatio="16/9"
                            objectFit="cover"
                          />
                        </Box>

                        <Text variant="bodySm" fontWeight="semibold">
                          {editableTitle}
                        </Text>

                        <Text variant="bodySm" as="p">
                          {messageBody}
                        </Text>

                        <InlineStack justifyContent="space-between" alignItems="center">
                          <Text variant="bodySm" color="subdued">
                            10:42 AM
                          </Text>
                          <Icon type="check" tone="info" />
                        </InlineStack>

                        <Button variant="secondary" inlineSize="fill">
                          {buttonLabel}
                        </Button>
                      </BlockStack>
                    </Box>
                  </BlockStack>
                </Box>
              </BlockStack>
            </Grid.Item>
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
}
