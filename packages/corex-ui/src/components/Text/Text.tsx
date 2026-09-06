import { forwardRef, useId } from "react";
import type { CSSProperties, ElementType } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { TextPropsType } from "./Text.types";

const SText = createWebComponent<HTMLElement>("s-text");
const STooltip = createWebComponent<HTMLElement>("s-tooltip");

export const VARIANT_SIZE_MAP: Record<
  NonNullable<TextPropsType["variant"]>,
  {
    fontSize: string;
    lineHeight: string;
    headingTag: "h2" | "h3" | "h4";
    headingWeight: number;
  }
> = {
  xs: {
    fontSize: "0.7rem",
    lineHeight: "1rem",
    headingTag: "h4",
    headingWeight: 600,
  },
  small: {
    fontSize: "0.75rem",
    lineHeight: "1rem",
    headingTag: "h4",
    headingWeight: 600,
  },
  base: {
    fontSize: "0.8125rem",
    lineHeight: "1.25rem",
    headingTag: "h3",
    headingWeight: 600,
  },
  large: {
    fontSize: "1.25rem",
    lineHeight: "1.75rem",
    headingTag: "h2",
    headingWeight: 700,
  },
};

export const Text = forwardRef<HTMLElement, TextPropsType>(function Text(
  {
    children,
    as,
    truncate,
    variant = "base",
    heading,
    underline = true,
    style,
    className,
    tooltip,
    interestFor,
    ...rest
  },
  ref,
) {
  const autoId = useId().replace(/:/g, "");
  const id = rest.id || interestFor || `corex-text-tooltip-${autoId}`;
  const hasTooltip = Boolean(tooltip);

  if (!children && children !== 0) return null;
  const config = VARIANT_SIZE_MAP[variant] || VARIANT_SIZE_MAP.base;
  const WrapperTag: ElementType = as || (heading ? config.headingTag : "span");

  return (
    <>
      <WrapperTag
        className={className}
        style={{
          margin: 0,
          borderBlockEnd:
            hasTooltip && underline
              ? "2px dotted var(--p-color-border-tertiary, #cccccc)"
              : "none",
          lineHeight: config.lineHeight,
          "--s-global-font-weight-26021": heading ? config.headingWeight : "medium",
          "--s-global-font-size-26021": config.fontSize,
        }}
      >
        <SText ref={ref} interestFor={hasTooltip ? id : interestFor} {...rest}>
          {children}
        </SText>
        <s-text tone="critical" />
      </WrapperTag>
      {tooltip && <STooltip id={id}>{tooltip}</STooltip>}
    </>
  );
});
