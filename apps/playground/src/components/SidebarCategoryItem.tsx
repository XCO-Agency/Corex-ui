import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  BlockStack,
  Clickable,
  Collapsible,
  Icon,
  InlineStack,
  Navigation,
  Text,
} from "@xco-agency/corex-ui";
import { type ComponentEntry } from "@/data/registry";

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
        <BlockStack gap="none" paddingInlineStart="small">
          {components.map((component) => {
            const itemPath = `/${basePath}/${component.slug}`;
            return (
              <Navigation.Item
                key={itemPath}
                id={itemPath}
                label={component.name}
                selected={currentPath === itemPath}
                onClick={() => openItem(itemPath)}
              />
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
            <Text fontWeight="medium" lineClamp={1}>
              {category}
            </Text>
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
