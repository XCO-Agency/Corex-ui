import { forwardRef } from "react";
import type { CSSProperties, ReactNode } from "react";

type IconTileToneType = "success" | "neutral" | "subdued" | "caution";
type IconTileBorderRadiusType = "none" | "small" | "base" | "large" | "full";
type IconTileSizeType = "sm" | "md" | "lg";

export type IconTilePropsType = {
  children?: ReactNode;
  /** Visual tone (background & icon color) */
  tone?: IconTileToneType;
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

const TONE_STYLES: Record<IconTileToneType, { backgroundColor: string; color: string }> =
  {
    success: {
      backgroundColor: "#ecfdf5",
      color: "#059669",
    },
    neutral: {
      backgroundColor: "#f5f8f7",
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
  };

const SIZE_STYLES: Record<IconTileSizeType, { width: string; height: string }> = {
  sm: { width: "2rem", height: "2rem" },
  md: { width: "2.5rem", height: "2.5rem" },
  lg: { width: "2.75rem", height: "2.75rem" },
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
    borderRadius = "base",
    size = "md",
    style,
    className,
    ...rest
  },
  ref,
) {
  const toneStyle = TONE_STYLES[tone] ?? TONE_STYLES.success;
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
        ...sizeStyle,
        ...radiusStyle,
        ...toneStyle,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
});
