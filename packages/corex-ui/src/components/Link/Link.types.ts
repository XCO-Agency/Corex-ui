import type { ReactNode } from "react";

export interface LinkProps {
  children?: ReactNode;
  url?: string;
  onClick?: (event: MouseEvent) => void;
  external?: boolean;
  monochrome?: boolean;
  removeUnderline?: boolean;
  id?: string;
  className?: string;
}
