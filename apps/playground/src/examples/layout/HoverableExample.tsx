import { useState } from "react";
import {
  Badge,
  BlockStack,
  Button,
  Card,
  Grid,
  Hoverable,
  InlineStack,
  Text,
  TextField,
} from "@xco-agency/corex-ui";

const products = [
  { id: "1", name: "Winter Wool Jacket", stock: "24 in stock" },
  { id: "2", name: "Merino Scarf", stock: "8 in stock" },
  { id: "3", name: "Leather Gloves", stock: "Out of stock" },
];

export function HoverableExample() {
  const [title, setTitle] = useState("Winter Wool Jacket");

  return (
    <BlockStack gap="large-100">
      {/* A card with inputs: the actions appear on hover or focus, without shifting anything */}
      <Hoverable>
        <Card
          heading="Product details"
          actions={
            <Hoverable.Show animation="scale">
              <Button variant="tertiary" icon="edit">
                Edit
              </Button>
            </Hoverable.Show>
          }
        >
          <BlockStack gap="base">
            <TextField label="Title" value={title} onChange={setTitle} />
            <InlineStack gap="small-200" alignItems="center">
              <Hoverable.Hide animation="scale">
                <Text color="subdued">Hover the card to see the actions</Text>
              </Hoverable.Hide>
              <Hoverable.Show animation="slide-up">
                <InlineStack gap="small-200">
                  <Button>Duplicate</Button>
                  <Button tone="critical">Delete</Button>
                </InlineStack>
              </Hoverable.Show>
            </InlineStack>
          </BlockStack>
        </Card>
      </Hoverable>

      {/* One group per card, with a render function instead of Show / Hide */}
      <Grid columns={{ xs: 1, md: 3 }} gap="base">
        {products.map((product) => (
          <Hoverable key={product.id} closeDelay={100}>
            {({ hovered }) => (
              <Card heading={product.name}>
                <InlineStack
                  gap="small-200"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Badge tone={hovered ? "info" : undefined}>{product.stock}</Badge>
                  <Hoverable.Show animation="scale">
                    <Button variant="tertiary" icon="view" accessibilityLabel="Preview" />
                  </Hoverable.Show>
                </InlineStack>
              </Card>
            )}
          </Hoverable>
        ))}
      </Grid>
    </BlockStack>
  );
}
