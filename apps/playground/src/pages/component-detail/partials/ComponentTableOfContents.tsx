import * as React from "react";
import { BlockStack, Clickable, Text } from "@xco-agency/corex-ui";
import type { TocItemType } from "../types";

export type ComponentTableOfContentsPropsType = {
  items: TocItemType[];
};

export function ComponentTableOfContents({ items }: ComponentTableOfContentsPropsType) {
  const [activeId, setActiveId] = React.useState<string>(items[0]?.id || "");

  React.useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 },
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    element.scrollIntoView({ behavior: "smooth" });
    setActiveId(id);
    window.history.pushState(null, "", `#${id}`);
  };

  if (items.length <= 1) return null;

  return (
    <BlockStack gap="small-200" position="sticky">
      <Text fontWeight="medium">On this page</Text>
      <BlockStack gap="none">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <Clickable
              key={item.id}
              onClick={() => scrollToId(item.id)}
              paddingInline={item.level === 2 ? "base" : "small-200"}
              paddingBlock="small-400"
              background={isActive ? "strong" : undefined}
              borderRadius="base"
            >
              <Text
                color={isActive ? "base" : "subdued"}
                fontWeight={isActive ? "medium" : "regular"}
                variant={item.level === 2 ? "small" : "base"}
                lineClamp={1}
              >
                {item.title}
              </Text>
            </Clickable>
          );
        })}
      </BlockStack>
    </BlockStack>
  );
}
