import { forwardRef, useEffect, useState } from "react";
import type { ForwardedRef, ReactNode } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import { Button } from "../Button";
import { Box } from "../Box";
import { Tooltip } from "../Tooltip";
import type { TabItemType, TabsPropsType } from "./Tabs.types";

const SStack = createWebComponent<HTMLElement>("s-stack");

export type TabsComponentType = <T extends string | number = string | number>(
  props: TabsPropsType<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => ReactNode;

/**
 * Tabs component supporting both legacy Polaris index-based selection
 * and the extended tab-ID selection API, with Polaris web-component stacks and buttons.
 */
export const Tabs = forwardRef(function Tabs<T extends string | number = string | number>(
  {
    tabs,
    selected,
    onSelect,
    selectedTab,
    onTabChange,
    showBadge = true,
    showContent = true,
    showTooltip = false,
    rightSide,
    children,
    className,
    id,
    ...rest
  }: TabsPropsType<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const [uncontrolledSelected, setUncontrolledSelected] = useState(0);

  useEffect(() => {
    if (selectedTab === null && tabs.length > 0 && onTabChange) {
      const firstActiveTab = tabs.find((tab) => !tab.disabled) ?? tabs[0];
      if (firstActiveTab) {
        onTabChange(firstActiveTab.id as T);
      }
    }
  }, [selectedTab, tabs, onTabChange]);

  const handleSelect = (tab: TabItemType, index: number) => {
    if (tab.disabled) return;
    if (selected === undefined && selectedTab === undefined) {
      setUncontrolledSelected(index);
    }
    onSelect?.(index);
    onTabChange?.(tab.id as T);
  };

  return (
    <div ref={ref} className={className} id={id} {...rest}>
      <SStack direction="inline" justifyContent="space-between" alignItems="center">
        <SStack direction="inline" gap="small-300" alignItems="center">
          {tabs
            .filter((tab) => !tab.disabled)
            .map((tab, index) => {
              const isSelected =
                selectedTab !== undefined
                  ? selectedTab === tab.id
                  : (selected ?? uncontrolledSelected) === index;

              const button = (
                <Button
                  variant="tertiary"
                  pressed={isSelected}
                  disabled={tab.disabled}
                  accessibilityLabel={tab.accessibilityLabel}
                  onClick={() => handleSelect(tab, index)}
                >
                  {tab.icon && (
                    <span
                      style={{
                        marginRight: "0.25rem",
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                    >
                      {tab.icon}
                    </span>
                  )}
                  {showContent && (tab.content ?? tab.label)}
                  {showBadge && tab.badge !== undefined ? ` (${tab.badge})` : ""}
                </Button>
              );

              const tabNode =
                showTooltip && tab.description ? (
                  <Tooltip content={tab.description}>{button}</Tooltip>
                ) : (
                  button
                );

              return (
                <div
                  key={`tab-${tab.id}`}
                  style={{
                    borderRadius: "0.5rem",
                    backgroundColor: isSelected ? "#f0f0f0" : "transparent",
                  }}
                >
                  {tabNode}
                </div>
              );
            })}
        </SStack>

        {rightSide && (
          <SStack direction="inline" gap="small-200">
            {rightSide}
          </SStack>
        )}
      </SStack>

      {children && <Box padding="base">{children}</Box>}
    </div>
  );
}) as TabsComponentType;

export default Tabs;
