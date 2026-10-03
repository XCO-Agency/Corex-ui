import {
  Children,
  Fragment,
  isValidElement,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { Box } from "../Box";
import { BlockStack } from "../BlockStack";
import { InlineStack } from "../InlineStack";
import { Text } from "../Text";
import { Clickable } from "../Clickable";
import { Icon } from "../Icon";
import { Divider } from "../Divider";
import { Switch } from "../Switch";
import { Select } from "../Select";
import { Popover } from "../Popover";
import { Button } from "../Button";
import { reorderSlots, startListDrag } from "./indexFiltersListDrag";
import type {
  IndexFilterColumnItemType,
  IndexFiltersViewOptionsColumnsPropsType,
  IndexFiltersViewOptionsPropsType,
  IndexFiltersViewOptionsSortPropsType,
  IndexFiltersViewOptionsTogglesPropsType,
} from "./IndexFilters.types";

/** Marks a column item in the list; its value is the column key. */
const COLUMN_ATTR = "data-corex-index-filters-column";

/**
 * View options popover (sort, toggles, column visibility & order).
 * Compose it with `ViewOptionsSort`, `ViewOptionsToggles` and `ViewOptionsColumns`.
 */
export function IndexFiltersViewOptions({
  children,
  activator,
  icon = "layout-columns-3",
  accessibilityLabel = "View options",
  disabled = false,
  minInlineSize = "260px",
  maxInlineSize,
  id,
}: IndexFiltersViewOptionsPropsType) {
  const generatedId = useId();
  const popoverId = id ?? `corex-index-filters-view-${generatedId.replace(/:/g, "")}`;
  const sections = Children.toArray(children).filter(isValidElement);

  return (
    <Popover id={popoverId}>
      <Popover.Trigger>
        {activator ?? (
          <Button
            disabled={disabled}
            icon={icon}
            variant="tertiary"
            accessibilityLabel={accessibilityLabel}
          />
        )}
      </Popover.Trigger>
      <Popover.Content>
        <Box
          padding="small-300"
          minInlineSize={minInlineSize}
          maxInlineSize={maxInlineSize}
        >
          <BlockStack gap="small-300">
            {sections.map((section, index) => (
              <Fragment key={section.key ?? index}>
                {index > 0 ? <Divider /> : null}
                {section}
              </Fragment>
            ))}
          </BlockStack>
        </Box>
      </Popover.Content>
    </Popover>
  );
}
IndexFiltersViewOptions.displayName = "IndexFiltersViewOptions";

/**
 * Sort row: label with icon, and a select of sort options.
 */
export function IndexFiltersViewOptionsSort({
  label = "Sort by",
  icon = "sort",
  options,
  value,
  onChange,
  disabled,
}: IndexFiltersViewOptionsSortPropsType) {
  return (
    <InlineStack alignItems="center" justifyContent="space-between" gap="base">
      <InlineStack alignItems="center" gap="small-200">
        {icon ? <Icon type={icon} tone="neutral" /> : null}
        <Text variant="small" tone="neutral">
          {label}
        </Text>
      </InlineStack>
      <Box minInlineSize="110px">
        <Select
          label={label}
          labelAccessibilityVisibility="exclusive"
          options={options}
          value={value}
          disabled={disabled}
          onChange={(next) => onChange?.(next)}
        />
      </Box>
    </InlineStack>
  );
}
IndexFiltersViewOptionsSort.displayName = "IndexFiltersViewOptionsSort";

/**
 * Switch rows (e.g. "Hide archived").
 */
export function IndexFiltersViewOptionsToggles({
  items,
  onChange,
}: IndexFiltersViewOptionsTogglesPropsType) {
  if (items.length === 0) return null;

  return (
    <BlockStack gap="small-300">
      {items.map((item) => (
        <InlineStack
          key={item.key}
          alignItems="center"
          justifyContent="space-between"
          gap="base"
        >
          <InlineStack alignItems="center" gap="small-200">
            {item.icon ? <Icon type={item.icon} tone="neutral" /> : null}
            <Text variant="small" tone="neutral">
              {item.label}
            </Text>
          </InlineStack>
          <Switch
            checked={item.checked}
            disabled={item.disabled}
            accessibilityLabel={item.label}
            onChange={(checked) => {
              item.onChange?.(checked);
              onChange?.(item.key, checked);
            }}
          />
        </InlineStack>
      ))}
    </BlockStack>
  );
}
IndexFiltersViewOptionsToggles.displayName = "IndexFiltersViewOptionsToggles";

/**
 * Column list: show/hide each column and reorder by dragging its handle
 * (or with the arrow keys while the handle is focused).
 * `onChange` receives the full list, so the same array can drive the table header.
 */
export function IndexFiltersViewOptionsColumns<C extends IndexFilterColumnItemType>({
  columns,
  onChange,
  title = "Columns",
  direction = "vertical",
}: IndexFiltersViewOptionsColumnsPropsType<C>) {
  const isVertical = direction === "vertical";
  const listRef = useRef<HTMLDivElement>(null);
  const cancelDragRef = useRef<(() => void) | null>(null);
  /** Column whose handle gets focus back after a keyboard move re-renders the list. */
  const pendingFocusKeyRef = useRef<string | null>(null);

  const movable = columns.map((column) => column.reorderable !== false);

  const moveSlot = (fromSlot: number, toSlot: number) => {
    const slotCount = movable.filter(Boolean).length;
    if (fromSlot === toSlot || toSlot < 0 || toSlot >= slotCount) return;
    onChange?.(reorderSlots(movable, fromSlot, toSlot).map((index) => columns[index]!));
  };

  const slotOf = (index: number) => movable.slice(0, index).filter(Boolean).length;

  const toggleVisibility = (key: string) => {
    onChange?.(
      columns.map((column) =>
        column.key === key ? { ...column, visible: column.visible === false } : column,
      ),
    );
  };

  const beginDrag = (index: number, event: PointerEvent<HTMLElement>) => {
    const list = listRef.current;
    // Primary button / touch / pen only.
    if (!list || !onChange || event.button > 0) return;
    event.preventDefault();
    cancelDragRef.current?.();
    cancelDragRef.current = startListDrag({
      container: list,
      items: Array.from(list.querySelectorAll<HTMLElement>(`[${COLUMN_ATTR}]`)),
      movable,
      fromIndex: index,
      axis: isVertical ? "y" : "x",
      startPosition: isVertical ? event.clientY : event.clientX,
      source: event.currentTarget,
      pointerId: event.pointerId,
      onDrop: (fromSlot, toSlot) => {
        cancelDragRef.current = null;
        moveSlot(fromSlot, toSlot);
      },
    });
  };

  // Leave no floating item behind if the list unmounts mid-drag.
  useEffect(() => () => cancelDragRef.current?.(), []);

  const handleHandleKeyDown = (index: number, event: KeyboardEvent<HTMLElement>) => {
    const back = isVertical ? "ArrowUp" : "ArrowLeft";
    const forward = isVertical ? "ArrowDown" : "ArrowRight";
    if (event.key !== back && event.key !== forward) return;
    event.preventDefault();
    const slot = slotOf(index);
    pendingFocusKeyRef.current = columns[index]!.key;
    moveSlot(slot, event.key === back ? slot - 1 : slot + 1);
  };

  // Moving a focused node in the DOM drops its focus; hand it back to the handle.
  useLayoutEffect(() => {
    const key = pendingFocusKeyRef.current;
    if (!key) return;
    pendingFocusKeyRef.current = null;
    const item = Array.from(
      listRef.current?.querySelectorAll<HTMLElement>(`[${COLUMN_ATTR}]`) ?? [],
    ).find((element) => element.getAttribute(COLUMN_ATTR) === key);
    item?.querySelector<HTMLElement>("s-clickable")?.focus();
  }, [columns]);

  if (columns.length === 0) return null;

  const renderItem = (column: C, index: number) => {
    const isVisible = column.visible !== false;
    const canMove = column.reorderable !== false && Boolean(onChange);

    const content = (
      <InlineStack
        alignItems="center"
        justifyContent="space-between"
        gap="small-200"
        wrap={false}
        inlineSize={isVertical ? "100%" : undefined}
      >
        <InlineStack alignItems="center" gap="small-200" wrap={false}>
          {canMove ? (
            <InlineStack
              alignItems="center"
              shrink={false}
              style={{ cursor: "grab", touchAction: "none" }}
              onPointerDown={(event) => beginDrag(index, event)}
              onKeyDown={(event) => handleHandleKeyDown(index, event)}
            >
              <Clickable
                background="transparent"
                padding="none"
                borderRadius="base"
                accessibilityLabel={`Reorder ${column.label} column. Use the arrow keys to move it.`}
              >
                <Icon type="drag-handle" tone="neutral" />
              </Clickable>
            </InlineStack>
          ) : (
            <Box minInlineSize="20px" />
          )}
          <Text variant="small" color={isVisible ? undefined : "subdued"}>
            {column.label}
          </Text>
        </InlineStack>

        <Clickable
          disabled={column.hideable === false || !onChange}
          background="transparent"
          padding="small-500"
          borderRadius="base"
          accessibilityLabel={`${isVisible ? "Hide" : "Show"} ${column.label} column`}
          onClick={() => toggleVisibility(column.key)}
        >
          <Icon type={isVisible ? "view" : "hide"} tone="neutral" />
        </Clickable>
      </InlineStack>
    );

    return (
      <InlineStack
        key={column.key}
        {...{ [COLUMN_ATTR]: column.key }}
        alignItems="center"
        shrink={false}
        inlineSize={isVertical ? "100%" : undefined}
      >
        {isVertical ? (
          content
        ) : (
          <Box
            borderWidth="base"
            borderColor="base"
            borderRadius="base"
            paddingInline="small-200"
            paddingBlock="small-400"
          >
            {content}
          </Box>
        )}
      </InlineStack>
    );
  };

  return (
    <BlockStack gap="small-300">
      {title !== null ? (
        <Text variant="small" tone="neutral">
          {title}
        </Text>
      ) : null}
      {isVertical ? (
        <BlockStack ref={listRef} gap="small-500">
          {columns.map(renderItem)}
        </BlockStack>
      ) : (
        <InlineStack
          ref={listRef}
          gap="small-200"
          wrap={false}
          overflowX="auto"
          paddingBlock="small-500"
        >
          {columns.map(renderItem)}
        </InlineStack>
      )}
    </BlockStack>
  );
}
IndexFiltersViewOptionsColumns.displayName = "IndexFiltersViewOptionsColumns";
