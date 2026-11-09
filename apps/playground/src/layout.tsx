import * as React from "react";
import { useLocation } from "react-router-dom";
import {
  BlockStack,
  Button,
  Drawer,
  InlineStack,
  Text,
  useBreakpoints,
} from "@xco-agency/corex-ui";
import { AppSidebar } from "@/components/app-sidebar";
import { SearchDialog } from "@/components/search/SearchDialog";
import { findEntryBySlug } from "@/data/registry";

export type LayoutPropsType = {
  children: React.ReactNode;
};

const STATIC_PAGES: [RegExp, string][] = [
  [/^\/installation$/, "Installation"],
  [/^\/icons$/, "Icons"],
  [/^\/apps?-icons$/, "Apps Icons"],
  [/^\/utils(\/|$)/, "Utils & Hooks"],
];

function useBreadcrumbTrail() {
  const { pathname } = useLocation();

  const staticPage = STATIC_PAGES.find(([pattern]) => pattern.test(pathname));
  if (staticPage) return { root: "Corex UI", trail: [staticPage[1]] };

  const match = pathname.match(/^\/(components|blocks)\/([^/]+)/);
  const entry = match ? findEntryBySlug(match[2]!) : null;
  const root = match?.[1] === "blocks" ? "Blocks" : "Components";
  return { root, trail: entry ? [entry.category, entry.name] : [] };
}

export default function Layout({ children }: LayoutPropsType) {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [navOpen, setNavOpen] = React.useState(false);
  const { mdDown } = useBreakpoints();
  const { root, trail } = useBreadcrumbTrail();

  const sidebar = (
    <AppSidebar
      onOpenSearch={() => {
        setNavOpen(false);
        setSearchOpen(true);
      }}
      onNavigate={() => setNavOpen(false)}
    />
  );

  return (
    <InlineStack
      className="playground-frame"
      alignItems="stretch"
      wrap={false}
      gap="none"
      blockSize="100vh"
      overflow="hidden"
    >
      {!mdDown && (
        <BlockStack
          className="playground-nav"
          inlineSize="240px"
          blockSize="100%"
          overflow="hidden"
          shrink={false}
        >
          <BlockStack blockSize="100%" overflowY="auto" padding="small">
            {sidebar}
          </BlockStack>
        </BlockStack>
      )}

      <BlockStack
        grow
        minInlineSize="0"
        minBlockSize="0"
        blockSize="100%"
        overflow="hidden"
        padding="small-300"
      >
        <BlockStack
          className="playground-canvas"
          grow
          minBlockSize="0"
          blockSize="calc(100% - 48px)"
          overflow="hidden"
          gap="none"
        >
          <BlockStack
            className="playground-topbar"
            paddingInline="base"
            paddingBlock="small-200"
          >
            <InlineStack
              alignItems="center"
              justifyContent="space-between"
              gap="small"
              wrap
            >
              <InlineStack alignItems="center" gap="small-200" wrap>
                {mdDown && (
                  <Button
                    icon="menu"
                    variant="tertiary"
                    accessibilityLabel="Open navigation"
                    onClick={() => setNavOpen(true)}
                  />
                )}
                <Text color="subdued">{root}</Text>
                {trail.map((crumb, index) => {
                  const isLast = index === trail.length - 1;
                  return (
                    <InlineStack key={crumb} alignItems="center" gap="small-200">
                      <Text color="subdued">/</Text>
                      <Text
                        fontWeight={isLast ? "semibold" : "regular"}
                        color={isLast ? "base" : "subdued"}
                      >
                        {crumb}
                      </Text>
                    </InlineStack>
                  );
                })}
              </InlineStack>
              <InlineStack alignItems="center" gap="small-200">
                <Button icon="wand" variant="tertiary" href="/SKILL.md" target="_blank">
                  SKILL.md
                </Button>
                <Button
                  icon="external"
                  variant="tertiary"
                  href="https://github.com/XCO-Agency/Corex-ui"
                  target="_blank"
                  accessibilityLabel="GitHub repository"
                >
                  GitHub
                </Button>
              </InlineStack>
            </InlineStack>
          </BlockStack>
          <BlockStack grow minBlockSize="0" overflowY="auto" padding="large-200">
            {children}
          </BlockStack>
        </BlockStack>
      </BlockStack>

      {mdDown && (
        <Drawer
          open={navOpen}
          onOpenChange={setNavOpen}
          swipeDirection="left"
          responsive={false}
        >
          <Drawer.Content width={240} className="playground-nav">
            <Drawer.Header>
              <Drawer.Title>Corex UI</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>{sidebar}</Drawer.Body>
          </Drawer.Content>
        </Drawer>
      )}

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </InlineStack>
  );
}
