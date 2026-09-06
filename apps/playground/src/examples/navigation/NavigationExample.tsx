import * as React from "react";
import {
  Navigation,
  Box,
  Text,
  Badge,
  InlineStack,
  BlockStack,
  Card,
  Page,
} from "@xco-agency/corex-ui";

export function NavigationExample() {
  const [selected, setSelected] = React.useState("templates");

  return (
    <Page>
      <InlineStack gap="600" alignItems="start">
        <Navigation sectionned inlineSize="240px" defaultSelected={selected}>
          <Navigation.Search />
          <Navigation.Section title="Settings">
            <Navigation.Item id="reviews" label="Reviews" icon="star" />
            <Navigation.Item
              id="templates"
              label="Email templates"
              icon="email"
              badge={<Badge tone="caution">new</Badge>}
            />
            <Navigation.Item id="products" label="Products" icon="product" />
            <Navigation.Label>Display & Marketing</Navigation.Label>
            <Navigation.Item id="widgets" label="Widgets" icon="view" />
            <Navigation.Item id="social" label="Social sharing" icon="share" />
          </Navigation.Section>

          <Navigation.Footer divider>
            <Navigation.Item id="settings" label="Settings" icon="settings" />
            <Navigation.Item
              id="help"
              label="Help & Support"
              icon="question-circle"
              url="https://shopify.dev"
            />
          </Navigation.Footer>
        </Navigation>

        <div style={{ flex: 1 }}>
          <Box inlineSize="100%">
            <Card heading="Navigation State">
              <BlockStack gap="200">
                <Text as="p">
                  Currently selected route: <strong>{selected}</strong>
                </Text>
                <Text as="p" color="subdued">
                  The Navigation component supports compound subcomponents (
                  <code>&lt;Navigation.Label /&gt;</code>,{" "}
                  <code>&lt;Navigation.Item /&gt;</code>,
                  <code>&lt;Navigation.Footer /&gt;</code>) and data-driven{" "}
                  <code>sections</code>.
                </Text>
              </BlockStack>
            </Card>
          </Box>
        </div>
      </InlineStack>
    </Page>
  );
}
