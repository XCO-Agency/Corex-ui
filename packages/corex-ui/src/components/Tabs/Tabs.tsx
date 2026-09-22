import { forwardRef, useId } from "react";
import type { CSSProperties, ForwardedRef } from "react";
import { Tooltip } from "../Tooltip";
import type { TabItemType, TabsComponentType, TabsPropsType } from "./Tabs.types";
import { Clickable } from "../Clickable";
import { Icon } from "../Icon";
import { Badge } from "../Badge";
import { Text } from "../Text";
import { InlineStack } from "../InlineStack";
import { BlockStack } from "../BlockStack";
import { Box } from "../Box";
import { Popover, usePopover } from "../Popover";

function CompactTabsMenu<TId extends string | number = string>({
  tabs,
  isTabSelected,
  onSelectTab,
  showBadge = true,
}: {
  tabs: TabItemType<TId>[];
  isTabSelected: (tab: TabItemType<TId>, index: number) => boolean;
  onSelectTab: (tab: TabItemType<TId>, index: number) => void;
  showBadge?: boolean;
}) {
  const { close, popoverId } = usePopover();

  return (
    <Box padding="small-300" minInlineSize="180px">
      <BlockStack gap="small-500">
        {tabs.map((tab, index) => {
          const isSelected = isTabSelected(tab, index);

          const menuItem = (
            <Clickable
              key={tab.id ?? index}
              disabled={tab.disabled}
              background="transparent"
              paddingInline="small-200"
              blockSize="28px"
              borderRadius="large-100"
              inlineSize="fill"
              commandFor={popoverId}
              command="--hide"
              accessibilityLabel={tab.accessibilityLabel ?? tab.label}
              onClick={() => {
                if (tab.disabled) return;
                onSelectTab(tab, index);
                close();
              }}
            >
              <div
                style={
                  {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                    width: "100%",
                    height: "100%",
                    opacity: tab.disabled ? 0.5 : 1,
                    "--p-color-bg-surface-hover": "#f1f1f2",
                    "--p-color-bg-surface-secondary-hover": "#f1f1f2",
                    "--p-color-bg-surface-tertiary-hover": "#f1f1f2",
                    "--t-surface-secondary-hover": "#f1f1f2",
                    "--t-surface-tertiary-hover": "#f1f1f2",
                  } as CSSProperties
                }
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {isSelected && <Icon type="check" />}
                  </div>

                  {tab.icon && <Icon type={tab.icon} />}

                  {tab.label && (
                    <Text variant="small" lineClamp={1} heading={isSelected}>
                      {tab.label}
                    </Text>
                  )}
                </div>

                {showBadge && tab.badge !== undefined && (
                  <Badge color="strong" tone={tab.disabled ? "neutral" : tab.badgeTone}>
                    {tab.badge}
                  </Badge>
                )}
              </div>
            </Clickable>
          );

          if (tab.tooltip) {
            return (
              <Tooltip key={tab.id ?? index} content={tab.tooltip}>
                {menuItem}
              </Tooltip>
            );
          }

          return menuItem;
        })}
      </BlockStack>
    </Box>
  );
}

