import { forwardRef } from "react";
import type { CSSProperties, MouseEvent, ReactNode } from "react";

type IconTileToneType =
  | "success"
  | "neutral"
  | "warning"
  | "subdued"
  | "caution"
  | "info"
  | "critical"
  | "transparent";
export type IconTileColorType = "base" | "strong";
type IconTileBorderRadiusType = "none" | "small" | "base" | "large" | "full";
type IconTileSizeType = "small" | "base" | "large" | "auto";

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
  /** Click handler */
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
};
const TONE_STYLES: Record<
  IconTileColorType,
  Record<IconTileToneType, { backgroundColor: string; color: string }>
> = {
  base: {
    // Active
    success: {
      backgroundColor: "#BCF97E",
      color: "#2C4A12",
    },

    // Fulfilled
    neutral: {
      backgroundColor: "#F2F2F2",
      color: "#4A4A4A",
    },

    // Soft/subdued gray
    subdued: {
      backgroundColor: "#F3F3F3",
      color: "#666666",
    },

    // Open
    caution: {
      backgroundColor: "#FADD82",
      color: "#533C0F",
    },

    // Draft
    info: {
      backgroundColor: "#96E1FB",
      color: "#25586D",
    },

    // Action required
    critical: {
      backgroundColor: "#F8D2CE",
      color: "#741C14",
    },

    transparent: {
      backgroundColor: "transparent",
      color: "#741C14",
    },
    warning: {
      backgroundColor: "#F5C28A",
      color: "#6D3814",
    },
  },

  strong: {
    success: {
      backgroundColor: "#A3F45E",
      color: "#24420B",
    },

    neutral: {
      backgroundColor: "#E2E2E2",
      color: "#383838",
    },

    subdued: {
      backgroundColor: "#DFE0E1",
      color: "#505050",
    },

    caution: {
      backgroundColor: "#F6CE62",
      color: "#493208",
    },

    warning: {
      backgroundColor: "#F0AD68",
      color: "#5F2E0B",
    },

    info: {
      backgroundColor: "#72D7F5",
      color: "#17495C",
    },

    critical: {
      backgroundColor: "#F3B9B4",
      color: "#64150F",
    },

    transparent: {
      backgroundColor: "transparent",
      color: "#64150F",
    },
  },
};

const SIZE_STYLES: Record<IconTileSizeType, { width: string; height: string }> = {
  small: { width: "auto", height: "1.35rem" },
  base: { width: "auto", height: "2.125rem" },
  large: { width: "auto", height: "2.75rem" },
  auto: { width: "auto", height: "auto" },
};

const BORDER_RADIUS_STYLES: Record<IconTileBorderRadiusType, { borderRadius: string }> = {
  none: { borderRadius: "0px" },
  small: { borderRadius: "0.25rem" },
  base: { borderRadius: "0.5rem" },
  large: { borderRadius: "0.8125rem" },
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
    size = "base",
    style,
    className,
    ...rest
  },
  ref,
) {
  const colorGroup = TONE_STYLES[color] ?? TONE_STYLES.base;
  const toneStyle = colorGroup[tone] ?? colorGroup.success;
  const sizeStyle = SIZE_STYLES[size] ?? SIZE_STYLES.base;
  const radiusStyle = BORDER_RADIUS_STYLES[borderRadius] ?? BORDER_RADIUS_STYLES.base;

  const { commandFor, ...domRest } = rest as any;

  return (
    <div
      ref={ref}
      className={className}
      commandfor={commandFor}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        aspectRatio: size === "auto" ? "auto" : "1/1",
        ...sizeStyle,
        ...radiusStyle,
        ...toneStyle,
        ...style,
      }}
      {...domRest}
    >
      {children}
    </div>
  );
});
