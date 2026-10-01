import type { CSSProperties, ReactNode } from "react";
import type { PolarisPropsType } from "../../types/common";

type NativeChipProps = PolarisPropsType<"s-chip">;

export type TagPropsType = Omit<NativeChipProps, "children" | "onRemove"> & {
  children?: ReactNode;
  /** Passing a handler makes the tag removable, as it did in v12. */
  onRemove?: () => void;
  disabled?: boolean;
  /** @deprecated v12 linked a tag to a URL; wrap it in a `Link` instead. */
  url?: string;
  id?: string;
  className?: string;
  style?: CSSProperties;
};
