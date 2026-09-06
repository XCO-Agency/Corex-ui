import { forwardRef } from "react";
import type { MouseEvent } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import { Button } from "../Button";
import type {
  TableBodyPropsType,
  TableCellPropsType,
  TableExpandButtonPropsType,
  TableHeaderPropsType,
  TableHeaderRowPropsType,
  TableRowPropsType,
  TableSubRowConnectorPropsType,
} from "./Table.types";
import { Text } from "../Text";

export const STable = createWebComponent<
  HTMLElement,
  { onNextPage: "nextpage"; onPreviousPage: "previouspage" }
>("s-table", {
  domProps: ["variant", "loading", "paginate", "hasPreviousPage", "hasNextPage"],
  events: {
    onNextPage: "nextpage",
    onPreviousPage: "previouspage",
  },
});

export const STableHeaderRow = createWebComponent<HTMLElement>("s-table-header-row");

export const STableHeader = createWebComponent<HTMLElement>("s-table-header");

export const STableBody = createWebComponent<HTMLElement>("s-table-body");

export const STableRow = createWebComponent<HTMLElement>("s-table-row", {
  domProps: ["clickDelegate"],
  events: {
    onClick: "click",
  },
});

export const STableCell = createWebComponent<HTMLElement>("s-table-cell");

export const TableHeaderRow = forwardRef<HTMLElement, TableHeaderRowPropsType>(
  function TableHeaderRow({ children, ...rest }, ref) {
    return (
      <STableHeaderRow ref={ref} {...rest}>
        {children}
      </STableHeaderRow>
    );
  },
);

export const TableHeader = forwardRef<HTMLElement, TableHeaderPropsType>(
  function TableHeader({ children, tooltip, ...rest }, ref) {
    return (
      <STableHeader ref={ref} {...rest}>
        <Text tooltip={tooltip} variant="small" underline={false}>
          {children}
        </Text>
      </STableHeader>
    );
  },
);

export const TableBody = forwardRef<HTMLElement, TableBodyPropsType>(function TableBody(
  { children, ...rest },
  ref,
) {
  return (
    <STableBody ref={ref} {...rest}>
      {children}
    </STableBody>
  );
});

export const TableRow = forwardRef<HTMLElement, TableRowPropsType>(function TableRow(
  { children, clickDelegate, onClick, ...rest },
  ref,
) {
  return (
    <STableRow ref={ref} clickDelegate={clickDelegate} onClick={onClick} {...rest}>
      {children}
    </STableRow>
  );
});

export const TableCell = forwardRef<HTMLElement, TableCellPropsType>(function TableCell(
  { children, ...rest },
  ref,
) {
  return (
    <STableCell ref={ref} {...rest}>
      {children}
    </STableCell>
  );
});

export function TableSubRowConnector({
  isLast = false,
  className,
  style,
}: TableSubRowConnectorPropsType) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 32 32"
      className={className}
      style={{
        marginBlock: -10,
        marginInlineStart: 7,
        marginInlineEnd: -9,
        pointerEvents: "none",
        overflow: "visible",
        color: "var(--p-color-border-subdued, #cecfd0)",
        flexShrink: 0,
        ...style,
      }}
      aria-hidden="true"
    >
      {/* Branch into this row */}
      <path d="M6 0 V16 H20" fill="none" stroke="currentColor" strokeWidth="1.5" />

      {/* Continue to next row */}
      {!isLast && (
        <path d="M6 16 V32" fill="none" stroke="currentColor" strokeWidth="1.5" />
      )}

      {/* Connection dot */}
      <circle cx="20" cy="16" r="2.5" fill="currentColor" />
    </svg>
  );
}

export function TableExpandButton({
  expanded,
  onToggle,
  accessibilityLabel = "Toggle row details",
  disabled = false,
}: TableExpandButtonPropsType) {
  return (
    <Button
      variant="tertiary"
      icon={expanded ? "chevron-down" : "chevron-right"}
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onClick={(e) => {
        e?.stopPropagation?.();
        onToggle(e as unknown as MouseEvent<HTMLElement>);
      }}
    />
  );
}
