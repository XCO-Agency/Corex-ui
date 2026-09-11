import { BlockStack, Image, InlineStack } from "@xco-agency/corex-ui";

export function ImageExample() {
  return (
    <BlockStack gap="base">
      <InlineStack gap="base" wrap>
        <Image
          src="https://burst.shopifycdn.com/photos/black-leather-choker-necklace.jpg"
          alt="Product photo"
          aspectRatio="1/1"
          objectFit="cover"
          width="120px"
          borderRadius="base"
        />
        <Image
          src="https://burst.shopifycdn.com/photos/black-leather-choker-necklace.jpg"
          alt="Product photo rounded"
          aspectRatio="16/9"
          objectFit="cover"
          width="200px"
          borderRadius="large"
        />
      </InlineStack>
    </BlockStack>
  );
}