function TabsInner<TId extends string | number = string>(
  {
    tabs,
    selected,
    onSelect,
    value,
    onChange,
    showBadge = true,
    rightSide,
    compact = false,
    children,
    className,
    id,
    ...rest
  }: TabsPropsType<TId>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const generatedId = useId();
  const popoverId = id
    ? `${id}-popover`
    : `corex-tabs-popover-${generatedId.replace(/:/g, "")}`;

  const isTabSelected = (tab: TabItemType<TId>, index: number) => {
    if (value !== undefined) {
      return value !== null && (tab.id === value || String(tab.id) === String(value));
    }
    if (selected !== undefined && selected !== null) {
      return (
        selected === index || selected === tab.id || String(tab.id) === String(selected)
      );
    }
    return false;
  };

  const handleSelect = (tab: TabItemType<TId>, index: number) => {
    if (tab.disabled) return;
    if (onSelect) {
      if (typeof selected === "number") {
        (onSelect as (index: number) => void)(index);
      } else {
        (onSelect as (selected: TId, index?: number) => void)(tab.id, index);
      }
    }
    onChange?.(tab.id);
  };

  const selectedIndex = tabs.findIndex((tab, idx) => isTabSelected(tab, idx));
  const currentTab =
    selectedIndex >= 0 ? tabs[selectedIndex] : value === null ? undefined : tabs[0];

  return (
    <div
      ref={ref}
      className={className}
      id={id}
      {...rest}
      style={{
        width: compact ? "auto" : "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          flex: compact ? "auto" : 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
        }}
      >
        {compact ? (
          <Popover id={popoverId}>
            <Popover.Trigger>
              <Clickable
                background="transparent"
                disabled={tabs.length === 0}
                paddingInline="small-200"
                blockSize="28px"
                borderRadius="large-100"
                accessibilityLabel={
                  currentTab?.accessibilityLabel ?? currentTab?.label ?? "Select tab"
                }
              >
                <div
                  style={
                    {
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      height: "100%",
                    } as CSSProperties
                  }
                >
                  {currentTab?.icon && <Icon type={currentTab.icon} />}
                  {currentTab?.label && (
                    <Text
                      variant="small"
                      heading
                      color="base"
                      tone="neutral"
                      lineClamp={1}
                    >
                      {currentTab.label}
                    </Text>
                  )}
                  {showBadge && currentTab?.badge !== undefined && (
                    <Badge
                      color="strong"
                      tone={currentTab.disabled ? "neutral" : currentTab.badgeTone}
                    >
                      {currentTab.badge}
                    </Badge>
                  )}
                  <Icon type="select" tone="neutral" />
                </div>
              </Clickable>
            </Popover.Trigger>
            <Popover.Content>
              <CompactTabsMenu
                tabs={tabs}
                isTabSelected={isTabSelected}
                onSelectTab={handleSelect}
                showBadge={showBadge}
              />
            </Popover.Content>
          </Popover>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              gap: 3,
            }}
          >
            {tabs.map((tab, index) => {
              const isSelected = isTabSelected(tab, index);

              const button = (
                <Clickable
                  background={isSelected ? "strong" : "transparent"}
                  disabled={tab.disabled}
                  paddingInline="small-300"
                  blockSize="28px"
                  maxInlineSize="none"
                  borderRadius="large-100"
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
                      <Text variant="small" lineClamp={1} color="base" heading>
                        {tab.label}
                      </Text>
                    )}
                    {showBadge && tab.badge !== undefined && (
                      <Badge
                        color="strong"
                        tone={tab.disabled ? "neutral" : tab.badgeTone}
                      >
                        {tab.badge}
                      </Badge>
                    )}
                  </div>
                </Clickable>
              );

              return (
                <div
                  key={tab.id ?? index}
                  style={
                    {
                      display: "contents",
                      "--p-color-bg-surface-tertiary": isSelected
                        ? "#ddddddad"
                        : "transparent",
                      "--p-color-bg-surface-hover": "#ddddddad",
                      "--p-color-bg-surface-secondary-hover": "#ddddddad",
                      "--p-color-bg-surface-tertiary-hover": "#ddddddad",
                      "--t-surface-tertiary": isSelected ? "#ddddddad" : "transparent",
                      "--t-surface-secondary-hover": "#ddddddad",
                      "--t-surface-tertiary-hover": "#ddddddad",
                    } as CSSProperties
                  }
                >
                  {tab.tooltip ? (
                    <Tooltip content={tab.tooltip}>{button}</Tooltip>
                  ) : (
                    button
                  )}
                </div>
              );
            })}
          </div>
        )}
        {children}

        {rightSide && <InlineStack gap="small-200">{rightSide}</InlineStack>}
      </div>
    </div>
  );
}

/**
 * Tabs component supporting both legacy Polaris index-based selection (`selected`, `onSelect`)
 * and id-based selection (`value`, `onChange`), with Polaris web-component stacks and buttons.
 */
export const Tabs = forwardRef(TabsInner) as unknown as TabsComponentType;
Tabs.displayName = "Tabs";

export default Tabs;
