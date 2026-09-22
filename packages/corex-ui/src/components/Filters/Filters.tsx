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
import { Popover, usePopover } from "../Popover";
import type {
  AppliedFilterType,
  FilterColumnItemType,
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
  onFilterSelect,
  onOperatorChange,
  onClearAll,
  disabled = false,
  id,
}: FiltersSearchFieldPropsType<T>) {
  const [isFocused, setIsFocused] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeFilterKey, setActiveFilterKey] = useState<string | null>(null);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hasApplied = appliedFilters.length > 0;
  const hasQuery = queryValue.trim().length > 0;

  const activeFilter = filters.find((f) => f.key === activeFilterKey);
  const activeApplied = appliedFilters.find((f) => f.key === activeFilterKey);

  const closeDropdown = useCallback(() => {
    setIsDropdownOpen(false);
    setIsFocused(false);
    setActiveFilterKey(null);
    inputRef.current?.blur();
  }, []);

  // Close dropdown on outside clicks and Escape key
  useEffect(() => {
    function handleClickOutside(e: Event) {
      const path = e.composedPath ? e.composedPath() : [];
      const target = e.target as Node | null;
      const isInsideContainer = Boolean(
        containerRef.current &&
        (path.includes(containerRef.current) ||
          (target && containerRef.current.contains(target))),
      );
      const isInsideDropdown = Boolean(
        dropdownRef.current &&
        (path.includes(dropdownRef.current) ||
          (target && dropdownRef.current.contains(target))),
      );

      if (!isInsideContainer && !isInsideDropdown) {
        closeDropdown();
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeDropdown();
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside, true);
      document.addEventListener("touchstart", handleClickOutside, true);
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside, true);
        document.removeEventListener("touchstart", handleClickOutside, true);
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isDropdownOpen, closeDropdown]);

  const handleClear = () => {
    if (hasQuery) {
      onQueryChange?.("");
      onQueryClear?.();
    } else if (hasApplied) {
      onClearAll?.();
    }
  };

  const handleOptionClick = (filter: FilterItemType, optionValue: string) => {
    const currentOp = activeApplied?.operator ?? filter.defaultOperator ?? "is";
    onFilterSelect?.(filter.key, optionValue, currentOp);
  };

  const handleOperatorClick = (filter: FilterItemType, opValue: string) => {
    onOperatorChange?.(filter.key, opValue);
  };

  return (
    <div
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
            isFocused || isDropdownOpen ? "2px solid #005bd3" : "1px solid #dcdcdc",
          borderRadius: 8,
          paddingLeft: 4,
          paddingRight: 8,
          boxShadow: isFocused || isDropdownOpen ? "0 0 0 1px #005bd3" : "none",
          transition: "border-color 150ms ease, box-shadow 150ms ease",
          boxSizing: "border-box",
        } as CSSProperties
      }
      onClick={(e) => {
        if (!disabled && e.target === containerRef.current) {
          inputRef.current?.focus();
        }
      }}
    >
      {/* Left slot (e.g. <Tabs compact ... />, views, or custom slot) */}
      {tabs ?? views ?? leftSlot ?? null}

      {/* Applied filter pills rendered inline */}
      {hasApplied ? (
        <InlineStack alignItems="center" gap="small-300">
          {appliedFilters.map((f) => {
            const filterDef = filters.find((item) => item.key === f.key);
            const fieldLabel = f.field ?? filterDef?.label ?? f.key;
            const operatorLabel = f.operator ?? "is";
            const valDisplay =
              typeof f.label === "string"
                ? f.label
                : f.value
                  ? Array.isArray(f.value)
                    ? f.value.join(", ")
                    : f.value
                  : "";

            return (
              <InlineStack key={f.key} alignItems="center" gap="small-400">
                {/* Prefix: "Tag is not" / "Vendor is" */}
                <Text variant="small" tone="neutral">
                  {fieldLabel} {operatorLabel}
                </Text>

                {/* Light blue pill badge: "exclude_search ✕" */}
                <div
                  style={
                    {
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      backgroundColor: "#e0f0ff",
                      color: "#004bb3",
                      borderRadius: 4,
                      padding: "2px 6px",
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                      lineHeight: "18px",
                    } as CSSProperties
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveFilterKey(f.key);
                    setIsDropdownOpen(true);
                  }}
                >
                  <span>{valDisplay}</span>
                  <Clickable
                    disabled={disabled}
                    background="transparent"
                    padding="none"
                    accessibilityLabel={`Remove ${fieldLabel} filter`}
                    onClick={(e) => {
                      e.stopPropagation();
                      f.onRemove(f.key);
                    }}
                  >
                    <Icon type="x" tone="neutral" />
                  </Clickable>
                </div>
              </InlineStack>
            );
          })}
        </InlineStack>
      ) : null}

      {/* Unstyled native text input for keywords */}
      <input
        ref={inputRef}
        type="text"
        disabled={disabled}
        value={queryValue}
        placeholder={hasApplied ? "" : queryPlaceholder}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onQueryChange?.(e.target.value)}
        onFocus={() => {
          setIsFocused(true);
          setIsDropdownOpen(true);
          onQueryFocus?.();
        }}
        onBlur={(e) => {
          const related = e.relatedTarget as Node | null;
          if (
            (dropdownRef.current && dropdownRef.current.contains(related)) ||
            (containerRef.current && containerRef.current.contains(related))
          ) {
            return;
          }
          setIsFocused(false);
          onQueryBlur?.();
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            closeDropdown();
          } else if (e.key === "Enter" && hoveredOption && activeFilter) {
            e.preventDefault();
            handleOptionClick(activeFilter, hoveredOption);
          }
        }}
        style={
          {
            flex: 1,
            minWidth: 80,
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

      {/* Add new filter button with tooltip (Screenshot 3: ⊕) */}
      <Tooltip content="Add new filter">
        <Clickable
          disabled={disabled}
          background="transparent"
          padding="small-500"
          borderRadius="base"
          accessibilityLabel="Add new filter"
          onClick={(e) => {
            e.stopPropagation();
            if (isDropdownOpen) {
              closeDropdown();
            } else {
              setIsDropdownOpen(true);
              setIsFocused(true);
              inputRef.current?.focus();
            }
          }}
        >
          <Icon type="plus-circle" tone="neutral" />
        </Clickable>
      </Tooltip>

      {/* Clear button (Screenshot 1: (X)) */}
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
            closeDropdown();
          }}
        >
          <Icon type="x-circle" tone="neutral" />
        </Clickable>
      ) : null}

      {/* Floating dropdown menu anchored beneath the input */}
      {isDropdownOpen && filters.length > 0 ? (
        <div
          ref={dropdownRef}
          style={
            {
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              minWidth: 260,
              maxHeight: 360,
              overflowY: "auto",
              backgroundColor: "#ffffff",
              borderRadius: 8,
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.08)",
              zIndex: 1000,
              padding: 6,
              boxSizing: "border-box",
            } as CSSProperties
          }
        >
          {!activeFilterKey ? (
            /* Stage 1: Filter Categories List (Screenshots 1 & 4) */
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
                    closeDropdown();
                  }}
                >
                  <Icon type="x" tone="neutral" />
                </Clickable>
              </InlineStack>
              <Divider />
              <BlockStack gap="small-500">
                {filters.map((filter) => (
                  <Clickable
                    key={filter.key}
                    disabled={filter.disabled}
                    background="transparent"
                    paddingInline="small-200"
                    blockSize="32px"
                    borderRadius="base"
                    inlineSize="fill"
                    accessibilityLabel={filter.label}
                    onClick={() => setActiveFilterKey(filter.key)}
                  >
                    <InlineStack alignItems="center" blockSize="fill">
                      <Text variant="small" tone="neutral">
                        {filter.label}
                      </Text>
                    </InlineStack>
                  </Clickable>
                ))}
              </BlockStack>
            </BlockStack>
          ) : /* Stage 2: Filter Options & Operators Drill-Down (Screenshot 2) */
          activeFilter ? (
            <BlockStack gap="small-300">
              {/* Back Header with Close Button */}
              <InlineStack
                alignItems="center"
                justifyContent="space-between"
                paddingInline="small-200"
                paddingBlock="small-300"
              >
                <Clickable
                  background="transparent"
                  paddingInline="small-200"
                  blockSize="28px"
                  borderRadius="base"
                  onClick={() => setActiveFilterKey(null)}
                  accessibilityLabel="Back to filters list"
                >
                  <InlineStack alignItems="center" gap="small-300" blockSize="fill">
                    <Icon type="arrow-left" tone="neutral" />
                    <Text variant="small" heading tone="neutral">
                      {activeFilter.label}
                    </Text>
                  </InlineStack>
                </Clickable>

                <Clickable
                  background="transparent"
                  padding="small-500"
                  borderRadius="base"
                  accessibilityLabel="Close filters popup"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeDropdown();
                  }}
                >
                  <Icon type="x" tone="neutral" />
                </Clickable>
              </InlineStack>
              <Divider />

              {/* If custom ReactNode filter is provided and no structured options */}
              {activeFilter.filter &&
              (!activeFilter.options || activeFilter.options.length === 0) ? (
                <Box padding="small-200">{activeFilter.filter}</Box>
              ) : null}

              {/* Predefined options with checkmarks */}
              {activeFilter.options?.map((opt) => {
                const isChecked = Array.isArray(activeApplied?.value)
                  ? activeApplied.value.includes(opt.value)
                  : activeApplied?.value === opt.value;
                const isHovered = hoveredOption === opt.value;

                return (
                  <div
                    key={opt.value}
                    onMouseEnter={() => setHoveredOption(opt.value)}
                    onMouseLeave={() => setHoveredOption(null)}
                  >
                    <Clickable
                      background="transparent"
                      paddingInline="small-200"
                      blockSize="32px"
                      borderRadius="base"
                      inlineSize="fill"
                      accessibilityLabel={opt.label}
                      onClick={() => handleOptionClick(activeFilter, opt.value)}
                    >
                      <InlineStack
                        alignItems="center"
                        justifyContent="space-between"
                        gap="small-200"
                        grow
                        blockSize="fill"
                      >
                        <InlineStack alignItems="center" gap="small-200">
                          <Box minInlineSize="16px">
                            {isChecked ? <Icon type="check" tone="neutral" /> : null}
                          </Box>
                          <Text variant="small" tone="neutral" heading={isChecked}>
                            {opt.label}
                          </Text>
                        </InlineStack>

                        {isHovered ? (
                          <Badge color="strong" tone="neutral">
                            ↵ Enter
                          </Badge>
                        ) : null}
                      </InlineStack>
                    </Clickable>
                  </div>
                );
              })}

              {/* Operators section (e.g. Divider -> Is / Is not) */}
              {activeFilter.operators && activeFilter.operators.length > 0 ? (
                <>
                  <Divider />
                  {activeFilter.operators.map((op) => {
                    const currentOp =
                      activeApplied?.operator ?? activeFilter.defaultOperator ?? "is";
                    const isOpChecked =
                      currentOp === op.value || currentOp === op.label.toLowerCase();

                    return (
                      <Clickable
                        key={op.value}
                        background="transparent"
                        paddingInline="small-200"
                        blockSize="28px"
                        borderRadius="base"
                        inlineSize="fill"
                        accessibilityLabel={op.label}
                        onClick={() => handleOperatorClick(activeFilter, op.value)}
                      >
                        <InlineStack alignItems="center" gap="small-200" blockSize="fill">
                          <Box minInlineSize="16px">
                            {isOpChecked ? <Icon type="check" tone="neutral" /> : null}
                          </Box>
                          <Text variant="small" tone="neutral" heading={isOpChecked}>
                            {op.label}
                          </Text>
                        </InlineStack>
                      </Clickable>
                    );
                  })}
                </>
              ) : null}

              {/* Done Button */}
              <Divider />
              <InlineStack
                alignItems="center"
                justifyContent="flex-end"
                paddingInline="small-200"
                paddingBlock="small-200"
              >
                <Button
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeDropdown();
                  }}
                >
                  Done
                </Button>
              </InlineStack>
            </BlockStack>
          ) : null}
        </div>
      ) : null}
    </div>
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
            <Text variant="small" tone="neutral" heading={isActive}>
              {filter.label}
            </Text>
            <Icon type="select" tone="neutral" />
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
          accessibilityLabel={`Remove ${typeof filter.label === "string" ? filter.label : filter.key} filter`}
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
