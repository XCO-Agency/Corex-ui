import type { ReactNode } from "react";
import type { PolarisPropsType } from "../../types/common";

type NativeTooltipProps = PolarisPropsType<"s-tooltip">;

export type TooltipPropsType = Omit<NativeTooltipProps, "children" | "content"> & {
  /** The element the tooltip is anchored to. */
  children: ReactNode;
  content: ReactNode;
  id?: string;
  className?: string;
};
