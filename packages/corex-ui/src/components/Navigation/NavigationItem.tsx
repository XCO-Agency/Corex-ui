import * as React from "react";
import { Icon } from "../Icon";
import { Clickable } from "../Clickable";
import { InlineStack } from "../InlineStack";
import { Text } from "../Text";
import { useNavigationContext } from "./Navigation.context";
import type { NavigationItemComponentType, NavigationItemPropsType } from "./Navigation.types";


function NavigationItemInner<TId extends string | number = string>(
  {
    id,
    label,
    icon,
    url,
    badge,
    disabled = false,
    selected,
    onClick,
    children,
    ariaLabel,
    ...rest
  }: NavigationItemPropsType<TId>,
  ref: React.ForwardedRef<HTMLElement>,
) {
  const context = useNavigationContext<TId>();

  const displayLabel = label ?? (typeof children === "string" ? children : undefined);
  const activeSearch = context?.search?.trim().toLowerCase();

  // Search filtering if active in context
  if (
    activeSearch &&
    displayLabel &&
    !displayLabel.toLowerCase().includes(activeSearch)
  ) {
    return null;
  }

  const isSelected =
    selected !== undefined
      ? selected
      : id !== undefined && context?.selectedId !== undefined
        ? context.selectedId === id || String(context.selectedId) === String(id)
        : false;

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    if (id !== undefined) {
      context?.onSelect?.(id);
    }
  };

  return (
    <Clickable
      ref={ref}
      inlineSize="fill"
      borderRadius="base"
      paddingInline="small-400"
      paddingBlock="small-300"
      background={isSelected ? "strong" : undefined}
      href={url}
      disabled={disabled}
      onClick={handleClick}
      aria-label={
        ariaLabel || (typeof displayLabel === "string" ? displayLabel : undefined)
      }
      {...rest}
    >
      <InlineStack
        inlineSize="100%"
        alignItems="center"
        justifyContent="space-between"
        gap="small-300"
      >
        <InlineStack alignItems="center" gap="small-300">
          {icon && <Icon source={icon} />}
          <Text lineClamp={1} as="p">
            {children ?? label}
          </Text>
        </InlineStack>
        {badge}
      </InlineStack>
    </Clickable>
  );
}

export const NavigationItem = React.forwardRef(
  NavigationItemInner,
) as unknown as NavigationItemComponentType;
NavigationItem.displayName = "NavigationItem";

