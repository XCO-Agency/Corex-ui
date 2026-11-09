import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  BlockStack,
  Box,
  Clickable,
  Collapsible,
  Icon,
  InlineStack,
  Text,
} from "@xco-agency/corex-ui";
import { type ComponentEntry } from "@/data/registry";
import { getCategoryIcon } from "@/lib/category-icons";

export type SidebarCategoryItemPropsType = {
  category: string;
  components: ComponentEntry[];
  basePath: "components" | "blocks";
  currentPath: string;
  onNavigate?: () => void;
};

export function SidebarCategoryItem({
  category,
  components,
  basePath,
  currentPath,
  onNavigate,
}: SidebarCategoryItemPropsType) {
  const navigate = useNavigate();
  const isCategoryActive = components.some(
    (component) => currentPath === `/${basePath}/${component.slug}`,
  );
  const [isOpen, setIsOpen] = React.useState(isCategoryActive);

  React.useEffect(() => {
    if (isCategoryActive) setIsOpen(true);
  }, [isCategoryActive]);

  const openItem = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  return (
    <Collapsible
      framed={false}
      expanded={isOpen}
      onExpandedChange={setIsOpen}
      accessibilityLabel={category}
      content={
        <BlockStack gap="none">
          {components.map((component) => {
            const itemPath = `/${basePath}/${component.slug}`;
            const selected = currentPath === itemPath;
            return (
              <Clickable
                key={itemPath}
                inlineSize="fill"
                paddingInline="small-200"
                paddingBlock="small-300"
                borderRadius="base"
                background={selected ? "strong" : undefined}
                accessibilityLabel={component.name}
                onClick={() => openItem(itemPath)}
              >
                <InlineStack alignItems="center" gap="small-300">
                  <Box inlineSize="20px" />
                  <Text lineClamp={1}>{component.name}</Text>
                </InlineStack>
              </Clickable>
            );
          })}
        </BlockStack>
      }
    >
      {({ expanded, toggle }) => (
        <Clickable
          inlineSize="fill"
          paddingInline="small-200"
          paddingBlock="small-300"
          borderRadius="base"
          background={isCategoryActive ? "strong" : undefined}
          onClick={toggle}
          aria-expanded={expanded}
        >
          <InlineStack alignItems="center" justifyContent="space-between" gap="small-200">
            <InlineStack alignItems="center" gap="small-300">
              <Icon source={getCategoryIcon(category)} />
              <Text fontWeight="medium" lineClamp={1}>
                {category}
              </Text>
            </InlineStack>
            <InlineStack alignItems="center" gap="small-300">
              <Text variant="xs" color="subdued">
                {components.length}
              </Text>
              <Icon source={expanded ? "chevron-up" : "chevron-down"} />
            </InlineStack>
          </InlineStack>
        </Clickable>
      )}
    </Collapsible>
  );
}
