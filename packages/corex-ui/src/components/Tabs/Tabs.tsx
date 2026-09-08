import { forwardRef, useEffect, useState } from "react";
import type { ForwardedRef, ReactNode } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import { Box } from "../Box";
import { Tooltip } from "../Tooltip";
import type { TabItemType, TabsPropsType } from "./Tabs.types";
import { Clickable } from "../Clickable";
import { Icon } from "../Icon";
import { Badge } from "../Badge";
import { Text } from "../Text";

const SStack = createWebComponent<HTMLElement>("s-stack");

/**
 * Tabs component supporting both legacy Polaris index-based selection
 * and the extended tab-ID selection API, with Polaris web-component stacks and buttons.
 */
export const Tabs = forwardRef(function Tabs(
  {
    tabs,
    selected,
    onSelect,
    showBadge = true,
    rightSide,
    children,
    className,
    id,
    ...rest
  }: TabsPropsType,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const handleSelect = (tab: TabItemType, index: number) => {
    if (tab.disabled) return;
    onSelect?.(index);
  };

  return (
    <div
      ref={ref}
      className={className}
      id={id}
      {...rest}
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            gap: 3,
          }}
        >
          {tabs.map((tab, index) => {
            const isSelected = selected === index;

            const button = (
              <Clickable
                background={isSelected ? "strong" : "transparent"}
                disabled={tab.disabled}
                paddingInline="small-300"
                blockSize="28px"
                maxInlineSize="none"
                borderRadius="base"
                accessibilityLabel={tab.accessibilityLabel}
                onClick={() => handleSelect(tab, index)}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    opacity: tab.disabled ? 0.5 : 1,
                  }}
                >
                  {tab.icon && <Icon type={tab.icon} />}
                  {tab.label && (
                    <Text variant="small" lineClamp={1} color="subdued" heading>
                      {tab.label}
                    </Text>
                  )}
                  {showBadge && tab.badge !== undefined && (
                    <Badge color="strong" tone={tab.disabled ? "neutral" : tab.badgeTone}>
                      {tab.badge}
                    </Badge>
                  )}
                </div>
              </Clickable>
            );

            return tab.tooltip ? (
              <Tooltip content={tab.tooltip}>{button}</Tooltip>
            ) : (
              button
            );
          })}
        </div>

        {rightSide && (
          <SStack direction="inline" gap="small-200">
            {rightSide}
          </SStack>
        )}
      </div>

      {children && children}
    </div>
  );
});

export default Tabs;
