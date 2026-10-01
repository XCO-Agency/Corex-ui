import type { CSSProperties, ReactNode } from "react";

export type DataTableColumnContentTypeType = "text" | "numeric";

export type DataTablePropsType = {
  /** Right-aligns the `numeric` columns, through `s-table-header`'s `format`. */
  columnContentTypes?: DataTableColumnContentTypeType[];
  headings?: ReactNode[];
  rows?: ReactNode[][];
  /** @deprecated `s-table` has one row density. */
  increasedTableDensity?: boolean;
  /** @deprecated v12 truncated long cells; `s-table` wraps them. */
  truncate?: boolean;
  /** @deprecated No `s-table` equivalent. */
  verticalAlign?: string;
  /** @deprecated No footer row; render totals in the last `rows` entry. */
  footerContent?: ReactNode;
  loading?: boolean;
  id?: string;
  className?: string;
  style?: CSSProperties;
};
