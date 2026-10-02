import { forwardRef } from "react";
import { Button } from "../Button";
import { InlineStack } from "../InlineStack";
import { Text } from "../Text";
import type { PaginationPropsType } from "./Pagination.types";

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
      ...rest
    },
    ref,
  ) {
    return (
      <InlineStack
        ref={ref}
        gap="small-200"
        blockAlign="center"
        aria-label={accessibilityLabel}
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
