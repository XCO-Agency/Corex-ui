import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ForwardedRef,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { mergeRefs } from "../../core/mergeRefs";
import { useIsomorphicLayoutEffect } from "../../core/useIsomorphicLayoutEffect";
import { Tooltip } from "../Tooltip";
import type {
  TabItemType,
  TabsComponentType,
  TabsContentPropsType,
  TabsContextType,
  TabsPropsType,
  TabsVariantType,
} from "./Tabs.types";
import { Clickable } from "../Clickable";
import { Icon } from "../Icon";
import { Badge } from "../Badge";
import { Text } from "../Text";
import { InlineStack } from "../InlineStack";
import { BlockStack } from "../BlockStack";
import { Box } from "../Box";
import { Popover, usePopover } from "../Popover";
import { TABS_CSS, TABS_STYLE_ID } from "./Tabs.css";

const TabsContext = createContext<TabsContextType | null>(null);

function ensureStyles(node: HTMLElement | null) {
  const doc = node?.ownerDocument ?? (typeof document !== "undefined" ? document : null);
  if (!doc) return;
  const existing = doc.getElementById(TABS_STYLE_ID);
  if (existing) {
    if (existing.textContent !== TABS_CSS) {
      existing.textContent = TABS_CSS;
    }
    return;
  }
  const style = doc.createElement("style");
  style.id = TABS_STYLE_ID;
  style.textContent = TABS_CSS;
  doc.head.appendChild(style);
}

/**
 * Panel rendered under card-variant tabs. Only the panel whose `value`
 * matches the selected tab is shown.
 */
export const TabsContent = forwardRef<HTMLDivElement, TabsContentPropsType>(
  function TabsContent({ value, children, className, id }, ref) {
    const ctx = useContext(TabsContext);
    const selected = ctx?.selectedValue;
    const isActive =
      selected != null && (selected === value || String(selected) === String(value));

    return (
      <div
        ref={ref}
        id={id}
        className={className}
        data-slot="tabs-content"
        data-active={isActive ? "true" : "false"}
        role="tabpanel"
        hidden={!isActive}
      >
        {isActive ? children : null}
      </div>
    );
  },
);
TabsContent.displayName = "Tabs.Content";

function isTabsContentElement(
  child: ReactNode,
): child is ReactElement<TabsContentPropsType> {
  return (
    isValidElement(child) &&
    (child.type === TabsContent ||
      (child.type as { displayName?: string }).displayName === "Tabs.Content")
  );
}

function partitionChildren(children: ReactNode): {
  panels: ReactElement<TabsContentPropsType>[];
  extras: ReactNode[];
} {
  const panels: ReactElement<TabsContentPropsType>[] = [];
  const extras: ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (isTabsContentElement(child)) {
      panels.push(child);
    } else if (child != null && child !== false) {
      extras.push(child);
    }
  });

  return { panels, extras };
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
              background={isSelected ? "subdued" : "transparent"}
              paddingInline="small-200"
              blockSize="28px"
              borderRadius="large-200"
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
    variant: variantProp = "segment",
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

  const variant: TabsVariantType = compact ? "segment" : variantProp;
  const isCard = variant === "card" && !compact;
  const isFullWidth = isCard || (!compact && inlineSize === "fill");

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

  const selectedValue: string | number | null | undefined =
    value !== undefined
      ? value
      : selectedIndex >= 0
        ? tabs[selectedIndex]?.id
        : selected === null
          ? null
          : currentTab?.id;

  const { panels, extras } = useMemo(() => partitionChildren(children), [children]);

  const contextValue = useMemo<TabsContextType>(
    () => ({ selectedValue, variant }),
    [selectedValue, variant],
  );

  const [thumb, setThumb] = useState({ x: 0, width: 0, ready: false });

  const updateThumb = useCallback(() => {
    if (isCard) return;
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
  }, [isCard, selectedIndex]);

  useIsomorphicLayoutEffect(() => {
    if (compact || isCard) return;
    updateThumb();

    const track = trackRef.current;
    if (!track || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => updateThumb());
    observer.observe(track);
    for (const option of optionRefs.current) {
      if (option) observer.observe(option);
    }
    return () => observer.disconnect();
  }, [compact, isCard, updateThumb, tabs, isFullWidth, showBadge]);

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

  const tabList = compact ? (
    <Popover id={popoverId}>
      <Popover.Trigger>
        <Clickable
          background="transparent"
          disabled={tabs.length === 0}
          paddingInlineStart="small-200"
          paddingInlineEnd="small-400"
          blockSize="28px"
          borderRadius="large-200"
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
              <Text variant="small" fontWeight="medium" lineClamp={1}>
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
  ) : (
    <div
      ref={trackRef}
      data-slot="tabs-track"
      role="tablist"
      style={isCard ? undefined : thumbStyle}
      onKeyDown={handleKeyDown}
    >
      {!isCard && <div data-slot="tabs-thumb" aria-hidden="true" />}

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
              tab.disabled ? -1 : isSelected || (!hasSelection && index === 0) ? 0 : -1
            }
            onClick={() => handleSelect(tab, index)}
          >
            {tab.icon && <Icon type={tab.icon} />}
            {tab.label && <span data-slot="tabs-option-label">{tab.label}</span>}
            {showBadge && tab.badge !== undefined && (
              <Badge color="strong" tone={tab.disabled ? "neutral" : tab.badgeTone}>
                {tab.badge}
              </Badge>
            )}
          </button>
        );

        return (
          <div key={tab.id ?? index} data-slot="tabs-option-wrap">
            {tab.tooltip ? <Tooltip content={tab.tooltip}>{button}</Tooltip> : button}
          </div>
        );
      })}
    </div>
  );

  const bar = (
    <div
      data-slot="tabs-bar"
      style={{ width: isFullWidth || isCard ? "100%" : undefined }}
    >
      {tabList}

      {extras.length > 0 &&
        (isCard ? <div data-slot="tabs-bar-extra">{extras}</div> : extras)}

      {rightSide && <InlineStack gap="small-200">{rightSide}</InlineStack>}
    </div>
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div
        ref={mergeRefs(rootRef, ref)}
        className={className}
        id={id}
        data-slot="tabs"
        data-variant={variant}
        data-compact={compact ? "true" : undefined}
        data-inline-size={isFullWidth ? "fill" : "auto"}
        style={{
          width: compact && !isCard ? "auto" : "100%",
        }}
        {...rest}
      >
        {isCard ? (
          <div data-slot="tabs-shell">
            {bar}
            {panels.length > 0 && <div data-slot="tabs-panels">{panels}</div>}
          </div>
        ) : (
          bar
        )}
      </div>
    </TabsContext.Provider>
  );
}

/**
 * Tabs with segment (pill) and card (folder) variants.
 * Use `Tabs.Content` with `variant="card"` for connected panel content.
 */
export const Tabs = forwardRef(TabsInner) as unknown as TabsComponentType;
Tabs.displayName = "Tabs";
Tabs.Content = TabsContent;

export default Tabs;
