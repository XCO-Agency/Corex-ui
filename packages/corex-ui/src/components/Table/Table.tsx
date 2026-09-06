import { forwardRef, type ForwardedRef, type ReactElement } from "react";
import type { TablePropsType } from "./Table.types";
import {
  STable,
  TableBody,
  TableCell,
  TableExpandButton,
  TableHeader,
  TableHeaderRow,
  TableRow,
  TableSubRowConnector,
} from "./TableParts";

function TableInner(
  {
    variant = "auto",
    loading = false,
    paginate = false,
    hasPreviousPage = false,
    hasNextPage = false,
    onNextPage,
    onPreviousPage,
    children,
    ...rest
  }: TablePropsType,
  ref: ForwardedRef<HTMLElement>,
): ReactElement {
  return (
    <STable
      ref={ref}
      variant={variant}
      loading={loading}
      paginate={paginate}
      hasPreviousPage={hasPreviousPage}
      hasNextPage={hasNextPage}
      onNextPage={onNextPage}
      onPreviousPage={onPreviousPage}
      {...rest}
    >
      {children}
    </STable>
  );
}

type TableComponentType = ((
  props: TablePropsType & { ref?: ForwardedRef<HTMLElement> },
) => ReactElement) & {
  HeaderRow: typeof TableHeaderRow;
  Header: typeof TableHeader;
  Body: typeof TableBody;
  Row: typeof TableRow;
  Cell: typeof TableCell;
  SubRowConnector: typeof TableSubRowConnector;
  ExpandButton: typeof TableExpandButton;
};

export const Table = forwardRef(TableInner) as unknown as TableComponentType;

Table.HeaderRow = TableHeaderRow;
Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Cell = TableCell;
Table.SubRowConnector = TableSubRowConnector;
Table.ExpandButton = TableExpandButton;
