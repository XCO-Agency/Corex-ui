import { forwardRef } from "react";
import type { CSSProperties } from "react";
import { Button } from "../Button";
import { InlineStack } from "../InlineStack";
import { Text } from "../Text";
import type { PaginationPropsType } from "./Pagination.types";

/** Raised pill used by `floating`; a plain element so it can carry a shadow. */
const FLOATING_STYLE: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "12px",
  padding: "4px",
  borderRadius: "999px",
  background: "var(--cx-pagination-surface, #ffffff)",
  boxShadow:
    "var(--cx-pagination-shadow, 0 0 0 1px rgba(0, 0, 0, 0.06), 0 4px 12px -2px rgba(0, 0, 0, 0.16))",
};

/**
 * Previous/next paging, as v12's call sites use it.
 *
 * v12's keyboard shortcuts are not reproduced; the buttons carry the accessible
 * name. Inside a table, `Table`'s own `paginate` is the better control, because
 * the element draws the pager where the admin expects it.
 */
export const Pagination = forwardRef<HTMLDivElement, PaginationPropsType>(
  function Pagination(
    {
      hasPrevious,
      hasNext,
      onPrevious,
      onNext,
      label,
      previousTooltip,
      nextTooltip,
      accessibilityLabel,
      floating = false,
      style,
      ...rest
    },
    ref,
  ) {
    if (floating) {
      return (
        <div
          ref={ref}
          role="navigation"
          aria-label={accessibilityLabel ?? "Pagination"}
          style={{ ...FLOATING_STYLE, ...style }}
          {...rest}
        >
          <Button
            variant="tertiary"
            icon="chevron-left"
            accessibilityLabel={previousTooltip ?? "Previous"}
            disabled={!hasPrevious}
            onClick={onPrevious}
          />
          {label ? <Text>{label}</Text> : null}
          <Button
            variant="tertiary"
            icon="chevron-right"
            accessibilityLabel={nextTooltip ?? "Next"}
            disabled={!hasNext}
            onClick={onNext}
          />
        </div>
      );
    }

    return (
      <InlineStack
        ref={ref}
        gap="small-200"
        blockAlign="center"
        aria-label={accessibilityLabel}
        style={style}
        {...rest}
      >
        <Button
          icon="chevron-left"
          accessibilityLabel={previousTooltip ?? "Previous"}
          disabled={!hasPrevious}
          onClick={onPrevious}
        />
        {label ? <Text color="subdued">{label}</Text> : null}
        <Button
          icon="chevron-right"
          accessibilityLabel={nextTooltip ?? "Next"}
          disabled={!hasNext}
          onClick={onNext}
        />
      </InlineStack>
    );
  },
);
