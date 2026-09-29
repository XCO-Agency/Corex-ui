import React, {
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
  useEffect,
  type ChangeEvent,
  type CSSProperties,
  type ReactElement,
} from "react";
import { Box } from "../Box";
import { BlockStack } from "../BlockStack";
import { InlineStack } from "../InlineStack";
import { Text } from "../Text";
import { Button } from "../Button";
import { Clickable } from "../Clickable";
import { Icon } from "../Icon";
import { Badge } from "../Badge";
import { Divider } from "../Divider";
import { Switch } from "../Switch";
import { Select } from "../Select";
import { SearchField } from "../SearchField";
import { Tooltip } from "../Tooltip";
import { Popover } from "../Popover";
import { IconTile } from "../IconTile";
import { ChoiceList } from "../ChoiceList";
import { FilterPortalPopover } from "./FilterPortalPopover";
import type {
  FilterItemType,
  FiltersActionsPropsType,
  FiltersAppliedPillPropsType,
  FiltersAppliedPropsType,
  FiltersColumnsPopoverPropsType,
  FiltersComponentType,
  FiltersPropsType,
  FiltersSearchFieldPropsType,
  FiltersSearchPropsType,
  FiltersShortcutPropsType,
} from "./Filters.types";

/**
 * Standard SearchField wrapper.
 */
export function FiltersSearch({
  value = "",
  placeholder = "search by keywords",
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  debounceDelay = 0,
  id,
}: FiltersSearchPropsType) {
  return (
    <BlockStack grow minInlineSize="220px">
      <SearchField
        id={id}
        label="Search"
        labelAccessibilityVisibility="exclusive"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        debounceDelay={debounceDelay}
      />
    </BlockStack>
  );
}
FiltersSearch.displayName = "FiltersSearch";

/**
 * Interactive unified Search and Filter input container with focus dropdown.
 * Renamed to FiltersSearchField (Filters.SearchField).
 */
