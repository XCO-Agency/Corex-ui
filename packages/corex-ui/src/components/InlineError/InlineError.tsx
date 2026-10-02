import { forwardRef } from "react";
import { Text } from "../Text";
import type { InlineErrorPropsType } from "./InlineError.types";

/**
 * The message under a field that failed validation. Returns nothing without a
 * message, so call sites can render it unconditionally as they did in v12.
 */
export const InlineError = forwardRef<HTMLElement, InlineErrorPropsType>(
  function InlineError({ message, fieldID, id, ...rest }, ref) {
    if (!message) return null;

    return (
      <Text
        ref={ref}
        as="span"
        tone="critical"
        variant="small"
        id={id ?? (fieldID ? `${fieldID}-error` : undefined)}
        {...rest}
      >
        {message}
      </Text>
    );
  },
);
