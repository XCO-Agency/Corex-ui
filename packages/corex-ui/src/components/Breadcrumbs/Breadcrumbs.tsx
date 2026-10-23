import { Fragment } from "react";
import { Link } from "../Link";
import type { BreadcrumbsPropsType } from "./Breadcrumbs.types";

/**
 * Breadcrumb trail for `s-page`. Polaris web components have no standalone
 * breadcrumb element, so each item renders an `s-link` with
 * `slot="breadcrumb-actions"`. Place inside `Page`, whose `breadcrumbActions`
 * slot receives them. Returns the links without a wrapper so the slot attribute
 * stays on each link.
 */
export function Breadcrumbs({ items }: BreadcrumbsPropsType) {
  return (
    <Fragment>
      {items.map((item, index) => (
        <Link
          key={index}
          slot="breadcrumb-actions"
          href={item.href}
          external={item.external}
        >
          {item.label}
        </Link>
      ))}
    </Fragment>
  );
}
