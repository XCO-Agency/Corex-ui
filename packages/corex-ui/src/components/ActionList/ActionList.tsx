import { forwardRef } from "react";
import { BlockStack } from "../BlockStack";
import { Clickable } from "../Clickable";
import { Icon } from "../Icon";
import { InlineStack } from "../InlineStack";
import { Text } from "../Text";
import type { ActionListItemType, ActionListPropsType } from "./ActionList.types";
import { Popover, usePopover } from "../Popover";
import { Button } from "../Button";

/**
 * One action. A `Clickable`, so an item with a `url` is a real link and the rest
 * are buttons — which is what every call site drives through `onAction`.
 */
function ActionListItem({ item }: { item: ActionListItemType }) {
  const { popoverId } = usePopover();
  return (
    <Clickable
      href={item.href ?? item.url}
      disabled={item.disabled}
      onClick={item.onAction ? () => item.onAction?.() : undefined}
      paddingInlineStart="small-300"
      paddingInlineEnd="small"
      paddingBlockStart="small-400"
      paddingBlockEnd="small-400"
      minBlockSize="32px"
      borderRadius="large"
      inlineSize="fill"
      command="--hide"
      commandFor={popoverId}
      background={item.active ? "subdued" : undefined}
    >
      <InlineStack gap="small-200" alignItems="start">
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
            <Text color="subdued" variant="xs">
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
 * Action menu list with an integrated `Popover` overlay.
 *
 * Automatically wraps its trigger (`children`, or a default 3-dots `Button`)
 * and content in a `Popover`. Clicking any item automatically closes the popover.
 * Supports grouped items via `sections`.
 */
export const ActionList = forwardRef<HTMLDivElement, ActionListPropsType>(
  function ActionList({ items, sections, children, activator, ...rest }, ref) {
    return (
      <Popover>
        <Popover.Trigger>
          {children ?? activator ?? <Button variant="tertiary" icon="menu-horizontal" />}
        </Popover.Trigger>
        <Popover.Content>
          <BlockStack ref={ref} gap="small-400" padding="small-200" {...rest}>
            {items?.map((item, index) => (
              <ActionListItem key={index} item={item} />
            ))}

            {sections?.map((section, sectionIndex) => (
              <BlockStack
                key={sectionIndex}
                gap="small-500"
                paddingBlockStart="small-300"
              >
                {section.title ? (
                  <InlineStack paddingInline="small-200">
                    <Text color="subdued" variant="small" fontWeight="medium">
                      {section.title}
                    </Text>
                  </InlineStack>
                ) : null}
                {section.items.map((item, index) => (
                  <ActionListItem key={index} item={item} />
                ))}
              </BlockStack>
            ))}
          </BlockStack>
        </Popover.Content>
      </Popover>
    );
  },
);
