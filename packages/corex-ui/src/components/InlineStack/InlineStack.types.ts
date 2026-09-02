import type { ReactNode } from "react";
import type { Alignment } from "../../types/common";

export interface InlineStackProps {
  children?: ReactNode;
  gap?: string;
  align?: Alignment;
  blockAlign?: Alignment;
  wrap?: boolean;
  className?: string;
  id?: string;
}