export function FiltersSearchField<T = unknown>({
  queryValue = "",
  queryPlaceholder = "search by keywords",
  onQueryChange,
  onQueryClear,
  onQueryBlur,
  onQueryFocus,
  tabs,
  views,
  leftSlot,
  filters = [],
  appliedFilters = [],
  onAddFilter,
  onFilterSelect,
  onOperatorChange,
  onClearAll,
  disabled = false,
  id,
}: FiltersSearchFieldPropsType<T>) {
  type ActivePopoverType =
    | { type: "categories" }
    | { type: "value"; key: string }
    | { type: "operator"; key: string }
    | null;

  const [activePopover, setActivePopover] = useState<ActivePopoverType>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [customValueInput, setCustomValueInput] = useState("");

  const availableFilters = filters.filter(
    (filter) => !appliedFilters.some((af) => af.key === filter.key),
  );

  const baseId = useId().replace(/:/g, "");
  const categoriesAnchorId = `corex-filters-cat-anchor-${baseId}`;

  const containerRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputWrapperRef = useRef<HTMLElement>(null);
  const pendingAutoOpenRef = useRef<string | null>(null);
  const lastDismissedRef = useRef<{
    type: string;
    key?: string;
    timestamp: number;
  } | null>(null);

  const hasApplied = appliedFilters.length > 0;
  const hasQuery = queryValue.trim().length > 0;
  const isAnyPopoverOpen = activePopover !== null;

  const closeAllPopovers = useCallback(() => {
    setActivePopover(null);
    setIsFocused(false);
    setCustomValueInput("");
    inputRef.current?.blur();
  }, []);

  const handleClear = () => {
    setActivePopover(null);
    if (hasQuery) {
      onQueryChange?.("");
      onQueryClear?.();
    } else if (hasApplied) {
      onClearAll?.();
    }
  };

  const handleCategoryClick = (filter: FilterItemType) => {
    inputRef.current?.blur();
    setCustomValueInput("");

    // Close categories popover immediately
    setActivePopover(null);

    const existing = appliedFilters.find((f) => f.key === filter.key);
    if (!existing) {
      if (onAddFilter) {
        onAddFilter(filter.key);
      } else {
        const defaultOp =
          filter.defaultOperator ?? (filter.operators?.[0]?.value || "is");
        onFilterSelect?.(filter.key, filter.allowMultiple !== false ? [] : "", defaultOp);
      }
    }

    const isPopoverSupported =
      typeof HTMLElement !== "undefined" &&
      typeof HTMLDivElement.prototype.showPopover === "function";

    if (!isPopoverSupported) {
      setActivePopover({ type: "value", key: filter.key });
    } else {
      pendingAutoOpenRef.current = filter.key;
      setTimeout(() => {
        if (pendingAutoOpenRef.current === filter.key) {
          pendingAutoOpenRef.current = null;
          setActivePopover({ type: "value", key: filter.key });
        }
      }, 50);
    }
  };

  useEffect(() => {
    if (!pendingAutoOpenRef.current) return;
    const filterKey = pendingAutoOpenRef.current;
    const isApplied = appliedFilters.some((f) => f.key === filterKey);
    if (isApplied) {
      pendingAutoOpenRef.current = null;
      const timer = setTimeout(() => {
        setActivePopover({ type: "value", key: filterKey });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [appliedFilters]);

  const handleOptionClick = (
    filter: FilterItemType,
    optionValue: string | string[],
    operator?: string,
  ) => {
    const activeApplied = appliedFilters.find((f) => f.key === filter.key);
    const currentOp =
      operator ?? activeApplied?.operator ?? filter.defaultOperator ?? "is";
    onFilterSelect?.(filter.key, optionValue, currentOp);
  };

  const handleOperatorClick = (filter: FilterItemType, opValue: string) => {
    onOperatorChange?.(filter.key, opValue);
    const activeApplied = appliedFilters.find((f) => f.key === filter.key);
    if (activeApplied) {
      onFilterSelect?.(
        filter.key,
        activeApplied.value ?? (filter.allowMultiple !== false ? [] : ""),
        opValue,
      );
    }
  };

  return (
    <Box
      ref={containerRef}
      id={id}
      style={
        {
          display: "flex",
          alignItems: "center",
          position: "relative",
          flex: 1,
          minHeight: 34,
          background: "#ffffff",
          outline:
            isFocused || isAnyPopoverOpen ? "2px solid #005bd3" : "1px solid #dcdcdc",
          borderRadius: 8,
          paddingLeft: 4,
          paddingRight: 8,
          boxShadow: isFocused || isAnyPopoverOpen ? "0 0 0 1px #005bd3" : "none",
          transition: "border-color 150ms ease, box-shadow 150ms ease",
          boxSizing: "border-box",
        } as CSSProperties
      }
      onClick={(e: React.MouseEvent) => {
        if (!disabled && e.target === containerRef.current) {
          inputRef.current?.focus();
        }
      }}
    >
      <InlineStack alignItems="center" gap="small-200" wrap={false} inlineSize="100%">
        {/* Left slot (e.g. <Tabs compact ... />, views, or custom slot) */}
        {tabs ?? views ?? leftSlot ?? null}

        {/* Applied filter pills rendered inline */}
        {hasApplied ? (
          <InlineStack alignItems="center" gap="small-200">
            {appliedFilters.map((f) => {
              const filterDef = filters.find((item) => item.key === f.key);
              const fieldLabel = f.field ?? filterDef?.label ?? f.key;
              const currentOp = f.operator ?? filterDef?.defaultOperator ?? "is";
              const operatorDisplay = currentOp === "is_not" ? "is not" : currentOp;
              let valDisplay = "";
              if (typeof f.label === "string") {
                valDisplay = f.label;
              } else if (f.value !== undefined && f.value !== null) {
                if (Array.isArray(f.value)) {
                  if (f.value.length === 0) {
                    valDisplay = "Select...";
                  } else {
                    valDisplay = f.value
                      .map(
                        (v) =>
                          filterDef?.options?.find((opt) => opt.value === v)?.label ?? v,
                      )
                      .join(", ");
                  }
                } else if (f.value === "") {
                  valDisplay = "Select...";
                } else {
                  valDisplay =
                    filterDef?.options?.find((opt) => opt.value === f.value)?.label ??
                    String(f.value);
                }
              } else {
                valDisplay = "Select...";
              }

              const opTriggerId = `corex-filter-op-trig-${f.key}-${baseId}`;
              const valTriggerId = `corex-filter-val-trig-${f.key}-${baseId}`;
              const isOpOpen =
                activePopover?.type === "operator" && activePopover.key === f.key;
              const isValOpen =
                activePopover?.type === "value" && activePopover.key === f.key;

              return (
                <Box key={f.key}>
                  {/* Merged two-tone tag pill using IconTile */}
                  <InlineStack alignItems="center" gap="none" wrap={false}>
                    {/* Segment 1: Gray / Neutral [ Label + Operator ▾ ] */}
                    <Clickable
                      id={opTriggerId}
                      disabled={disabled}
                      background="transparent"
                      padding="none"
                      borderRadius="base"
                      accessibilityLabel={`${fieldLabel} operator`}
                      onClick={(e) => {
                        e.stopPropagation();
                        const now = Date.now();
                        const recentlyDismissed =
                          lastDismissedRef.current?.type === "operator" &&
                          lastDismissedRef.current.key === f.key &&
                          now - lastDismissedRef.current.timestamp < 200;

                        if (
                          (activePopover?.type === "operator" &&
                            activePopover.key === f.key) ||
                          recentlyDismissed
                        ) {
                          setActivePopover(null);
                        } else {
                          setActivePopover({ type: "operator", key: f.key });
                        }
                      }}
                    >
                      <IconTile
                        tone="neutral"
                        borderRadius="base"
                        size="auto"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "0 4px",
                          borderTopLeftRadius: "4px",
                          borderBottomLeftRadius: "4px",
                          borderTopRightRadius: "0px",
                          borderBottomRightRadius: "0px",
                          borderRight: "1px solid #fff",
                          cursor: disabled ? "default" : "pointer",
                          height: "22px",
                          userSelect: "none",
                          opacity: disabled ? 0.6 : 1,
                        }}
                      >
                        <Text variant="small">{fieldLabel}</Text>
                        <Text variant="small">{operatorDisplay}</Text>
                      </IconTile>
                    </Clickable>

                    <FilterPortalPopover
                      anchorRef={opTriggerId}
                      anchorId={opTriggerId}
                      isOpen={isOpOpen}
                      onClose={() => {
                        lastDismissedRef.current = {
                          type: "operator",
                          key: f.key,
                          timestamp: Date.now(),
                        };
                        setActivePopover((prev) =>
                          prev?.type === "operator" && prev.key === f.key
                            ? null
                            : prev,
                        );
                      }}
                      width="140px"
                    >
                      <Box padding="small-200">
                        <BlockStack gap="small-500">
                          {(
                            filterDef?.operators || [
                              { label: "Is", value: "is" },
                              { label: "Is not", value: "is_not" },
                            ]
                          ).map((op) => {
                            const isChecked =
                              currentOp === op.value ||
                              (op.value === "is_not" && currentOp === "is not") ||
                              (op.value === "is" && currentOp === "is");
                            return (
                              <Clickable
                                key={op.value}
                                background="transparent"
                                paddingInline="small-200"
                                blockSize="28px"
                                borderRadius="base"
                                inlineSize="fill"
                                accessibilityLabel={op.label}
                                onClick={() => {
                                  handleOperatorClick(
                                    filterDef ?? { key: f.key, label: fieldLabel },
                                    op.value,
                                  );
                                  setActivePopover(null);
                                }}
                              >
                                <InlineStack
                                  alignItems="center"
                                  gap="small-200"
                                  blockSize="fill"
                                >
                                  <Box minInlineSize="16px">
                                    {isChecked ? (
                                      <Icon type="check" tone="neutral" />
                                    ) : null}
                                  </Box>
                                  <Text
                                    variant="small"
                                    tone="neutral"
                                    heading={isChecked}
                                  >
                                    {op.label}
                                  </Text>
                                </InlineStack>
                              </Clickable>
                            );
                          })}
                        </BlockStack>
                      </Box>
                    </FilterPortalPopover>

                    {/* Segment 2: Info / Blue [ Value ▾ + ✕ ] */}
                    <InlineStack alignItems="center" gap="none" wrap={false}>
                      <Clickable
                        id={valTriggerId}
                        disabled={disabled}
                        background="transparent"
                        padding="none"
                        borderRadius="base"
                        accessibilityLabel={`${fieldLabel} value`}
                        onClick={(e) => {
                          e.stopPropagation();
                          const now = Date.now();
                          const recentlyDismissed =
                            lastDismissedRef.current?.type === "value" &&
                            lastDismissedRef.current.key === f.key &&
                            now - lastDismissedRef.current.timestamp < 200;

                          if (
                            (activePopover?.type === "value" &&
                              activePopover.key === f.key) ||
                            recentlyDismissed
                          ) {
                            setActivePopover(null);
                          } else {
                            setActivePopover({ type: "value", key: f.key });
                          }
                        }}
                      >
                        <IconTile
                          tone="info"
                          color="base"
                          borderRadius="base"
                          size="auto"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "0 4px",
                            borderTopLeftRadius: "0px",
                            borderBottomLeftRadius: "0px",
                            borderTopRightRadius: "0px",
                            borderBottomRightRadius: "0px",
                            cursor: disabled ? "default" : "pointer",
                            height: "22px",
                            userSelect: "none",
                            opacity: disabled ? 0.6 : 1,
                          }}
                        >
                          <Text variant="small" tone="info">
                            {valDisplay || "Select..."}
                          </Text>
                        </IconTile>
                      </Clickable>

                      <Clickable
                        disabled={disabled}
                        background="transparent"
                        padding="none"
                        borderRadius="base"
                        accessibilityLabel={`Remove ${fieldLabel} filter`}
                        aria-label={`Remove ${fieldLabel} filter`}
                        onClick={(e) => {
                          e.stopPropagation();
                          f.onRemove(f.key);
                          setActivePopover((prev) =>
                            prev && "key" in prev && prev.key === f.key ? null : prev,
                          );
                        }}
                      >
                        <IconTile
                          tone="info"
                          color="base"
                          borderRadius="base"
                          size="auto"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "0 4px",
                            borderTopLeftRadius: "0px",
                            borderBottomLeftRadius: "0px",
                            borderTopRightRadius: "4px",
                            borderBottomRightRadius: "4px",
                            cursor: disabled ? "default" : "pointer",
                            height: "22px",
                          }}
                        >
                          <Icon size="small" type="x" tone="info" />
                        </IconTile>
                      </Clickable>
                    </InlineStack>

                    <FilterPortalPopover
                      anchorRef={valTriggerId}
                      anchorId={valTriggerId}
                      isOpen={isValOpen}
                      onClose={() => {
                        lastDismissedRef.current = {
                          type: "value",
                          key: f.key,
                          timestamp: Date.now(),
                        };
                        setActivePopover((prev) =>
                          prev?.type === "value" && prev.key === f.key
                            ? null
                            : prev,
                        );
                      }}
                      width="260px"
                      maxHeight="340px"
                    >
                      <Box padding="small-200">
                        <BlockStack gap="small-300">
                          {/* Header with Title and Close Button */}
                          <InlineStack
                            alignItems="center"
                            justifyContent="space-between"
                            paddingInline="small-200"
                            paddingBlock="small-400"
                          >
                            <Text variant="small" heading tone="neutral">
                              {fieldLabel}
                            </Text>
                            <Clickable
                              background="transparent"
                              padding="small-500"
                              borderRadius="base"
                              accessibilityLabel="Close"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActivePopover(null);
                              }}
                            >
                              <Icon type="x" tone="neutral" />
                            </Clickable>
                          </InlineStack>
                          <Divider />

                          {/* Predefined Options List using ChoiceList */}
                          {filterDef?.options && filterDef.options.length > 0 ? (
                            <Box paddingInline="small-200" paddingBlock="small-100">
                              <ChoiceList
                                name={`filter-choice-${f.key}`}
                                multiple={filterDef.allowMultiple !== false}
                                choices={filterDef.options.map((opt) => ({
                                  label: opt.label,
                                  value: opt.value,
                                }))}
                                selected={
                                  Array.isArray(f.value)
                                    ? f.value
                                    : f.value
                                      ? [String(f.value)]
                                      : []
                                }
                                onChange={(newValues) => {
                                  const updatedVal =
                                    filterDef.allowMultiple === false
                                      ? (newValues[0] ?? "")
                                      : newValues;
                                  handleOptionClick(
                                    filterDef ?? { key: f.key, label: fieldLabel },
                                    updatedVal,
                                    currentOp,
                                  );
                                }}
                              />
                            </Box>
                          ) : filterDef?.filter ? (
                            /* Custom ReactNode Filter */
                            <Box padding="small-200">{filterDef.filter}</Box>
                          ) : (
                            /* Free Text Input Filter */
                            <Box padding="small-200">
                              <InlineStack gap="small-200">
                                <input
                                  type="text"
                                  placeholder={`Enter ${fieldLabel.toLowerCase()}...`}
                                  value={customValueInput}
                                  onChange={(e) => setCustomValueInput(e.target.value)}
                                  style={{
                                    flex: 1,
                                    padding: "5px 8px",
                                    fontSize: 12,
                                    border: "1px solid #dcdcdc",
                                    borderRadius: 6,
                                    outline: "none",
                                    fontFamily: "inherit",
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && customValueInput.trim()) {
                                      handleOptionClick(
                                        filterDef ?? {
                                          key: f.key,
                                          label: fieldLabel,
                                        },
                                        customValueInput.trim(),
                                        currentOp,
                                      );
                                      setCustomValueInput("");
                                      setActivePopover(null);
                                    }
                                  }}
                                  autoFocus
                                />
                                <Button
                                  variant="secondary"
                                  onClick={() => {
                                    if (customValueInput.trim()) {
                                      handleOptionClick(
                                        filterDef ?? {
                                          key: f.key,
                                          label: fieldLabel,
                                        },
                                        customValueInput.trim(),
                                        currentOp,
                                      );
                                      setCustomValueInput("");
                                      setActivePopover(null);
                                    }
                                  }}
                                >
                                  Apply
                                </Button>
                              </InlineStack>
                            </Box>
                          )}

                          {/* Second layer: Operator Selection (Is / Is not) */}
                          <Divider />
                          <Box paddingInline="small-200" paddingBlock="small-100">
                            <BlockStack gap="small-500">
                              {(
                                filterDef?.operators || [
                                  { label: "Is", value: "is" },
                                  { label: "Is not", value: "is_not" },
                                ]
                              ).map((op) => {
                                const isChecked =
                                  currentOp === op.value ||
                                  (op.value === "is_not" && currentOp === "is not") ||
                                  (op.value === "is" && currentOp === "is");
                                return (
                                  <Clickable
                                    key={op.value}
                                    background="transparent"
                                    paddingInline="small-200"
                                    blockSize="28px"
                                    borderRadius="base"
                                    inlineSize="fill"
                                    accessibilityLabel={op.label}
                                    onClick={() => {
                                      handleOperatorClick(
                                        filterDef ?? {
                                          key: f.key,
                                          label: fieldLabel,
                                        },
                                        op.value,
                                      );
                                    }}
                                  >
                                    <InlineStack
                                      alignItems="center"
                                      gap="small-200"
                                      blockSize="fill"
                                    >
                                      <Box minInlineSize="16px">
                                        {isChecked ? (
                                          <Icon type="check" tone="neutral" />
                                        ) : null}
                                      </Box>
                                      <Text
                                        variant="small"
                                        tone="neutral"
                                        heading={isChecked}
                                      >
                                        {op.label}
                                      </Text>
                                    </InlineStack>
                                  </Clickable>
                                );
                              })}
                            </BlockStack>
                          </Box>
                        </BlockStack>
                      </Box>
                    </FilterPortalPopover>
                  </InlineStack>
                </Box>
              );
            })}
          </InlineStack>
        ) : null}

        {/* Input container anchoring the main categories popover directly beneath the input */}
        <Box
          ref={inputWrapperRef}
          style={{
            flex: 1,
            minWidth: 80,
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          <input
            ref={inputRef}
            id={categoriesAnchorId}
            type="text"
            disabled={disabled}
            value={queryValue}
            placeholder={hasApplied ? "" : queryPlaceholder}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onQueryChange?.(e.target.value)
            }
            onFocus={() => {
              setIsFocused(true);
              setActivePopover({ type: "categories" });
              onQueryFocus?.();
            }}
            onClick={() => {
              setActivePopover({ type: "categories" });
            }}
            onBlur={() => {
              setIsFocused(false);
              onQueryBlur?.();
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                closeAllPopovers();
              }
            }}
            style={
              {
                flex: 1,
                minWidth: 80,
                width: "100%",
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: 13,
                color: "#202223",
                padding: "6px 8px",
                fontFamily: "inherit",
              } as CSSProperties
            }
          />

          {filters.length > 0 ? (
            <FilterPortalPopover
              anchorRef={inputRef}
              anchorId={categoriesAnchorId}
              isOpen={activePopover?.type === "categories"}
              onClose={() => {
                lastDismissedRef.current = {
                  type: "categories",
                  timestamp: Date.now(),
                };
                setActivePopover((prev) =>
                  prev?.type === "categories" ? null : prev,
                );
              }}
              width="260px"
              maxHeight="360px"
            >
              <Box padding="small-300">
                <BlockStack gap="small-300">
                  <InlineStack
                    alignItems="center"
                    justifyContent="space-between"
                    paddingInline="small-200"
                    paddingBlock="small-300"
                  >
                    <Text variant="small" heading tone="neutral">
                      Filters
                    </Text>
                    <Clickable
                      background="transparent"
                      padding="small-500"
                      borderRadius="base"
                      accessibilityLabel="Close filters popup"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePopover(null);
                      }}
                    >
                      <Icon type="x" tone="neutral" />
                    </Clickable>
                  </InlineStack>
                  <Divider />
                  <BlockStack gap="small-500">
                    {availableFilters.length > 0 ? (
                      availableFilters.map((filter) => (
                        <Clickable
                          key={filter.key}
                          disabled={filter.disabled}
                          background="transparent"
                          paddingInline="small-200"
                          blockSize="32px"
                          borderRadius="base"
                          inlineSize="fill"
                          accessibilityLabel={filter.label}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCategoryClick(filter);
                          }}
                        >
                          <InlineStack alignItems="center" blockSize="fill">
                            <Text variant="small" tone="neutral">
                              {filter.label}
                            </Text>
                          </InlineStack>
                        </Clickable>
                      ))
                    ) : (
                      <Box padding="small-300">
                        <Text variant="small" color="subdued">
                          All filters applied
                        </Text>
                      </Box>
                    )}
                  </BlockStack>
                </BlockStack>
              </Box>
            </FilterPortalPopover>
          ) : null}
        </Box>

        {/* Add new filter button with tooltip (⊕) */}
        <Tooltip content="Add new filter">
          <Clickable
            disabled={disabled}
            background="transparent"
            padding="small-500"
            borderRadius="base"
            accessibilityLabel="Add new filter"
            onClick={(e) => {
              e.stopPropagation();
              const now = Date.now();
              const recentlyDismissed =
                lastDismissedRef.current?.type === "categories" &&
                now - lastDismissedRef.current.timestamp < 200;

              if (activePopover?.type === "categories" || recentlyDismissed) {
                setActivePopover(null);
              } else {
                setActivePopover({ type: "categories" });
                setIsFocused(true);
                inputRef.current?.focus();
              }
            }}
          >
            <Icon type="plus-circle" tone="neutral" />
          </Clickable>
        </Tooltip>

        {/* Clear button ((X)) */}
        {hasQuery || hasApplied ? (
          <Clickable
            disabled={disabled}
            background="transparent"
            padding="small-500"
            borderRadius="base"
            accessibilityLabel="Clear search and filters"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
              closeAllPopovers();
            }}
          >
            <Icon type="x-circle" tone="neutral" />
          </Clickable>
        ) : null}
      </InlineStack>
    </Box>
  );
}
FiltersSearchField.displayName = "FiltersSearchField";

