import { forwardRef } from "react";
import { Table } from "../Table";
import { devWarning } from "../../utils/devWarning";
import type { DataTablePropsType } from "./DataTable.types";

/**
 * v12's static data grid, on `s-table`: headings and rows in, a table out.
 *
 * Sorting, totals and footer rows are not reproduced — reach for `IndexTable`
 * when the list is interactive. Numeric columns are right-aligned by the header's
 * own `format`, so the alignment comes from the element rather than from us.
 */
export const DataTable = forwardRef<HTMLElement, DataTablePropsType>(function DataTable(
  {
    columnContentTypes = [],
    headings = [],
    rows = [],
    increasedTableDensity,
    truncate,
    verticalAlign,
    footerContent,
    ...rest
  },
  ref,
) {
  if (footerContent !== undefined) {
    devWarning(
      "DataTable",
      "`footerContent` is not rendered; `s-table` has no footer row. Pass totals as the last `rows` entry.",
    );
  }

  return (
    <Table ref={ref} {...rest}>
      <Table.HeaderRow>
        {headings.map((heading, index) => (
          <Table.HeaderCell
            key={index}
            format={columnContentTypes[index] === "numeric" ? "numeric" : undefined}
          >
            {heading}
          </Table.HeaderCell>
        ))}
      </Table.HeaderRow>
      <Table.Body>
        {rows.map((row, rowIndex) => (
          <Table.Row key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <Table.Cell key={cellIndex}>{cell}</Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
});
