import type { ReactNode } from "react";

export interface MenuProps {
  /** Required so a trigger `Button` can reference it via `commandFor`. */
  id: string;
  children?: ReactNode;
  className?: string;
}
