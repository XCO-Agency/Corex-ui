import {
  forwardRef,
  type CSSProperties,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from "react";
import type { SkeletonPropsType, SkeletonRadiusType } from "./Skeleton.types";

const SKELETON_STYLE_ID = "corex-ui-skeleton-styles";
const SKELETON_CSS = `
@keyframes corex-skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  [data-corex-skeleton] {
    animation: none !important;
  }
}
`;

if (typeof document !== "undefined" && !document.getElementById(SKELETON_STYLE_ID)) {
  const styleEl = document.createElement("style");
  styleEl.id = SKELETON_STYLE_ID;
  styleEl.textContent = SKELETON_CSS;
  document.head.appendChild(styleEl);
}

function resolveRadius(radius: SkeletonRadiusType | number = "base"): string {
  if (typeof radius === "number") return `${radius}px`;
  switch (radius) {
    case "small":
      return "var(--p-border-radius-100, 4px)";
    case "large":
      return "var(--p-border-radius-300, 12px)";
    case "full":
      return "var(--p-border-radius-full, 9999px)";
    case "none":
      return "0px";
    case "base":
    default:
      return "var(--p-border-radius-200, 8px)";
  }
}

export const Skeleton: ForwardRefExoticComponent<
  SkeletonPropsType & RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, SkeletonPropsType>(function Skeleton(
  {
    width,
    inlineSize,
    height,
    blockSize,
    borderRadius = "base",
    className,
    style,
    children,
    id,
    ...rest
  },
  ref,
) {
  const resolvedWidth = inlineSize ?? width ?? "100%";
  const resolvedHeight = blockSize ?? height ?? 16;

  const baseStyle: CSSProperties = {
    display: "block",
    width: typeof resolvedWidth === "number" ? `${resolvedWidth}px` : resolvedWidth,
    height: typeof resolvedHeight === "number" ? `${resolvedHeight}px` : resolvedHeight,
    borderRadius: resolveRadius(borderRadius),
    backgroundImage:
      "linear-gradient(90deg, var(--p-color-bg-fill-tertiary, #e4e5e7) 0%, var(--p-color-bg-surface-secondary-hover, #f6f6f7) 50%, var(--p-color-bg-fill-tertiary, #e4e5e7) 100%)",
    backgroundSize: "200% 100%",
    animation: "corex-skeleton-shimmer 1.5s ease-in-out infinite",
    userSelect: "none",
    overflow: "hidden",
    flexShrink: 0,
    ...style,
  };

  return (
    <div
      ref={ref}
      id={id}
      data-corex-skeleton=""
      aria-hidden="true"
      className={className}
      style={baseStyle}
      {...rest}
    >
      {children}
    </div>
  );
});
