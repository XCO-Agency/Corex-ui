import { forwardRef, useId } from "react";
import type { CSSProperties, ElementType } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { TextPropsType } from "./Text.types";

const SText = createWebComponent<HTMLElement>("s-text");
const SParagraph = createWebComponent<HTMLElement>("s-paragraph");
const STooltip = createWebComponent<HTMLElement>("s-tooltip");

const FONT_WEIGHT_MAP: Record<string, number> = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

export const VARIANT_SIZE_MAP: Record<
  string,
  {
    fontSize: string;
    lineHeight: string;
    headingTag: "h2" | "h3" | "h4";
    headingWeight: number;
  }
> = {
  xs: {
    fontSize: "0.7rem",
    lineHeight: "0.9rem",
    headingTag: "h4",
    headingWeight: 600,
  },
  small: {
    fontSize: "0.75rem",
    lineHeight: "0.9rem",
    headingTag: "h4",
    headingWeight: 600,
  },
  bodySm: {
    fontSize: "0.75rem",
    lineHeight: "0.9rem",
    headingTag: "h4",
    headingWeight: 400,
  },
  base: {
    fontSize: "0.8125rem",
    lineHeight: "1.2rem",
    headingTag: "h3",
    headingWeight: 600,
  },
  bodyMd: {
    fontSize: "0.8125rem",
    lineHeight: "1.2rem",
    headingTag: "h3",
    headingWeight: 400,
  },
  large: {
    fontSize: "1rem",
    lineHeight: "1.2rem",
    headingTag: "h2",
    headingWeight: 600,
  },
  bodyLg: {
    fontSize: "1rem",
    lineHeight: "1.2rem",
    headingTag: "h2",
    headingWeight: 400,
  },
  headingSm: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    headingTag: "h4",
    headingWeight: 600,
  },
  headingMd: {
    fontSize: "1rem",
    lineHeight: "1.4rem",
    headingTag: "h3",
    headingWeight: 600,
  },
  headingLg: {
    fontSize: "1.25rem",
    lineHeight: "1.6rem",
    headingTag: "h2",
    headingWeight: 600,
  },
  headingXl: {
    fontSize: "1.5rem",
    lineHeight: "1.8rem",
    headingTag: "h2",
    headingWeight: 700,
  },
};

export const Text = forwardRef<HTMLElement, TextPropsType>(function Text(
  {
    children,
    as,
    variant = "base",
    heading,
    underline = true,
    fontWeight,
    color,
    style,
    className,
    tooltip,
    interestFor,
    lineClamp,
    ...rest
  },
  ref,
) {
  const autoId = useId().replace(/:/g, "");
  const id = rest.id || interestFor || `corex-text-tooltip-${autoId}`;
  const hasTooltip = Boolean(tooltip);

  if (!children && children !== 0) return null;
  const config = VARIANT_SIZE_MAP[variant] || VARIANT_SIZE_MAP.base;
  const WrapperTag: ElementType | undefined =
    as || (heading ? config.headingTag : undefined);

  const resolvedWeight = fontWeight
    ? (FONT_WEIGHT_MAP[fontWeight] ?? fontWeight)
    : heading
      ? config.headingWeight
      : "medium";

  const isSubdued = color === "subdued";
  const polarisColor = isSubdued
    ? "subdued"
    : color === "base" || color === "strong"
      ? color
      : undefined;

  const textNode = (
    <SText
      ref={ref}
      interestFor={hasTooltip ? id : undefined}
      color={polarisColor}
      {...rest}
    >
      {heading ? (
        <SParagraph
          ref={ref}
          interestFor={hasTooltip ? id : undefined}
          lineClamp={lineClamp}
          {...rest}
        >
          {children}
        </SParagraph>
      ) : (
        children
      )}
    </SText>
  );

  return (
    <>
      {WrapperTag ? (
        <WrapperTag
          className={className}
          style={{
            margin: 0,
            display: "flex",
            borderBlockEnd:
              hasTooltip && underline
                ? "2px dotted var(--p-color-border-tertiary, #cccccc)"
                : "none",
            "--s-global-line-height-26021": config.lineHeight,
            "--s-global-font-weight-26021": resolvedWeight,
            "--s-global-font-size-26021": config.fontSize,
            ...style,
            ...(rest.tone === "white"
              ? { "--s-global-color-26021": style?.color || "#fff" }
              : isSubdued
                ? { "--s-global-color-26021": "var(--p-color-text-subdued, #6d7175)" }
                : undefined),
          }}
        >
          {textNode}
        </WrapperTag>
      ) : (
        textNode
      )}
      {tooltip && <STooltip id={id}>{tooltip}</STooltip>}
    </>
  );
});
