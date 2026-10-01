import { forwardRef } from "react";
import { BlockStack } from "../BlockStack";
import { Clickable } from "../Clickable";
import { Icon } from "../Icon";
import { InlineStack } from "../InlineStack";
import { Text } from "../Text";
import type { ActionListItemType, ActionListPropsType } from "./ActionList.types";

/**
 * One action. A `Clickable`, so an item with a `url` is a real link and the rest
 * are buttons — which is what every call site drives through `onAction`.
 */
function ActionListItem({ item }: { item: ActionListItemType }) {
  return (
    <Clickable
      href={item.url}
      disabled={item.disabled}
      onClick={item.onAction ? () => item.onAction?.() : undefined}
      padding="small-100"
      borderRadius="base"
      inlineSize="fill"
      background={item.active ? "subdued" : undefined}
    >
      <InlineStack gap="small-100" blockAlign="center">
        {item.prefix}
        {item.icon ? (
          <Icon
            {...(typeof item.icon === "string"
              ? { type: item.icon }
              : { source: item.icon })}
            tone={item.destructive ? "critical" : undefined}
          />
        ) : null}
        <BlockStack gap="none" grow>
          <Text tone={item.destructive ? "critical" : undefined}>{item.content}</Text>
          {item.helpText ? (
            <Text color="subdued" variant="small">
              {item.helpText}
            </Text>
          ) : null}
        </BlockStack>
        {item.suffix}
      </InlineStack>
    </Clickable>
  );
}

/**
 * v12's list of actions, for use inside a [`Popover`](../../docs/components/popover.md).
 *
 * It is a menu in all but name, and `sections` keeps v12's grouping with an
 * optional title per group.
 */
export const ActionList = forwardRef<HTMLDivElement, ActionListPropsType>(
  function ActionList({ items, sections, actionRole, ...rest }, ref) {
    return (
      <BlockStack ref={ref} gap="none" {...rest}>
        {items?.map((item, index) => (
          <ActionListItem key={index} item={item} />
        ))}

        {sections?.map((section, sectionIndex) => (
          <BlockStack key={sectionIndex} gap="none">
            {section.title ? (
              <Text color="subdued" variant="small" fontWeight="medium">
                {section.title}
              </Text>
            ) : null}
            {section.items.map((item, index) => (
              <ActionListItem key={index} item={item} />
            ))}
          </BlockStack>
        ))}
      </BlockStack>
    );
  },
);
