import {
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ForwardedRef,
  type KeyboardEvent,
} from "react";
import { mergeRefs } from "../../core/mergeRefs";
import { useIsomorphicLayoutEffect } from "../../core/useIsomorphicLayoutEffect";
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
import { TABS_CSS, TABS_STYLE_ID } from "./Tabs.css";

function ensureStyles(node: HTMLElement | null) {
  const doc = node?.ownerDocument;
  if (!doc) return;
  if (doc.getElementById(TABS_STYLE_ID)) return;
  const style = doc.createElement("style");
  style.id = TABS_STYLE_ID;
  style.textContent = TABS_CSS;
  doc.head.appendChild(style);
}

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
              borderRadius="full"
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
    inlineSize = "auto",
    children,
    className,
    id,
    ...rest
  }: TabsPropsType<TId>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const generatedId = useId();
  const popoverId = id
    ? `${id}-popover`
    : `corex-tabs-popover-${generatedId.replace(/:/g, "")}`;

  const isFullWidth = !compact && inlineSize === "fill";

  useIsomorphicLayoutEffect(() => ensureStyles(rootRef.current), []);

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
  const hasSelection = selectedIndex >= 0;
  const currentTab =
    selectedIndex >= 0 ? tabs[selectedIndex] : value === null ? undefined : tabs[0];

  const [thumb, setThumb] = useState({ x: 0, width: 0, ready: false });

  const updateThumb = useCallback(() => {
    const track = trackRef.current;
    if (!track || selectedIndex < 0) {
      setThumb((prev) => ({ ...prev, ready: false }));
      return;
    }
    const option = optionRefs.current[selectedIndex];
    if (!option) {
      setThumb((prev) => ({ ...prev, ready: false }));
      return;
    }
    const trackRect = track.getBoundingClientRect();
    const optionRect = option.getBoundingClientRect();
    setThumb({
      x: optionRect.left - trackRect.left,
      width: optionRect.width,
      ready: true,
    });
  }, [selectedIndex]);

  useIsomorphicLayoutEffect(() => {
    if (compact) return;
    updateThumb();

    const track = trackRef.current;
    if (!track || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => updateThumb());
    observer.observe(track);
    for (const option of optionRefs.current) {
      if (option) observer.observe(option);
    }
    return () => observer.disconnect();
  }, [compact, updateThumb, tabs, isFullWidth, showBadge]);

  const focusOption = (index: number) => {
    optionRefs.current[index]?.focus();
  };

  const moveSelection = (direction: 1 | -1) => {
    if (tabs.length === 0) return;
    const start = hasSelection ? selectedIndex : direction === 1 ? -1 : tabs.length;
    for (let step = 1; step <= tabs.length; step += 1) {
      const nextIndex = (start + direction * step + tabs.length * 2) % tabs.length;
      const tab = tabs[nextIndex];
      if (tab && !tab.disabled) {
        handleSelect(tab, nextIndex);
        focusOption(nextIndex);
        return;
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        moveSelection(1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        moveSelection(-1);
        break;
      case "Home": {
        event.preventDefault();
        const firstEnabled = tabs.findIndex((tab) => !tab.disabled);
        if (firstEnabled >= 0) {
          const tab = tabs[firstEnabled];
          if (tab) {
            handleSelect(tab, firstEnabled);
            focusOption(firstEnabled);
          }
        }
        break;
      }
      case "End": {
        event.preventDefault();
        for (let index = tabs.length - 1; index >= 0; index -= 1) {
          const tab = tabs[index];
          if (tab && !tab.disabled) {
            handleSelect(tab, index);
            focusOption(index);
            return;
          }
        }
        break;
      }
      default:
        break;
    }
  };

  const thumbStyle = {
    "--cx-tabs-thumb-x": `${thumb.x}px`,
    "--cx-tabs-thumb-width": `${thumb.width}px`,
    "--cx-tabs-thumb-opacity": thumb.ready ? 1 : 0,
  } as CSSProperties;

  return (
    <div
      ref={mergeRefs(rootRef, ref)}
      className={className}
      id={id}
      data-slot="tabs"
      data-compact={compact ? "true" : undefined}
      data-inline-size={isFullWidth ? "fill" : "auto"}
      style={{
        width: compact ? "auto" : "100%",
      }}
      {...rest}
    >
      <div data-slot="tabs-bar" style={{ width: isFullWidth ? "100%" : undefined }}>
        {compact ? (
          <div data-slot="tabs-compact">
            <Popover id={popoverId}>
              <Popover.Trigger>
                <Clickable
                  background="transparent"
                  disabled={tabs.length === 0}
                  paddingInlineStart="small-200"
                  paddingInlineEnd="small-300"
                  blockSize="28px"
                  borderRadius="full"
                  accessibilityLabel={
                    currentTab?.accessibilityLabel ?? currentTab?.label ?? "Select tab"
                  }
                >
                  <InlineStack
                    alignItems="center"
                    gap="small-400"
                    inlineSize="fill"
                    blockSize="fill"
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
                    <Icon type="select" color="subdued" />
                  </InlineStack>
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
          </div>
        ) : (
          <div
            ref={trackRef}
            data-slot="tabs-track"
            role="tablist"
            style={thumbStyle}
            onKeyDown={handleKeyDown}
          >
            <div data-slot="tabs-thumb" aria-hidden="true" />

            {tabs.map((tab, index) => {
              const isSelected = isTabSelected(tab, index);

              const button = (
                <button
                  type="button"
                  role="tab"
                  data-slot="tabs-option"
                  ref={(node) => {
                    optionRefs.current[index] = node;
                  }}
                  aria-selected={isSelected}
                  aria-label={tab.accessibilityLabel}
                  disabled={tab.disabled}
                  tabIndex={
                    tab.disabled
                      ? -1
                      : isSelected || (!hasSelection && index === 0)
                        ? 0
                        : -1
                  }
                  onClick={() => handleSelect(tab, index)}
                >
                  {tab.icon && <Icon type={tab.icon} />}
                  {tab.label && (
                    <span data-slot="tabs-option-label">{tab.label}</span>
                  )}
                  {showBadge && tab.badge !== undefined && (
                    <Badge
                      color="strong"
                      tone={tab.disabled ? "neutral" : tab.badgeTone}
                    >
                      {tab.badge}
                    </Badge>
                  )}
                </button>
              );

              return (
                <div key={tab.id ?? index} data-slot="tabs-option-wrap">
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
 * and id-based selection (`value`, `onChange`). Non-compact mode uses a Segment-style
 * pill track; compact mode renders a fully rounded dropdown trigger.
 */
export const Tabs = forwardRef(TabsInner) as unknown as TabsComponentType;
Tabs.displayName = "Tabs";

export default Tabs;
