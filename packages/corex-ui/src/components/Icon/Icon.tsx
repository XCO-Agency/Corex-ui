import { forwardRef, Ref } from "react";
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
 * Icon component supporting Polaris icon source types:
 * - String identifier for Polaris web component (e.g. `"search"`, `"save"`, `"star"`).
 * - React component (Polaris SVG icon component).
 */
export const Icon = forwardRef<HTMLElement, IconPropsType>(function Icon(
  { source, tone, type, size, accessibilityLabel, style, ...rest },
  ref,
) {
  const isWhite = tone === "white" || style?.color === "#fff" || style?.color === "white";

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
        ...(isWhite
          ? {
              color: "#fff",
              "--s-icon-color": "#fff",
              "--p-color-icon": "#fff",
              "--s-icon-color-26021": "#fff",
            }
          : {}),
        ...style,
      }}
    >
      <SIcon
        ref={ref}
        type={type ?? source ?? undefined}
        tone={tone}
        size={size}
        aria-label={accessibilityLabel ?? source}
        {...rest}
      />
    </div>
  );
});