/**
 * Individual filter shortcut button that opens its popover.
 */
export function FiltersShortcut({
  filter,
  isActive = false,
  disabled = false,
}: FiltersShortcutPropsType) {
  const generatedId = useId();
  const popoverId = `corex-filter-shortcut-${filter.key}-${generatedId.replace(/:/g, "")}`;

  return (
    <Popover id={popoverId}>
      <Popover.Trigger>
        <Clickable
          background={isActive ? "strong" : "transparent"}
          disabled={disabled || filter.disabled}
          paddingInline="small-200"
          blockSize="32px"
          borderRadius="base"
          accessibilityLabel={filter.label}
        >
          <InlineStack alignItems="center" gap="small-300">
            <Text variant="small" heading={isActive}>
              {filter.label}
            </Text>
          </InlineStack>
        </Clickable>
      </Popover.Trigger>
      <Popover.Content>
        <Box padding="base" minInlineSize="220px">
          {filter.filter}
        </Box>
      </Popover.Content>
    </Popover>
  );
}
FiltersShortcut.displayName = "FiltersShortcut";

/**
 * Single active filter pill with removal button.
 */
export function FiltersAppliedPill({
  filter,
  disabled = false,
}: FiltersAppliedPillPropsType) {
  return (
    <Box
      background="strong"
      borderRadius="base"
      paddingInlineStart="small-200"
      paddingInlineEnd="small-100"
      blockSize="28px"
    >
      <InlineStack alignItems="center" gap="small-300">
        {typeof filter.label === "string" ? (
          <Clickable
            disabled={disabled || !filter.onClick}
            background="transparent"
            onClick={() => filter.onClick?.(filter.key)}
            accessibilityLabel={filter.label}
          >
            <Text variant="small" tone="neutral">
              {filter.label}
            </Text>
          </Clickable>
        ) : (
          filter.label
        )}
        <Clickable
          disabled={disabled}
          background="transparent"
          padding="small-500"
          borderRadius="base"
          accessibilityLabel={`Remove ${filter.field ?? (typeof filter.label === "string" ? filter.label : filter.key)} filter`}
          onClick={(e) => {
            e.stopPropagation();
            filter.onRemove(filter.key);
          }}
        >
          <Icon type="x" tone="neutral" />
        </Clickable>
      </InlineStack>
    </Box>
  );
}
FiltersAppliedPill.displayName = "FiltersAppliedPill";

