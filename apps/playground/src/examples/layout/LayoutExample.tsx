import { Card, Layout, Text, BlockStack } from "@xco-agency/corex-ui";

export function LayoutExample() {
  return (
    <Layout>
      <Layout.Section variant="oneThird">
        <Card>
          <BlockStack gap="small-200">
            <Text heading>Filters</Text>
            <Text color="subdued">One third of the row on desktop.</Text>
          </BlockStack>
        </Card>
      </Layout.Section>
      <Layout.Section>
        <Card>
          <BlockStack gap="small-200">
            <Text heading>Results</Text>
            <Text color="subdued">
              A section with no variant automatically fills the remaining columns of the
              row (two thirds). Below the md breakpoint both stack instead of squeezing
              onto a phone.
            </Text>
          </BlockStack>
        </Card>
      </Layout.Section>
      <Layout.Section variant="oneHalf">
        <Card>
          <Text>Half</Text>
        </Card>
      </Layout.Section>
      <Layout.Section variant="oneHalf">
        <Card>
          <Text>Half</Text>
        </Card>
      </Layout.Section>
    </Layout>
  );
}
