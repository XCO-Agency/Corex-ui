import { forwardRef, useId } from "react";
import type { CSSProperties } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { TextPropsType } from "./Text.types";
import type { ToneType } from "../../types/common";

const SText = createWebComponent<HTMLElement>("s-text");
const SHeading = createWebComponent<HTMLElement>("s-heading");
const STooltip = createWebComponent<HTMLElement>("s-tooltip");

/**
 * Text component wrapping Polaris `<s-text>` and `<s-heading>`.
 * Supports legacy `as`, `color="subdued"` translation, and `visuallyHidden`.
 */
export const Text = forwardRef<HTMLElement, TextPropsType>(function Text(
  {
    children,
    as: _as,
    truncate: _truncate,
    variant,
    color,
    tone,
    visuallyHidden,
    style,
    tooltip,
    ...rest
  },
  ref,
) {
  const id = useId();
  const isTone =
    color &&
    color !== "subdued" &&
    color !== "base" &&
    ["auto", "success", "warning", "critical", "info", "neutral", "caution"].includes(color as string);

  const resolvedTone = tone ?? (isTone ? (color as ToneType) : undefined);
  const resolvedColor = !isTone ? color : undefined;

  const resolvedStyle: CSSProperties | undefined = visuallyHidden
    ? {
        border: 0,
        clip: "rect(0 0 0 0)",
        height: "1px",
        margin: "-1px",
        overflow: "hidden",
        padding: 0,
        position: "absolute",
        width: "1px",
        whiteSpace: "nowrap",
        ...style,
      }
    : style;

  if (variant?.startsWith("heading")) {
    return (
      <SHeading
        ref={ref}
        data-legacy-variant={variant}
        tone={resolvedTone}
        style={resolvedStyle}
        {...rest}
      >
        {children}
      </SHeading>
    );
  }

  return (
    <>
      <SText
        ref={ref}
        variant={variant}
        color={resolvedColor}
        tone={resolvedTone}
        style={resolvedStyle}
        {...rest}
        interestFor={tooltip ? id : undefined}
      >
        {children}
      </SText>
      {tooltip && <STooltip id={id}>{tooltip}</STooltip>}
    </>
  );
});
