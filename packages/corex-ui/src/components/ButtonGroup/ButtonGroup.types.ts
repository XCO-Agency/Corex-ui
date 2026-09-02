import type { ReactNode } from "react";

export interface ButtonGroupProps {
  children?: ReactNode;
  /** Polaris-native spacing control. Use `none` for a segmented group. */
  gap?: "base" | "none";
  /** @deprecated Use `gap="none"` for segmented groups, or omit `gap` for the default. */
  variant?: "segmented" | "default";
  fullWidth?: boolean;
  className?: string;
  id?: string;
}
