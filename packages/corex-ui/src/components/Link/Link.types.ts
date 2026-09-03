import type { ReactNode } from "react";

export type LinkPropsType = {
  children?: ReactNode;
  url?: string;
  onClick?: (event: MouseEvent) => void;
  external?: boolean;
  monochrome?: boolean;
  removeUnderline?: boolean;
  id?: string;
  className?: string;
  /** Standard HTML slot attribute, used to place this Link into a parent's named slot (e.g. s-page's breadcrumb-actions). */
  slot?: string;
  accessibilityLabel?: string;
};

export type LinkProps = LinkPropsType;
