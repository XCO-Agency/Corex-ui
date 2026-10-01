import { forwardRef, Fragment } from "react";
import type { ForwardedRef, ReactElement } from "react";
import { BlockStack } from "../BlockStack";
import { Clickable } from "../Clickable";
import { InlineStack } from "../InlineStack";
import { Spinner } from "../Spinner";
import type { ResourceItemPropsType, ResourceListPropsType } from "./ResourceList.types";

/**
 * One row of a `ResourceList`: a `Clickable`, which is a link when given a `url`
 * and a button otherwise, so the row is one focusable control either way.
 */
export const ResourceItem = forwardRef<HTMLElement, ResourceItemPropsType>(
  function ResourceItem(
    {
      children,
      url,
      onClick,
      accessibilityLabel,
      media,
      persistActions,
      shortcutActions,
      verticalAlignment,
      selected,
      ...rest
    },
    ref,
  ) {
    return (
      <Clickable
        ref={ref}
        href={url}
        onClick={onClick ? () => onClick() : undefined}
        accessibilityLabel={accessibilityLabel}
        padding="small-100"
        borderRadius="base"
        background={selected ? "subdued" : undefined}
        inlineSize="fill"
        {...rest}
      >
        {media ? (
          <InlineStack gap="small-100" blockAlign="center">
            {media}
            {children}
          </InlineStack>
        ) : (
          children
        )}
      </Clickable>
    );
  },
);

/**
 * A list that renders each item through a callback, as v12 did.
 *
 * Selection, sorting and bulk actions are not reproduced: `IndexTable` is the
 * component for a list that does those, and reimplementing them twice would only
 * give consuming apps two different answers.
 */
const ResourceListInner = forwardRef<HTMLDivElement, ResourceListPropsType>(
  function ResourceList(
    { items = [], renderItem, resourceName, emptyState, loading, gap = "none", ...rest },
    ref,
  ) {
    if (loading)
      return (
        <Spinner accessibilityLabel={`Loading ${resourceName?.plural ?? "items"}`} />
      );
    if (items.length === 0 && emptyState) return <>{emptyState}</>;

    return (
      <BlockStack ref={ref} gap={gap} aria-label={resourceName?.plural} {...rest}>
        {items.map((item, index) => (
          <Fragment key={index}>
            {renderItem?.(
              item,
              String((item as { id?: string | number } | null)?.id ?? index),
              index,
            )}
          </Fragment>
        ))}
      </BlockStack>
    );
  },
);

/**
 * Re-typed as a generic function component, so `renderItem` receives the item
 * type that `items` was given rather than `unknown`. `forwardRef` cannot carry a
 * type parameter of its own, so the implementation above stays non-generic.
 */
export const ResourceList = ResourceListInner as unknown as <T>(
  props: ResourceListPropsType<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => ReactElement | null;
