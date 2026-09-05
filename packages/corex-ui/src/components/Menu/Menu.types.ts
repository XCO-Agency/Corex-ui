import type { ReactNode } from "react";
import type { PolarisPropsType } from "../../types/common";

type NativeMenuProps = PolarisPropsType<"s-menu">;

export type MenuPropsType = Omit<NativeMenuProps, "children" | "id"> & {
  /** Required so a trigger `Button` can reference it via `commandFor`. */
  id: string;
  children?: ReactNode;
  className?: string;
};
