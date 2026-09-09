import { forwardRef } from "react";
import type { CSSProperties, ReactNode } from "react";

type IconTileToneType =
  "success" | "neutral" | "subdued" | "caution" | "info" | "critical";
export type IconTileColorType = "base" | "strong";
type IconTileBorderRadiusType = "none" | "small" | "base" | "large" | "full";
type IconTileSizeType = "sm" | "md" | "lg";

export type IconTilePropsType = {
  children?: ReactNode;
  /** Visual tone (background & icon color) */
  tone?: IconTileToneType;
  /** Color intensity ('base' for subtle/light tint, 'strong' for saturated solid color) */
  color?: IconTileColorType;
  /** Rounded corner style */
  borderRadius?: IconTileBorderRadiusType;
  /** Size dimensions ('sm' = 32px, 'md' = 40px, 'lg' = 44px) */
  size?: IconTileSizeType;
  /** Custom inline styles */
  style?: CSSProperties;
  /** CSS class name */
  className?: string;
  /** Element ID */
  id?: string;
  slot?: string;
  role?: string;
  "aria-label"?: string;
};

const TONE_STYLES: Record<
  IconTileColorType,
  Record<IconTileToneType, { backgroundColor: string; color: string }>
> = {
  base: {
    success: {
      backgroundColor: "#aefebe",
      color: "#059669",
    },
    neutral: {
      backgroundColor: "#ededed",
      color: "#059669",
    },
    subdued: {
      backgroundColor: "#f3f4f6",
      color: "#6b7280",
    },
    caution: {
      backgroundColor: "#fef3c7",
      color: "#d97706",
    },
    info: {
      backgroundColor: "#d4ebff",
      color: "#0284c7",
    },
    critical: {
      backgroundColor: "#fecaca",
      color: "#dc2626",
    },
  },
  strong: {
    success: {
      backgroundColor: "#059669",
      color: "#ffffff",
    },
    neutral: {
      backgroundColor: "#303030",
      color: "#ffffff",
    },
    subdued: {
      backgroundColor: "#4b5563",
      color: "#ffffff",
    },
    caution: {
      backgroundColor: "#d97706",
      color: "#ffffff",
    },
    info: {
      backgroundColor: "#0284c7",
      color: "#ffffff",
    },
    critical: {
      backgroundColor: "#dc2626",
      color: "#ffffff",
    },
  },
};

const SIZE_STYLES: Record<IconTileSizeType, { width: string; height: string }> = {
  sm: { width: "auto", height: "1.35rem" },
  md: { width: "auto", height: "2.125rem" },
  lg: { width: "auto", height: "2.75rem" },
};

const BORDER_RADIUS_STYLES: Record<IconTileBorderRadiusType, { borderRadius: string }> = {
  none: { borderRadius: "0px" },
  small: { borderRadius: "0.25rem" },
  base: { borderRadius: "0.5rem" },
  large: { borderRadius: "0.75rem" },
  full: { borderRadius: "9999px" },
};

/**
 * IconTile component providing a stylized background tile for icons.
 * Commonly used in feature lists, onboarding steps, and status cards.
 */
export const IconTile = forwardRef<HTMLDivElement, IconTilePropsType>(function IconTile(
  {
    children,
    tone = "success",
    color = "base",
    borderRadius = "base",
    size = "md",
    style,
    className,
    ...rest
  },
  ref,
) {
  const colorGroup = TONE_STYLES[color] ?? TONE_STYLES.base;
  const toneStyle = colorGroup[tone] ?? colorGroup.success;
  const sizeStyle = SIZE_STYLES[size] ?? SIZE_STYLES.md;
  const radiusStyle = BORDER_RADIUS_STYLES[borderRadius] ?? BORDER_RADIUS_STYLES.base;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        aspectRatio: "1/1",
        ...sizeStyle,
        ...radiusStyle,
        ...toneStyle,
        ...(color === "strong" ? { "--s-icon-color-26021": "#fff" } : {}),
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
});
