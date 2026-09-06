import type { ReactNode } from "react";
import type { PolarisPropsType } from "../../types/common";

type NativeButtonGroupProps = PolarisPropsType<"s-button-group">;

export type ButtonGroupPropsType = Omit<NativeButtonGroupProps, "children"> & {
  children?: ReactNode;
  /** @deprecated Use `gap="none"` for segmented groups, or omit `gap` for the default. */
  variant?: "segmented" | "default";
  fullWidth?: boolean;
  className?: string;
  id?: string;
};
