import { InlineStack, Link } from "@xco-agency/corex-ui";

export function LinkExample() {
  return (
    <InlineStack gap="base" wrap>
      <Link url="https://shopify.dev" external>
        Developer docs
      </Link>
      <Link url="https://shopify.dev" removeUnderline>
        Without underline
      </Link>
      <span style={{ color: "#707070" }}>
        <Link url="https://shopify.dev" monochrome>
          Monochrome link
        </Link>
      </span>
    </InlineStack>
  );
}
