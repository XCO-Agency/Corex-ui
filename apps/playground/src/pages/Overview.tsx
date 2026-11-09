import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BlockStack,
  Box,
  Button,
  Clickable,
  Divider,
  Grid,
  Image,
  InlineStack,
  Text,
} from "@xco-agency/corex-ui";
import { categories, registry, blocks, type ComponentEntry } from "../data/registry";
import { thumbnails } from "../components/icons/ComponentThumbnails";
import { thumbnailImages } from "../data/thumbnail-images";
import { CommandSnippet } from "@/components/CommandSnippet";
import { COREX_UI_VERSION } from "@/lib/version";

function Tile({ item, href }: { item: ComponentEntry; href: string }) {
  const navigate = useNavigate();
  const screenshot = thumbnailImages[item.slug];
  const Thumbnail = thumbnails[item.slug];

  return (
    <Clickable
      onClick={() => navigate(href)}
      inlineSize="fill"
      borderWidth="base"
      borderColor="base"
      borderRadius="large-200"
      overflow="hidden"
      background="base"
    >
      <BlockStack gap="none">
        <Box background="subdued" padding="none" minBlockSize="96px">
          {screenshot ? (
            <Image
              src={screenshot}
              alt=""
              aspectRatio="2/1"
              objectFit="contain"
              loading="lazy"
            />
          ) : Thumbnail ? (
            <Thumbnail />
          ) : (
            <Text color="subdued" variant="small">
              {item.name}
            </Text>
          )}
        </Box>
        <Divider />
        <Box padding="small">
          <BlockStack gap="small-500">
            <Text fontWeight="medium" lineClamp={1}>
              {item.name}
            </Text>
            <Text color="subdued" variant="small" lineClamp={1}>
              {item.description}
            </Text>
          </BlockStack>
        </Box>
      </BlockStack>
    </Clickable>
  );
}

function GroupHeading({
  id,
  title,
  count,
}: {
  id: string;
  title: string;
  count: number;
}) {
  return (
    <Box id={id}>
      <InlineStack gap="small-200" alignItems="baseline">
        <Text as="h2" variant="headingSm" heading>
          {title}
        </Text>
        <Text color="subdued" variant="small">
          {count}
        </Text>
      </InlineStack>
    </Box>
  );
}

export function Overview() {
  const navigate = useNavigate();
  const { hash } = useLocation();

  React.useEffect(() => {
    if (!hash) return;
    document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
  }, [hash]);

  const totalBlocks = blocks.reduce((acc, group) => acc + group.components.length, 0);
  const componentGroups = categories
    .map((category) => ({
      category,
      items: registry.filter((entry) => entry.category === category),
    }))
    .filter((group) => group.items.length > 0);

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView();
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <InlineStack justifyContent="center">
      <BlockStack inlineSize="100%" maxInlineSize="72rem" gap="large-300">
        <BlockStack gap="small">
          <Text color="subdued" variant="small">
            v{COREX_UI_VERSION} · MIT
          </Text>
          <Text as="h1" variant="headingXl" heading>
            Build Shopify apps, ship faster
          </Text>
          <Text as="p" color="subdued">
            A legacy @shopify/polaris-compatible component library backed by
            Shopify&apos;s Polaris web components. Swap the import, keep your code.
          </Text>
          <InlineStack gap="small" alignItems="center" wrap>
            <CommandSnippet command="pnpm add @xco-agency/corex-ui" />
            <Button
              variant="primary"
              icon="arrow-right"
              onClick={() => navigate("/installation")}
            >
              Get started
            </Button>
          </InlineStack>
          <Text color="subdued" variant="small">
            {registry.length} components · {totalBlocks} blocks · 6 hooks & utils
          </Text>
        </BlockStack>

        <InlineStack gap="small-200" wrap>
          {componentGroups.map(({ category, items }) => (
            <Button key={category} variant="tertiary" onClick={() => jumpTo(category)}>
              {category} {items.length}
            </Button>
          ))}
          {blocks.length > 0 && (
            <Button variant="tertiary" onClick={() => jumpTo("blocks")}>
              Blocks {totalBlocks}
            </Button>
          )}
        </InlineStack>

        {componentGroups.map(({ category, items }) => (
          <BlockStack key={category} gap="small">
            <GroupHeading id={category} title={category} count={items.length} />
            <Grid columns={{ xs: 2, sm: 3, md: 4, lg: 5 }} gap="small">
              {items.map((item) => (
                <Grid.Item key={item.slug}>
                  <Tile item={item} href={`/components/${item.slug}`} />
                </Grid.Item>
              ))}
            </Grid>
          </BlockStack>
        ))}

        {blocks.length > 0 && (
          <BlockStack gap="large-200">
            <Box
              id="blocks"
              paddingBlockStart="large"
              borderWidth="base"
              borderColor="base"
            >
              <BlockStack gap="small-200">
                <Text as="h2" variant="headingMd" heading>
                  Blocks
                </Text>
                <Text as="p" color="subdued">
                  Ready-made compositions you copy into your app with one command.
                </Text>
              </BlockStack>
            </Box>
            {blocks.map(({ category, components }) => (
              <BlockStack key={category} gap="small">
                <GroupHeading
                  id={`blocks-${category}`}
                  title={category}
                  count={components.length}
                />
                <Grid columns={{ xs: 1, sm: 2, lg: 3 }} gap="small">
                  {components.map((item) => (
                    <Grid.Item key={item.slug}>
                      <Tile item={item} href={`/blocks/${item.slug}`} />
                    </Grid.Item>
                  ))}
                </Grid>
              </BlockStack>
            ))}
          </BlockStack>
        )}
      </BlockStack>
    </InlineStack>
  );
}
