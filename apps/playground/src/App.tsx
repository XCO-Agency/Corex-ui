import { useState } from "react";
import {
  Badge,
  Banner,
  BlockStack,
  Box,
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  InlineStack,
  Modal,
  Page,
  Select,
  Spinner,
  Tabs,
  Text,
  TextField,
} from "@xco/corex-ui";

export function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("Ada Lovelace");
  const [country, setCountry] = useState("ca");
  const [accepted, setAccepted] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);

  return (
    <Page
      title="Corex UI playground"
      subtitle="Manual QA surface for every first-wave component"
      primaryAction={{ content: "Open modal", onAction: () => setModalOpen(true) }}
    >
      <BlockStack gap="400">
        {bannerVisible && (
          <Banner title="Heads up" tone="info" onDismiss={() => setBannerVisible(false)}>
            This banner can be dismissed.
          </Banner>
        )}

        <Card title="Buttons">
          <InlineStack gap="200">
            <Button primary onClick={() => alert("Primary clicked")}>
              Primary
            </Button>
            <Button destructive>Destructive</Button>
            <Button plain>Plain</Button>
            <Button disabled>Disabled</Button>
            <Badge tone="success">Active</Badge>
          </InlineStack>
          <ButtonGroup variant="segmented">
            <Button>One</Button>
            <Button>Two</Button>
            <Button>Three</Button>
          </ButtonGroup>
        </Card>

        <Card title="Form controls">
          <BlockStack gap="300">
            <TextField label="Name" value={name} onChange={(value) => setName(value)} />
            <Select
              label="Country"
              value={country}
              onChange={(value) => setCountry(value)}
              options={[
                { label: "Canada", value: "ca" },
                { label: "United States", value: "us" },
              ]}
            />
            <Checkbox
              label="I accept the terms"
              checked={accepted}
              onChange={(value) => setAccepted(value)}
            />
          </BlockStack>
        </Card>

        <Card title="Text & Spinner">
          <BlockStack gap="200">
            <Text variant="headingMd">Heading text</Text>
            <Text tone="critical">Critical tone text</Text>
            <Box>
              <Spinner accessibilityLabel="Loading" />
            </Box>
          </BlockStack>
        </Card>

        <Card title="Tabs">
          <Tabs
            tabs={[{ id: "all", content: "All" }, { id: "drafts", content: "Drafts" }]}
          >
            <Text>Selected tab panel content.</Text>
          </Tabs>
        </Card>
      </BlockStack>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Delete product"
        primaryAction={{
          content: "Delete",
          destructive: true,
          onAction: () => setModalOpen(false),
        }}
        secondaryActions={[{ content: "Cancel", onAction: () => setModalOpen(false) }]}
      >
        <Text>This can't be undone.</Text>
      </Modal>
    </Page>
  );
}
