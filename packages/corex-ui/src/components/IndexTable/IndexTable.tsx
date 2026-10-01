import { createContext, forwardRef, useContext, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { Button } from "../Button";
import { Checkbox } from "../Checkbox";
import { InlineStack } from "../InlineStack";
import { Table } from "../Table";
import { Text } from "../Text";
import type {
  IndexTableCellPropsType,
  IndexTablePropsType,
  IndexTableRowPropsType,
} from "./IndexTable.types";

/**
 * v12's resource table, on `s-table`.
 *
 * What carries over: headings, rows, cells, row click, selection with a header
 * checkbox that selects or clears the page, the bulk-action bar that appears once
 * something is selected, and paging.
 *
 * What does not: v12's shift-click range selection and its sticky header, and
 * promoted bulk actions share one row with the rest rather than leading them.
 * `selectedItemsCount="All"` is understood.
 */
const IndexTableContext = createContext<{
  selectable: boolean;
  onSelectionChange?: IndexTablePropsType["onSelectionChange"];
  resourceName?: IndexTablePropsType["resourceName"];
}>({ selectable: false });

/**
 * Swallows the click a row-selection checkbox produces.
 *
 * The row's own click is a native listener on `s-table-row`, so a React
 * `onClick` here would run too late — React's handler fires from the document
 * root, after the element's own listener has already opened the row. A native
 * listener on an ancestor of the checkbox stops the event first.
 */
function StopRowClick({ children }: { children?: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const stop = (event: Event) => event.stopPropagation();
    node.addEventListener("click", stop);
    return () => node.removeEventListener("click", stop);
  }, []);

  return (
    <span ref={ref} style={{ display: "contents" }}>
      {children}
    </span>
  );
}

const IndexTableRoot = forwardRef<HTMLElement, IndexTablePropsType>(function IndexTable(
  {
    children,
    headings = [],
    itemCount = 0,
    selectedItemsCount = 0,
    onSelectionChange,
    selectable = true,
    bulkActions = [],
    promotedBulkActions = [],
    resourceName,
    loading,
    emptyState,
    hasZebraStriping,
    pagination,
    ...rest
  },
  ref,
) {
  const selectedCount =
    selectedItemsCount === "All" ? itemCount : (selectedItemsCount ?? 0);
  const allSelected = itemCount > 0 && selectedCount >= itemCount;
  const actions = [...promotedBulkActions, ...bulkActions];
  const plural = resourceName?.plural ?? "items";

  if (itemCount === 0 && emptyState) return <>{emptyState}</>;

  return (
    <IndexTableContext.Provider value={{ selectable, onSelectionChange, resourceName }}>
      {selectable && selectedCount > 0 && actions.length > 0 ? (
        <InlineStack gap="small-200" blockAlign="center" wrap>
          <Text fontWeight="medium">
            {selectedItemsCount === "All"
              ? `All ${itemCount} ${plural} selected`
              : `${selectedCount} selected`}
          </Text>
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="tertiary"
              tone={action.destructive ? "critical" : undefined}
              disabled={action.disabled}
              onClick={action.onAction}
            >
              {action.content}
            </Button>
          ))}
        </InlineStack>
      ) : null}

      <Table
        ref={ref}
        loading={loading}
        paginate={Boolean(pagination)}
        hasPreviousPage={pagination?.hasPrevious}
        hasNextPage={pagination?.hasNext}
        onPreviousPage={pagination?.onPrevious}
        onNextPage={pagination?.onNext}
        {...rest}
      >
        <Table.HeaderRow>
          {selectable ? (
            <Table.HeaderCell>
              <Checkbox
                label={`Select all ${plural}`}
                labelAccessibilityVisibility="exclusive"
                checked={allSelected}
                onChange={(checked) => onSelectionChange?.("page", checked)}
              />
            </Table.HeaderCell>
          ) : null}
          {headings.map((heading, index) => (
            <Table.HeaderCell key={index} format={heading.format}>
              {heading.hidden ? null : heading.title}
            </Table.HeaderCell>
          ))}
        </Table.HeaderRow>
        <Table.Body>{children}</Table.Body>
      </Table>
    </IndexTableContext.Provider>
  );
});

export const IndexTableRow = forwardRef<HTMLElement, IndexTableRowPropsType>(
  function IndexTableRow(
    { children, id, selected, position, onClick, disabled, ...rest },
    ref,
  ) {
    const { selectable, onSelectionChange, resourceName } = useContext(IndexTableContext);

    return (
      <Table.Row ref={ref} onClick={onClick ? () => onClick() : undefined} {...rest}>
        {selectable ? (
          <Table.Cell>
            {/* The row's own click opens it; the checkbox must not. */}
            <StopRowClick>
              <Checkbox
                label={`Select ${resourceName?.singular ?? id ?? "row"}`}
                labelAccessibilityVisibility="exclusive"
                checked={Boolean(selected)}
                disabled={disabled}
                onChange={(checked) => onSelectionChange?.("single", checked, id)}
              />
            </StopRowClick>
          </Table.Cell>
        ) : null}
        {children}
      </Table.Row>
    );
  },
);

export const IndexTableCell = forwardRef<HTMLElement, IndexTableCellPropsType>(
  function IndexTableCell({ children, flush, ...rest }, ref) {
    return (
      <Table.Cell ref={ref} {...rest}>
        {children}
      </Table.Cell>
    );
  },
);

export const IndexTable = Object.assign(IndexTableRoot, {
  Row: IndexTableRow,
  Cell: IndexTableCell,
});