/**
 * Strip of applied filter pills with optional "Clear all" button.
 */
export function FiltersApplied({
  appliedFilters,
  onClearAll,
  clearLabel = "Clear all",
  disabled = false,
}: FiltersAppliedPropsType) {
  if (appliedFilters.length === 0) {
    return null;
  }

  return (
    <InlineStack alignItems="center" gap="small-200" wrap>
      {appliedFilters.map((f) => (
        <FiltersAppliedPill key={f.key} filter={f} disabled={disabled} />
      ))}
      {onClearAll ? (
        <Button
          variant="tertiary"
          disabled={disabled}
          onClick={onClearAll}
          accessibilityLabel="Clear all filters"
        >
          {clearLabel}
        </Button>
      ) : null}
    </InlineStack>
  );
}
FiltersApplied.displayName = "FiltersApplied";

/**
 * Columns visibility & sort settings popover matching Polaris index filters.
 */
export function FiltersColumnsPopover({
  sortOptions,
  sortValue,
  onSortChange,
  hideArchived,
  onHideArchivedChange,
  columns,
  onColumnToggle,
  disabled = false,
  id,
}: FiltersColumnsPopoverPropsType) {
  const generatedId = useId();
  const popoverId = id ?? `corex-filters-cols-${generatedId.replace(/:/g, "")}`;

  const hasSort = Boolean(sortOptions && sortOptions.length > 0);
  const hasHideArchived = hideArchived !== undefined;
  const hasColumns = Boolean(columns && columns.length > 0);

  return (
    <Popover id={popoverId}>
      <Popover.Trigger>
        <Clickable
          disabled={disabled}
          background="transparent"
          padding="small-200"
          blockSize="32px"
          borderRadius="base"
          accessibilityLabel="Columns and sort settings"
        >
          <InlineStack alignItems="center" justifyContent="center">
            <Icon type="layout-columns-3" tone="neutral" />
          </InlineStack>
        </Clickable>
      </Popover.Trigger>
      <Popover.Content>
        <Box padding="small-300" minInlineSize="240px">
          <BlockStack gap="small-300">
            {hasSort && sortOptions ? (
              <InlineStack alignItems="center" justifyContent="space-between" gap="base">
                <InlineStack alignItems="center" gap="small-200">
                  <Icon type="sort" tone="neutral" />
                  <Text variant="small" tone="neutral">
                    Sort by
                  </Text>
                </InlineStack>
                <Box minInlineSize="110px">
                  <Select
                    label="Sort by"
                    labelAccessibilityVisibility="exclusive"
                    options={sortOptions}
                    value={sortValue}
                    onChange={(val) => onSortChange?.(val)}
                  />
                </Box>
              </InlineStack>
            ) : null}

            {hasHideArchived ? (
              <InlineStack alignItems="center" justifyContent="space-between" gap="base">
                <InlineStack alignItems="center" gap="small-200">
                  <Icon type="archive" tone="neutral" />
                  <Text variant="small" tone="neutral">
                    Hide archived
                  </Text>
                </InlineStack>
                <Switch
                  checked={hideArchived}
                  accessibilityLabel="Hide archived"
                  onChange={(checked) => onHideArchivedChange?.(checked)}
                />
              </InlineStack>
            ) : null}

            {hasColumns && (hasSort || hasHideArchived) ? <Divider /> : null}

            {hasColumns && columns ? (
              <BlockStack gap="small-300">
                <Text variant="small" tone="neutral">
                  Columns
                </Text>
                <BlockStack gap="small-500">
                  {columns.map((col) => {
                    const isVisible = col.visible !== false;

                    return (
                      <InlineStack
                        key={col.key}
                        alignItems="center"
                        justifyContent="space-between"
                        gap="small-200"
                      >
                        <InlineStack alignItems="center" gap="small-200">
                          <Icon type="drag-handle" tone="neutral" />
                          <Text variant="small" tone="neutral">
                            {col.label}
                          </Text>
                        </InlineStack>

                        <Clickable
                          disabled={col.disabled}
                          background="transparent"
                          padding="small-500"
                          borderRadius="base"
                          accessibilityLabel={`Toggle ${col.label} column visibility`}
                          onClick={() => onColumnToggle?.(col.key, !isVisible)}
                        >
                          <Icon type={isVisible ? "view" : "hide"} tone="neutral" />
                        </Clickable>
                      </InlineStack>
                    );
                  })}
                </BlockStack>
              </BlockStack>
            ) : null}
          </BlockStack>
        </Box>
      </Popover.Content>
    </Popover>
  );
}
FiltersColumnsPopover.displayName = "FiltersColumnsPopover";

