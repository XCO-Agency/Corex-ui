import type { ReactNode } from "react";

export interface BoxProps {
  children?: ReactNode;
  padding?: string;
  background?: string;
  borderRadius?: string;
  borderWidth?: string;
  borderColor?: string;
  minWidth?: string;
  maxWidth?: string;
  width?: string;
  className?: string;
  id?: string;
}
