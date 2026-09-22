import { forwardRef, useEffect, useId, useLayoutEffect, useMemo, useRef } from "react";
import type { CSSProperties, ElementType } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import { mergeRefs } from "../../core/mergeRefs";
import type { TextPropsType } from "./Text.types";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const SText = createWebComponent<HTMLElement>("s-text");
const STooltip = createWebComponent<HTMLElement>("s-tooltip");

const FONT_WEIGHT_MAP: Record<string, number> = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

export const VARIANT_SIZE_MAP: Record<
  | "xs"
  | "small"
  | "bodySm"
  | "base"
  | "bodyMd"
  | "large"
  | "bodyLg"
  | "headingSm"
  | "headingMd"
  | "headingLg"
  | "headingXl",
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
  props,
  forwardedRef,
) {
  const {
    children,
    as,
    variant = "base",
    heading,
    underline = true,
    fontWeight,
    color,
    tone,
    style,
    className,
    tooltip,
    interestFor,
    lineClamp,
    breakWord,
    numeric,
    id: customId,
    ...rest
  } = props;

  const autoId = useId().replace(/:/g, "");
  const id = customId || interestFor || `corex-text-tooltip-${autoId}`;
  const hasTooltip = Boolean(tooltip);

  const innerRef = useRef<HTMLElement>(null);
  const mergedRef = useMemo(() => mergeRefs(innerRef, forwardedRef), [forwardedRef]);

  // Inject a shadow-root override so open shadow roots inherit external typography styles
  useIsomorphicLayoutEffect(() => {
    const node = innerRef.current;
    if (!node) return;

    const injectShadowReset = (root: ShadowRoot) => {
      if (!root || root.querySelector("style[data-corex-text-reset]")) return;
      try {
        const styleEl = document.createElement("style");
        styleEl.setAttribute("data-corex-text-reset", "true");
        styleEl.textContent = `
          :host {
            display: contents;
          }
          :host, * {
            font-size: inherit !important;
            line-height: inherit !important;
            font-weight: inherit !important;
            color: inherit !important;
          }
        `;
        root.appendChild(styleEl);
      } catch {
        // Ignore in environments where shadow DOM style injection is restricted
      }
    };

    if (node.shadowRoot) {
      injectShadowReset(node.shadowRoot);
    } else if (typeof customElements !== "undefined" && customElements.whenDefined) {
      customElements.whenDefined("s-text").then(() => {
        if (node.shadowRoot) {
          injectShadowReset(node.shadowRoot);
        }
      });
    }
  }, []);

  if (!children && children !== 0) return null;

  const config = VARIANT_SIZE_MAP?.[variant] ?? VARIANT_SIZE_MAP.base;
  const WrapperTag: ElementType | undefined =
    as || (heading ? config.headingTag : variant !== "base" ? "span" : undefined);

  const resolvedWeight = fontWeight
    ? (FONT_WEIGHT_MAP[fontWeight] ?? fontWeight)
    : heading
      ? config.headingWeight
      : "medium";

  const isSubdued = color === "subdued" || tone === "neutral";
  const polarisColor =
    color === "subdued"
      ? "subdued"
      : color === "base" || color === "strong"
        ? color
        : undefined;

  const polarisTone =
    tone && tone !== "white" && tone !== "neutral" ? tone : undefined;

  // Resolve direct CSS color for light DOM styling
  const resolvedColor = (() => {
    if (style?.color) return style.color;
    if (tone === "white") return "#ffffff";
    if (tone === "critical" || color === "critical")
      return "var(--p-color-text-critical, #d72c0d)";
    if (tone === "success" || color === "success")
      return "var(--p-color-text-success, #108043)";
    if (tone === "warning" || color === "warning")
      return "var(--p-color-text-warning, #916a00)";
    if (tone === "caution") return "var(--p-color-text-caution, #8a6116)";
    if (tone === "info" || color === "info")
      return "var(--p-color-text-info, #0066cc)";
    if (isSubdued) return "var(--p-color-text-subdued, #6d7175)";
    if (color === "strong") return "var(--p-color-text-strong, #1a1a1a)";
    if (color && color !== "base") return color;
    return undefined;
  })();

  const typographyStyle: CSSProperties = {
    fontSize: config.fontSize,
    lineHeight: config.lineHeight,
    fontWeight: resolvedWeight,
    color: resolvedColor,
    fontVariantNumeric: numeric ? "tabular-nums" : undefined,
    wordBreak: breakWord ? "break-word" : undefined,
    overflowWrap: breakWord ? "break-word" : undefined,
    ...(lineClamp
      ? {
          display: "-webkit-box",
          WebkitLineClamp: lineClamp,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }
      : undefined),
  };

  // Slotted light DOM span guarantees font/line-height/weight precedence over shadow root defaults
  const slottedContent = (
    <span style={typographyStyle}>
      {children}
    </span>
  );

  const textNode = (
    <SText
      ref={mergedRef}
      id={customId}
      interestFor={hasTooltip ? id : undefined}
      color={polarisColor}
      tone={polarisTone}
      style={!WrapperTag ? { ...typographyStyle, ...style } : undefined}
      className={!WrapperTag ? className : undefined}
      {...rest}
    >
      {slottedContent}
    </SText>
  );

  return (
    <>
      {WrapperTag ? (
        <WrapperTag
          className={className}
          style={{
            margin: 0,
            display: heading ? "flex" : undefined,
            borderBlockEnd:
              hasTooltip && underline
                ? "2px dotted var(--p-color-border-tertiary, #cccccc)"
                : "none",
            ...typographyStyle,
            ...style,
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