/**
 * Right-side actions container.
 */
export function FiltersActions({ children }: FiltersActionsPropsType) {
  return (
    <InlineStack alignItems="center" gap="small-200">
      {children}
    </InlineStack>
  );
}
FiltersActions.displayName = "FiltersActions";

/**
 * Root Filters component implementing classic Polaris filters functionality
 * with a minimal, modern Corex UI layout.
 * Can be used composably (<Filters><Filters.SearchField /><Filters.Actions>...</Filters.Actions></Filters>)
 * or declaratively via props. Transparent and borderless by default.
 */
function FiltersInner(
  {
    queryValue = "",
    queryPlaceholder = "search by keywords",
    onQueryChange,
    onQueryClear,
    onQueryBlur,
    onQueryFocus,
    tabs,
    views,
    leftSlot,
    filters = [],
    appliedFilters = [],
    onClearAll,
    onAddFilter,
    onFilterSelect,
    onOperatorChange,
    sortOptions,
    sortValue,
    onSortChange,
    columns,
    onColumnToggle,
    hideArchived,
    onHideArchivedChange,
    actions,
    disabled = false,
    border = false,
    children,
    id,
  }: FiltersPropsType,
  _ref: React.ForwardedRef<HTMLDivElement>,
): ReactElement {
  const hasColsPopover =
    Boolean(columns && columns.length > 0) ||
    Boolean(sortOptions && sortOptions.length > 0) ||
    hideArchived !== undefined;

  return (
    <Box
      id={id}
      background="transparent"
      border={border ? "base" : undefined}
      borderRadius={border ? "large" : undefined}
      paddingInline={border ? "small-300" : "none"}
      paddingBlock={border ? "small-200" : "none"}
      inlineSize="100%"
    >
      <InlineStack
        alignItems="center"
        justifyContent="space-between"
        gap="small-200"
        wrap={false}
        inlineSize="100%"
      >
        {children ? (
          children
        ) : (
          <>
            <FiltersSearchField
              tabs={tabs}
              views={views}
              leftSlot={leftSlot}
              queryValue={queryValue}
              queryPlaceholder={queryPlaceholder}
              onQueryChange={onQueryChange}
              onQueryClear={onQueryClear}
              onQueryBlur={onQueryBlur}
              onQueryFocus={onQueryFocus}
              filters={filters}
              appliedFilters={appliedFilters}
              onAddFilter={onAddFilter}
              onFilterSelect={onFilterSelect}
              onOperatorChange={onOperatorChange}
              onClearAll={onClearAll}
              disabled={disabled}
            />
            {actions ||
              (hasColsPopover ? (
                <FiltersActions>
                  <FiltersColumnsPopover
                    sortOptions={sortOptions}
                    sortValue={sortValue}
                    onSortChange={onSortChange}
                    columns={columns}
                    onColumnToggle={onColumnToggle}
                    hideArchived={hideArchived}
                    onHideArchivedChange={onHideArchivedChange}
                    disabled={disabled}
                  />
                </FiltersActions>
              ) : null)}
          </>
        )}
      </InlineStack>
    </Box>
  );
}

export const Filters = forwardRef(FiltersInner) as unknown as FiltersComponentType;
Filters.displayName = "Filters";

Filters.SearchField = FiltersSearchField;
Filters.Search = FiltersSearch;
Filters.Shortcut = FiltersShortcut;
Filters.Applied = FiltersApplied;
Filters.AppliedPill = FiltersAppliedPill;
Filters.Columns = FiltersColumnsPopover;
Filters.ColumnsPopover = FiltersColumnsPopover;
Filters.Actions = FiltersActions;
Filters.Popover = FilterPortalPopover;
