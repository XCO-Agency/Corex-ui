import type { CSSProperties, ReactNode } from "react";

export type SkeletonRadiusType =
  | "small"
  | "base"
  | "large"
  | "full"
  | "none"
  | (string & {});

export type SkeletonPropsType = {
  /** Width or inlineSize of the skeleton. Default "100%". Accepts numbers (px) or CSS strings. */
  width?: string | number;
  inlineSize?: string | number;

  /** Height or blockSize of the skeleton. Default 16px. Accepts numbers (px) or CSS strings. */
  height?: string | number;
  blockSize?: string | number;

  /** Border radius: 'small' (4px) | 'base' (8px, default) | 'large' (12px) | 'full' | 'none' or custom CSS value. */
  borderRadius?: SkeletonRadiusType | number;

  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  id?: string;
};
