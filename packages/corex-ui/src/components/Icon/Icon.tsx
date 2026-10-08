import { forwardRef, useCallback, Ref } from "react";
import type { FunctionComponent, SVGProps } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { IconPropsType } from "./Icon.types";

const SIcon = createWebComponent<HTMLElement>("s-icon");

/**
 * Pixel size per `s-icon` size keyword. A `@shopify/polaris-icons` component
 * ships with only a `viewBox`, and 2.x does not ship the legacy
 * `.Polaris-Icon` stylesheet that used to size and colour it, so the SVG has no
 * intrinsic size and collapses inside a flex parent unless we size it here.
 */
const ICON_PIXEL_SIZE = { small: 16, base: 20 } as const;

function iconPixelSize(size: IconPropsType["size"]): number {
  return (
    ICON_PIXEL_SIZE[(size as keyof typeof ICON_PIXEL_SIZE) ?? "base"] ??
    ICON_PIXEL_SIZE.base
  );
}

/**
 * Inside its shadow root `s-icon` colours the glyph with
 * `color: var(--s-icon-color-<hash>, …)`, where `<hash>` changes with every
 * Polaris build. Outside `color` is ignored, so to tint the icon we read the
 * real variable name from the shadow stylesheet and set it on the host.
 */
const ICON_COLOR_VAR_PATTERN = /--s-icon-color-[\w-]+/;
let iconColorVar: string | undefined;

function findIconColorVar(root: ShadowRoot): string | undefined {
  const sheets: CSSStyleSheet[] = [
    ...(root.adoptedStyleSheets ?? []),
    ...Array.from(root.styleSheets),
  ];
  for (const sheet of sheets) {
    try {
      for (const rule of Array.from(sheet.cssRules)) {
        const match = rule.cssText.match(ICON_COLOR_VAR_PATTERN);
        if (match) return match[0];
      }
    } catch {
      // Cross-origin sheet; skip it.
    }
  }
  const style = root.querySelector("style")?.textContent ?? "";
  return style.match(ICON_COLOR_VAR_PATTERN)?.[0];
}

function applyIconColor(el: HTMLElement, color: string) {
  const apply = () => {
    if (!iconColorVar && el.shadowRoot) iconColorVar = findIconColorVar(el.shadowRoot);
    if (!iconColorVar) return false;
    el.style.setProperty(iconColorVar, color);
    return true;
  };
  if (apply()) return;
  customElements.whenDefined("s-icon").then(() => {
    if (!apply()) requestAnimationFrame(apply);
  });
}

/**
 * Icon component supporting Polaris icon source types:
 * - String identifier for Polaris web component (e.g. `"search"`, `"save"`, `"star"`).
 * - React component (Polaris SVG icon component).
 */
export const Icon = forwardRef<HTMLElement, IconPropsType>(function Icon(
  { source, tone, type, size, accessibilityLabel, style, ...rest },
  ref,
) {
  const isWhite = tone === "white" || style?.color === "#fff" || style?.color === "white";
  const iconVars: Record<string, string> = {};
  const iconColor = isWhite ? "#fff" : undefined;

  const setIconRef = useCallback(
    (el: HTMLElement | null) => {
      if (typeof ref === "function") ref(el);
      else if (ref) ref.current = el;
      if (el && iconColor) applyIconColor(el, iconColor);
    },
    [ref, iconColor],
  );
  if (typeof source === "function") {
    const SourceComponent = source as FunctionComponent<SVGProps<SVGSVGElement>>;
    const pixelSize = iconPixelSize(size);
    return (
      <span
        ref={ref as unknown as Ref<HTMLSpanElement>}
        aria-label={accessibilityLabel}
        role={accessibilityLabel ? "img" : undefined}
        style={{
          display: "inline-flex",
          flexShrink: 0,
          inlineSize: pixelSize,
          blockSize: pixelSize,
          ...(isWhite ? { color: "#fff" } : {}),
          ...style,
        }}
        {...rest}
      >
        <SourceComponent
          width={pixelSize}
          height={pixelSize}
          fill="currentColor"
          focusable="false"
          aria-hidden={accessibilityLabel ? undefined : true}
        />
      </span>
    );
  }

  return (
    <div
      style={{
        display: "contents",
        ...iconVars,
        ...style,
      }}
    >
      <SIcon
        ref={setIconRef}
        type={type ?? source ?? undefined}
        // `s-icon` has no "white" tone; the colour is set via `setIconRef`.
        tone={isWhite ? "auto" : tone}
        size={size}
        aria-label={accessibilityLabel ?? source}
        {...rest}
      />
    </div>
  );
});
