import type { ReactNode } from "react";

export interface ButtonGroupProps {
  children?: ReactNode;
  /** Removes spacing between buttons, matching legacy `Segmented` groups. */
  variant?: "segmented" | "default";
  fullWidth?: boolean;
  className?: string;
  id?: string;
}
