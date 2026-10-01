import { forwardRef } from "react";
import { BlockStack } from "../BlockStack";
import { InlineStack } from "../InlineStack";
import { Skeleton } from "../Skeleton";
import type { SkeletonPagePropsType } from "./SkeletonPage.types";

/**
 * A page-shaped loading state: a title row, optionally with an action, above
 * whatever placeholders the page passes as children.
 *
 * `title` takes a node so a page that already knows its heading can show the real
 * one while the body loads, which reads better than a grey bar.
 */
export const SkeletonPage = forwardRef<HTMLDivElement, SkeletonPagePropsType>(
  function SkeletonPage(
    { children, title = true, primaryAction, narrowWidth, fullWidth, ...rest },
    ref,
  ) {
    return (
      <BlockStack ref={ref} gap="base" {...rest}>
        {title === false && !primaryAction ? null : (
          <InlineStack gap="base" blockAlign="center" align="space-between">
            {title === true ? (
              <Skeleton height="1.5rem" width="10rem" />
            ) : (
              (title ?? null)
            )}
            {primaryAction ? <Skeleton height="2rem" width="6rem" /> : null}
          </InlineStack>
        )}
        {children}
      </BlockStack>
    );
  },
);
