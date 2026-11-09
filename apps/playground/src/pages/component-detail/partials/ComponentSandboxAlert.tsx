import { Banner, InlineCode, Text } from "@xco-agency/corex-ui";

export function ComponentSandboxAlert() {
  return (
    <Banner tone="warning" heading="Requires a real embedded Shopify admin session">
      <Text as="p">
        This playground runs as a standalone browser tab, not an embedded app. Global APIs
        like <InlineCode>window.shopify</InlineCode> and components like{" "}
        <InlineCode>AppWindow</InlineCode> need the Shopify Admin context to execute
        fully. The preview interaction below is illustrative, while the code samples show
        the real, copyable API.
      </Text>
    </Banner>
  );
}
