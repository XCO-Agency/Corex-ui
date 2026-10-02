import { forwardRef } from "react";
import type { InlineCodePropsType } from "./InlineCode.types";

/**
 * A snippet of code inside a sentence.
 *
 * A real `code` element rather than a `Text`, because the monospace face and the
 * tinted surface are the component, and `s-text` offers neither. The colours are
 * Polaris variables with plain fallbacks, so it still reads correctly outside an
 * embedded admin session.
 */
export const InlineCode = forwardRef<HTMLElement, InlineCodePropsType>(
  function InlineCode({ children, style, ...rest }, ref) {
    return (
      <code
        ref={ref}
        style={{
          fontFamily:
            "var(--p-font-family-mono, ui-monospace, SFMono-Regular, Menlo, monospace)",
          fontSize: "0.875em",
          background: "var(--p-color-bg-surface-secondary, rgba(0, 0, 0, 0.05))",
          border: "1px solid var(--p-color-border-secondary, rgba(0, 0, 0, 0.08))",
          borderRadius: "var(--p-border-radius-100, 4px)",
          padding: "0 var(--p-space-100, 4px)",
          whiteSpace: "nowrap",
          ...style,
        }}
        {...rest}
      >
        {children}
      </code>
    );
  },
);
