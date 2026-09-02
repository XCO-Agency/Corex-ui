import type { ReactNode } from "react";
import type { Alignment } from "../../types/common";

export interface BlockStackProps {
  children?: ReactNode;
  gap?: string;
  align?: Alignment;
  inlineAlign?: Alignment;
  className?: string;
  id?: string;
}
