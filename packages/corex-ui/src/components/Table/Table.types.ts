import type { CSSProperties, MouseEvent, ReactNode } from "react";
import type { PolarisPropsType } from "../../types/common";

export type TablePropsType = PolarisPropsType<"s-table">;

export type TableHeaderRowPropsType = PolarisPropsType<"s-table-header-row">;

export type TableHeaderPropsType = PolarisPropsType<"s-table-header"> & {
  tooltip?: ReactNode;
};

export type TableBodyPropsType = PolarisPropsType<"s-table-body">;

export type TableRowPropsType = PolarisPropsType<"s-table-row"> & {
  /** Click event listener. */
  onClick?: (event: MouseEvent<HTMLElement>) => void;
};

export type TableCellPropsType = PolarisPropsType<"s-table-cell">;

export type TableSubRowConnectorPropsType = {
  /** When true, renders a terminal corner branch for the last child in the group. */
  isLast?: boolean;
  className?: string;
  style?: CSSProperties;
};

export type TableExpandButtonPropsType = {
  expanded: boolean;
  onToggle: (event: MouseEvent<HTMLElement>) => void;
  accessibilityLabel?: string;
  disabled?: boolean;
};
