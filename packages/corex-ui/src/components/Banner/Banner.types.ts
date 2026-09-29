import type { CSSProperties, ReactNode } from "react";
import type { PolarisPropsType, ToneType } from "../../types/common";

type NativeBannerProps = PolarisPropsType<"s-banner">;

export type BannerActionType = {
  content: string;
  onAction?: () => void;
  url?: string;
  external?: boolean;
};

export type BannerPropsType = NativeBannerProps & {
  /** @deprecated Use `heading`. Kept for legacy-API compatibility. */
  title?: ReactNode;
  /** Modern Polaris banner tone ('info' | 'success' | 'warning' | 'critical'). */
  /** @deprecated Use `tone`. Kept for legacy-API compatibility. */
  status?: ToneType;
};
