import { Fragment, forwardRef } from "react";
import type { CSSProperties, ForwardedRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import { Tooltip } from "../Tooltip";
import type { TabItemType, TabsComponentType, TabsPropsType } from "./Tabs.types";
import { Clickable } from "../Clickable";
import { Icon } from "../Icon";
import { Badge } from "../Badge";
import { Text } from "../Text";

const SStack = createWebComponent<HTMLElement>("s-stack");

function TabsInner<TId extends string | number = string>(
  {
    tabs,
    selected,
    onSelect,
    value,
    onChange,
    showBadge = true,
    rightSide,
    children,
    className,
    id,
    ...rest
  }: TabsPropsType<TId>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const handleSelect = (tab: TabItemType<TId>, index: number) => {
    if (tab.disabled) return;
    onSelect?.(index);
    onChange?.(tab.id);
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
            const isSelected =
              value !== undefined
                ? value !== null && (tab.id === value || String(tab.id) === String(value))
                : selected !== undefined && selected !== null
                  ? selected === index
                  : false;

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
                    <Text
                      variant="small"
                      lineClamp={1}
                      color="base"
                      tone="neutral"
                      heading
                    >
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

            return (
              <div
                key={tab.id ?? index}
                style={
                  {
                    display: "contents",
                    "--t-surface-tertiary-26021": isSelected ? "#dcdcdc" : "transparent",
                    "--t-surface-secondary-hover-26021": "#dcdcdc",
                    "--t-surface-tertiary-hover-26021": "#dcdcdc",
                  } as CSSProperties
                }
              >
                {tab.tooltip ? <Tooltip content={tab.tooltip}>{button}</Tooltip> : button}
              </div>
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
}

/**
 * Tabs component supporting both legacy Polaris index-based selection (`selected`, `onSelect`)
 * and id-based selection (`value`, `onChange`), with Polaris web-component stacks and buttons.
 */
export const Tabs = forwardRef(TabsInner) as unknown as TabsComponentType;
Tabs.displayName = "Tabs";

export default Tabs;
