import type { ReactNode } from "react";

export type BreadcrumbItemType = {
  /** Visible label of the link. */
  label: ReactNode;
  /** Destination URL. */
  href?: string;
  /** Opens the link in a new tab when true. */
  external?: boolean;
};

export type BreadcrumbsPropsType = {
  /** Ordered list of links, first item is the top of the trail. */
  items: BreadcrumbItemType[];
};
