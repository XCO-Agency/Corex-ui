import {
  createContext,
  forwardRef,
  useContext,
  useMemo,
  useState,
  type ForwardedRef,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { ActionList } from "../ActionList";
import { Box } from "../Box";
import { Button } from "../Button";
import { Checkbox } from "../Checkbox";
import { Grid } from "../Grid";
import { Icon } from "../Icon";
import { InlineStack } from "../InlineStack";
import { Popover } from "../Popover";
import { Switch } from "../Switch";
import { Text } from "../Text";
import type {
  IndexTableCellPropsType,
  IndexTableHeadingType,
  IndexTablePropsType,
  IndexTableRowPropsType,
} from "./IndexTable.types";

type IndexTableContextType = {
  selectable: boolean;
  onSelectionChange?: IndexTablePropsType["onSelectionChange"];
  resourceName?: IndexTablePropsType["resourceName"];
  gridTemplateColumns: string;
  showSelectedOnly: boolean;
};

const IndexTableContext = createContext<IndexTableContextType>({
  selectable: false,
  gridTemplateColumns: "1fr",
  showSelectedOnly: false,
});

function IndexTableInner(
  {
    children,
    headings = [],
    rows,
    columnContentTypes,
    itemCount,
    selectedItemsCount = 0,
    onSelectionChange,
    selectable = true,
    bulkActions = [],
    promotedBulkActions = [],
    resourceName,
    loading: _loading,
    emptyState,
    pagination,
    gridTemplateColumns,
    footerContent,
    showAllSelectedToggle = true,
    id,
    className,
    style,
    hasZebraStriping: _hasZebraStriping,
    increasedTableDensity: _increasedTableDensity,
    truncate: _truncate,
    verticalAlign: _verticalAlign,
    ...rest
  }: IndexTablePropsType,
  ref: ForwardedRef<HTMLElement>,
): ReactElement {
  const [selectionMenuOpen, setSelectionMenuOpen] = useState(false);
  const [moreActionsOpen, setMoreActionsOpen] = useState(false);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  const effectiveItemCount = itemCount ?? rows?.length ?? 0;
  const selectedCount =
    selectedItemsCount === "All" ? effectiveItemCount : (selectedItemsCount ?? 0);
  const allSelected = effectiveItemCount > 0 && selectedCount >= effectiveItemCount;
  const isIndeterminate = selectedCount > 0 && !allSelected;
  const plural = resourceName?.plural ?? "items";

  // Normalize headings from string[] or IndexTableHeadingType[]
  const normalizedHeadings: IndexTableHeadingType[] = useMemo(() => {
    if (!headings || headings.length === 0) return [];
    return headings.map((h, idx) => {
      if (typeof h === "object" && h !== null && "title" in h) {
        return h as IndexTableHeadingType;
      }
      return {
        title: h as ReactNode,
        format: columnContentTypes?.[idx] === "numeric" ? "numeric" : "base",
      };
    });
  }, [headings, columnContentTypes]);

  // Compute CSS Grid Template Columns
  const resolvedGridColumns = useMemo(() => {
    if (gridTemplateColumns) return gridTemplateColumns;

    const cols: string[] = [];
    if (selectable) {
      cols.push("44px");
    }

    if (normalizedHeadings.length > 0) {
      normalizedHeadings.forEach((h, idx) => {
        if (h.width) {
          cols.push(h.width);
        } else if (idx === 0) {
          cols.push("minmax(180px, 2fr)");
        } else if (h.format === "numeric" || h.format === "currency") {
          cols.push("minmax(80px, 1fr)");
        } else {
          cols.push("minmax(110px, 1fr)");
        }
      });
    } else if (rows && rows.length > 0) {
      const rowLen = rows[0]?.length ?? 0;
      for (let i = 0; i < rowLen; i++) {
        if (i === 0) cols.push("minmax(180px, 2fr)");
        else if (columnContentTypes?.[i] === "numeric") cols.push("minmax(80px, 1fr)");
        else cols.push("minmax(110px, 1fr)");
      }
    }

    return cols.length > 0 ? cols.join(" ") : "1fr";
  }, [gridTemplateColumns, selectable, normalizedHeadings, rows, columnContentTypes]);

  if (effectiveItemCount === 0 && emptyState) {
    return (
      <Box
        ref={ref}
        role="table"
        id={id}
        inlineSize="100%"
        background="bg-surface"
        borderWidth="0165"
        borderColor="border-subdued"
        borderRadius="base"
        padding="large-100"
        className={className}
        style={style}
        {...rest}
      >
        {emptyState}
      </Box>
    );
  }

  const isBulkActive = selectable && selectedCount > 0;

  return (
    <IndexTableContext.Provider
      value={{
        selectable,
        onSelectionChange,
        resourceName,
        gridTemplateColumns: resolvedGridColumns,
        showSelectedOnly,
      }}
    >
      <Box
        ref={ref}
        role="table"
        id={id}
        inlineSize="100%"
        overflowX="auto"
        background="bg-surface"
        borderWidth="0165"
        borderColor="border-subdued"
        borderRadius="base"
        className={className}
        style={style}
        {...rest}
      >
        {/* Table Header: Either Bulk Actions Bar or Normal Column Headings */}
        {isBulkActive ? (
          <Box
            role="toolbar"
            paddingInline="small-300"
            paddingBlock="small-200"
            borderBlockEndWidth="0165"
            borderColor="border-subdued"
            background="bg-surface-secondary"
          >
            <InlineStack align="space-between" blockAlign="center">
              {/* Left: Dropdown select indicator, promoted buttons, and more actions popover */}
              <InlineStack gap="small-200" blockAlign="center" wrap>
                <Popover
                  active={selectionMenuOpen}
                  onClose={() => setSelectionMenuOpen(false)}
                >
                  <Popover.Trigger>
                    <Button
                      variant="secondary"
                      onClick={() => setSelectionMenuOpen((open) => !open)}
                    >
                      <InlineStack gap="small-200" blockAlign="center">
                        <Checkbox
                          checked={allSelected}
                          indeterminate={isIndeterminate}
                          label="Toggle selection"
                          labelAccessibilityVisibility="exclusive"
                          onChange={(checked) => onSelectionChange?.("page", checked)}
                        />
                        <Text fontWeight="semibold">
                          {selectedItemsCount === "All"
                            ? `All ${effectiveItemCount} ${plural} selected`
                            : `${selectedCount} selected`}
                        </Text>
                        <Icon source="chevron-down" />
                      </InlineStack>
                    </Button>
                  </Popover.Trigger>
                  <Popover.Content>
                    <ActionList
                      items={[
                        {
                          content: `Select all ${effectiveItemCount} ${plural}`,
                          onAction: () => {
                            setSelectionMenuOpen(false);
                            onSelectionChange?.("all", true);
                          },
                        },
                        {
                          content: "Select page",
                          onAction: () => {
                            setSelectionMenuOpen(false);
                            onSelectionChange?.("page", true);
                          },
                        },
                        {
                          content: "Deselect all",
                          destructive: true,
                          onAction: () => {
                            setSelectionMenuOpen(false);
                            onSelectionChange?.("page", false);
                          },
                        },
                      ]}
                    />
                  </Popover.Content>
                </Popover>

                {promotedBulkActions.map((action, idx) => (
                  <Button
                    key={action.id ?? idx}
                    variant="secondary"
                    tone={action.destructive ? "critical" : undefined}
                    disabled={action.disabled}
                    onClick={action.onAction}
                  >
                    {action.content}
                  </Button>
                ))}

                {bulkActions.length > 0 && (
                  <Popover
                    active={moreActionsOpen}
                    onClose={() => setMoreActionsOpen(false)}
                  >
                    <Popover.Trigger>
                      <Button
                        variant="secondary"
                        icon="menu-horizontal"
                        accessibilityLabel="More actions"
                        onClick={() => setMoreActionsOpen((open) => !open)}
                      />
                    </Popover.Trigger>
                    <Popover.Content>
                      <ActionList
                        items={bulkActions.map((action) => ({
                          content: action.content,
                          destructive: action.destructive,
                          disabled: action.disabled,
                          onAction: () => {
                            setMoreActionsOpen(false);
                            action.onAction?.();
                          },
                        }))}
                      />
                    </Popover.Content>
                  </Popover>
                )}
              </InlineStack>

              {/* Right: Show all selected switch */}
              {showAllSelectedToggle && (
                <InlineStack gap="small-200" blockAlign="center">
                  <Switch
                    checked={showSelectedOnly}
                    onChange={setShowSelectedOnly}
                    label="Show all selected"
                  />
                </InlineStack>
              )}
            </InlineStack>
          </Box>
        ) : (
          <Box
            role="row"
            paddingInline="small-300"
            paddingBlock="small-300"
            borderBlockEndWidth="0165"
            borderColor="border-subdued"
            background="bg-surface-secondary"
          >
            <Grid columns={resolvedGridColumns} alignItems="center" gap="small-300">
              {selectable && (
                <Grid.Item>
                  <Checkbox
                    label={`Select all ${plural}`}
                    labelAccessibilityVisibility="exclusive"
                    checked={allSelected}
                    indeterminate={isIndeterminate}
                    onChange={(checked) => onSelectionChange?.("page", checked)}
                  />
                </Grid.Item>
              )}
              {normalizedHeadings.map((heading, idx) => (
                <Grid.Item key={heading.id ?? idx}>
                  <InlineStack
                    align={
                      heading.alignment === "end" ||
                      heading.format === "numeric" ||
                      heading.format === "currency"
                        ? "end"
                        : heading.alignment === "center"
                          ? "center"
                          : "start"
                    }
                    blockAlign="center"
                  >
                    {heading.hidden ? null : (
                      <Text
                        as="span"
                        variant="small"
                        color="subdued"
                        fontWeight="medium"
                      >
                        {heading.title}
                      </Text>
                    )}
                  </InlineStack>
                </Grid.Item>
              ))}
            </Grid>
          </Box>
        )}

        {/* Body Rows */}
        <Box role="rowgroup">
          {rows && rows.length > 0
            ? rows.map((row, rowIndex) => (
                <IndexTableRow key={rowIndex} id={String(rowIndex)}>
                  {row.map((cell, cellIndex) => (
                    <IndexTableCell
                      key={cellIndex}
                      format={
                        columnContentTypes?.[cellIndex] === "numeric"
                          ? "numeric"
                          : undefined
                      }
                    >
                      {typeof cell === "string" || typeof cell === "number" ? (
                        <Text as="span">{cell}</Text>
                      ) : (
                        cell
                      )}
                    </IndexTableCell>
                  ))}
                </IndexTableRow>
              ))
            : children}
        </Box>

        {/* Pagination */}
        {pagination && (
          <Box
            paddingBlock="small-300"
            paddingInline="small-300"
            borderBlockStartWidth="0165"
            borderColor="border-subdued"
          >
            <InlineStack align="space-between" blockAlign="center">
              <Box>
                {pagination.label && (
                  <Text color="subdued" variant="small">
                    {pagination.label}
                  </Text>
                )}
              </Box>
              <InlineStack gap="small-200">
                <Button
                  variant="tertiary"
                  icon="chevron-left"
                  disabled={!pagination.hasPrevious}
                  onClick={pagination.onPrevious}
                  accessibilityLabel="Previous page"
                />
                <Button
                  variant="tertiary"
                  icon="chevron-right"
                  disabled={!pagination.hasNext}
                  onClick={pagination.onNext}
                  accessibilityLabel="Next page"
                />
              </InlineStack>
            </InlineStack>
          </Box>
        )}

        {/* Custom Footer Content */}
        {footerContent && (
          <Box
            paddingBlock="small-300"
            paddingInline="small-300"
            borderBlockStartWidth="0165"
            borderColor="border-subdued"
          >
            {footerContent}
          </Box>
        )}
      </Box>
    </IndexTableContext.Provider>
  );
}

export const IndexTableRow = forwardRef<HTMLElement, IndexTableRowPropsType>(
  function IndexTableRow(
    { children, id, selected, position: _position, onClick, disabled, className, style, ...rest },
    ref,
  ) {
    const {
      selectable,
      onSelectionChange,
      resourceName,
      gridTemplateColumns,
      showSelectedOnly,
    } = useContext(IndexTableContext);

    const [isHovered, setIsHovered] = useState(false);

    if (showSelectedOnly && !selected) {
      return null;
    }

    const handleRowClick = () => {
      onClick?.();
    };

    return (
      <Box
        ref={ref}
        role="row"
        id={id}
        paddingInline="small-300"
        paddingBlock="small-200"
        background={
          selected
            ? "bg-surface-selected"
            : isHovered
              ? "bg-surface-secondary"
              : undefined
        }
        borderRadius="base"
        borderBlockEndWidth="0165"
        borderColor="border-subdued"
        onClick={onClick ? handleRowClick : undefined}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={className}
        style={{
          cursor: onClick ? "pointer" : "default",
          transition: "background 150ms ease, border-radius 150ms ease",
          ...style,
        }}
        {...rest}
      >
        <Grid columns={gridTemplateColumns} alignItems="center" gap="small-300">
          {selectable && (
            <Grid.Item>
              <Box
                onClick={(e: MouseEvent<HTMLElement>) => {
                  e.stopPropagation();
                }}
              >
                <Checkbox
                  label={`Select ${resourceName?.singular ?? id ?? "row"}`}
                  labelAccessibilityVisibility="exclusive"
                  checked={Boolean(selected)}
                  disabled={disabled}
                  onChange={(checked) => onSelectionChange?.("single", checked, id)}
                />
              </Box>
            </Grid.Item>
          )}
          {children}
        </Grid>
      </Box>
    );
  },
);

export const IndexTableCell = forwardRef<HTMLElement, IndexTableCellPropsType>(
  function IndexTableCell(
    { children, flush: _flush, format, alignment, className, style, ...rest },
    ref,
  ) {
    const isEnd = alignment === "end" || format === "numeric" || format === "currency";

    return (
      <Grid.Item ref={ref} className={className} style={style} {...rest}>
        <InlineStack
          align={isEnd ? "end" : alignment === "center" ? "center" : "start"}
          blockAlign="center"
        >
          {children}
        </InlineStack>
      </Grid.Item>
    );
  },
);

type IndexTableComponentType = ((
  props: IndexTablePropsType & { ref?: ForwardedRef<HTMLElement> },
) => ReactElement) & {
  Row: typeof IndexTableRow;
  Cell: typeof IndexTableCell;
};

export const IndexTable = Object.assign(forwardRef(IndexTableInner), {
  Row: IndexTableRow,
  Cell: IndexTableCell,
}) as unknown as IndexTableComponentType;
