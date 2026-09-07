import type { ReactNode } from "react";

export type FramePropsType = {
  children: ReactNode;
};

/**
 * High-fidelity wireframe vector illustrations for the Overview grid.
 * Designed with a consistent 160x100 viewBox and a modern, neutral Polaris palette
 * that smoothly adapts across light and dark themes using CSS variables.
 */
function Frame({ children }: FramePropsType) {
  return (
    <svg
      className="thumbnail-svg"
      viewBox="0 0 160 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

// Adaptive neutral surfaces & borders
const cardBg = "var(--card, #ffffff)";
const cardBorder = "var(--border, #e1e3e5)";
const mutedBg = "var(--muted, #f1f2f3)";
const textPrimary = "var(--foreground, #202223)";
const textMuted = "var(--muted-foreground, #6d7175)";

// Refined Polaris accents
const accent = "#005bd3";
const accentTint = "rgba(0, 91, 211, 0.12)";
const accentBorder = "rgba(0, 91, 211, 0.4)";
const success = "#108043";
const successTint = "rgba(16, 128, 67, 0.12)";
const successBorder = "rgba(16, 128, 67, 0.4)";
const warning = "#b98900";
const warningTint = "rgba(185, 137, 0, 0.12)";
const warningBorder = "rgba(185, 137, 0, 0.4)";
const critical = "#d72c0d";

/* =========================================================================
   ACTIONS
   ========================================================================= */

export function ButtonThumbnail() {
  return (
    <Frame>
      {/* Primary button */}
      <rect x="22" y="36" width="62" height="28" rx="6" fill={accent} />
      <circle cx="34" cy="50" r="4" fill="#ffffff" fillOpacity="0.9" />
      <rect x="44" y="47" width="28" height="6" rx="3" fill="#ffffff" />

      {/* Secondary outline button */}
      <rect
        x="90"
        y="36"
        width="48"
        height="28"
        rx="6"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      <rect
        x="102"
        y="47"
        width="24"
        height="6"
        rx="3"
        fill={textMuted}
        fillOpacity="0.6"
      />
    </Frame>
  );
}

export function ButtonGroupThumbnail() {
  return (
    <Frame>
      <rect
        x="24"
        y="36"
        width="112"
        height="28"
        rx="6"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      {/* Active segment */}
      <rect
        x="25"
        y="37"
        width="37"
        height="26"
        rx="5"
        fill={accent}
        fillOpacity="0.12"
        stroke={accent}
        strokeWidth="1"
      />
      <rect x="36" y="47" width="15" height="6" rx="3" fill={accent} />

      {/* Segment 2 */}
      <line x1="63" y1="41" x2="63" y2="59" stroke={cardBorder} strokeWidth="1" />
      <rect
        x="74"
        y="47"
        width="18"
        height="6"
        rx="3"
        fill={textMuted}
        fillOpacity="0.6"
      />

      {/* Segment 3 */}
      <line x1="100" y1="41" x2="100" y2="59" stroke={cardBorder} strokeWidth="1" />
      <rect
        x="110"
        y="47"
        width="16"
        height="6"
        rx="3"
        fill={textMuted}
        fillOpacity="0.6"
      />
    </Frame>
  );
}

export function ClickableThumbnail() {
  return (
    <Frame>
      <rect
        x="24"
        y="28"
        width="112"
        height="44"
        rx="8"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      {/* Leading icon container */}
      <rect x="34" y="38" width="24" height="24" rx="6" fill={accentTint} />
      <circle cx="46" cy="50" r="5" fill={accent} />

      {/* Content lines */}
      <rect
        x="66"
        y="41"
        width="42"
        height="6"
        rx="3"
        fill={textPrimary}
        fillOpacity="0.85"
      />
      <rect
        x="66"
        y="52"
        width="28"
        height="5"
        rx="2.5"
        fill={textMuted}
        fillOpacity="0.45"
      />

      {/* Chevron indicator */}
      <path
        d="M122 46 l4 4 l-4 4"
        fill="none"
        stroke={textMuted}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Frame>
  );
}

export function LinkThumbnail() {
  return (
    <Frame>
      <rect
        x="28"
        y="30"
        width="104"
        height="6"
        rx="3"
        fill={textMuted}
        fillOpacity="0.25"
      />
      <rect
        x="28"
        y="46"
        width="32"
        height="6"
        rx="3"
        fill={textMuted}
        fillOpacity="0.25"
      />

      {/* Linked text */}
      <rect x="66" y="46" width="48" height="6" rx="3" fill={accent} />
      <path
        d="M119 46 l5 -5 m-4 0 h4 v4"
        fill="none"
        stroke={accent}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="66"
        y1="56"
        x2="124"
        y2="56"
        stroke={accent}
        strokeWidth="1"
        strokeDasharray="3 2"
      />

      <rect
        x="28"
        y="62"
        width="72"
        height="6"
        rx="3"
        fill={textMuted}
        fillOpacity="0.25"
      />
    </Frame>
  );
}

export function MenuThumbnail() {
  return (
    <Frame>
      {/* Trigger button */}
      <rect
        x="30"
        y="16"
        width="56"
        height="20"
        rx="5"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      <rect
        x="38"
        y="23"
        width="28"
        height="5"
        rx="2.5"
        fill={textPrimary}
        fillOpacity="0.75"
      />
      <path
        d="M74 24 l3 3 l3 -3"
        fill="none"
        stroke={textMuted}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Dropdown panel */}
      <rect
        x="30"
        y="40"
        width="100"
        height="48"
        rx="6"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      {/* Selected item */}
      <rect x="34" y="44" width="92" height="12" rx="4" fill={accentTint} />
      <path
        d="M42 50 l2 2 l4 -4"
        fill="none"
        stroke={accent}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="52" y="48" width="46" height="5" rx="2.5" fill={accent} />

      {/* Secondary item */}
      <circle cx="44" cy="62" r="2" fill={textMuted} fillOpacity="0.6" />
      <rect
        x="52"
        y="60"
        width="38"
        height="5"
        rx="2.5"
        fill={textPrimary}
        fillOpacity="0.75"
      />

      <line x1="36" y1="69" x2="124" y2="69" stroke={cardBorder} strokeWidth="0.8" />

      {/* Destructive item */}
      <circle cx="44" cy="77" r="2" fill={critical} />
      <rect
        x="52"
        y="75"
        width="30"
        height="5"
        rx="2.5"
        fill={critical}
        fillOpacity="0.8"
      />
    </Frame>
  );
}

/* =========================================================================
   APP BRIDGE
   ========================================================================= */

export function AppWindowThumbnail() {
  return (
    <Frame>
      <rect
        x="18"
        y="16"
        width="124"
        height="68"
        rx="6"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      {/* Titlebar */}
      <path d="M18 22 a6 6 0 0 1 6 -6 h112 a6 6 0 0 1 6 6 v9 h-124 Z" fill={mutedBg} />
      <line x1="18" y1="31" x2="142" y2="31" stroke={cardBorder} strokeWidth="0.8" />
      <circle cx="27" cy="23" r="2" fill="#ed6a5e" />
      <circle cx="34" cy="23" r="2" fill="#f5bf4f" />
      <circle cx="41" cy="23" r="2" fill="#62c554" />
      <rect x="54" y="20" width="52" height="6" rx="3" fill={cardBg} />

      {/* Mini sidebar */}
      <rect x="18" y="31" width="26" height="53" fill={mutedBg} fillOpacity="0.4" />
      <rect
        x="23"
        y="38"
        width="16"
        height="4"
        rx="2"
        fill={textMuted}
        fillOpacity="0.6"
      />
      <rect
        x="23"
        y="46"
        width="13"
        height="4"
        rx="2"
        fill={textMuted}
        fillOpacity="0.3"
      />
      <rect
        x="23"
        y="54"
        width="15"
        height="4"
        rx="2"
        fill={textMuted}
        fillOpacity="0.3"
      />

      {/* Main content card */}
      <rect
        x="50"
        y="38"
        width="86"
        height="40"
        rx="5"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1"
      />
      <rect
        x="56"
        y="44"
        width="38"
        height="5"
        rx="2.5"
        fill={textPrimary}
        fillOpacity="0.8"
      />
      <rect
        x="56"
        y="53"
        width="72"
        height="4"
        rx="2"
        fill={textMuted}
        fillOpacity="0.3"
      />
      <rect
        x="56"
        y="60"
        width="54"
        height="4"
        rx="2"
        fill={textMuted}
        fillOpacity="0.3"
      />
      <rect x="56" y="67" width="22" height="5" rx="2" fill={accent} />
    </Frame>
  );
}

export function AppNavThumbnail() {
  return (
    <Frame>
      <rect
        x="16"
        y="36"
        width="128"
        height="28"
        rx="6"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      {/* Brand logo pill */}
      <rect x="24" y="44" width="16" height="12" rx="3" fill={accent} />

      {/* Active nav item */}
      <rect x="46" y="42" width="30" height="16" rx="4" fill={accentTint} />
      <rect x="52" y="47" width="18" height="5" rx="2.5" fill={accent} />
      <rect x="48" y="62" width="26" height="2" rx="1" fill={accent} />

      {/* Inactive tabs */}
      <rect
        x="82"
        y="47"
        width="22"
        height="5"
        rx="2.5"
        fill={textMuted}
        fillOpacity="0.6"
      />
      <rect
        x="110"
        y="47"
        width="18"
        height="5"
        rx="2.5"
        fill={textMuted}
        fillOpacity="0.4"
      />
    </Frame>
  );
}

export function AppBridgeMenuThumbnail() {
  return (
    <Frame>
      {/* Shopify titlebar */}
      <rect
        x="18"
        y="18"
        width="124"
        height="24"
        rx="6"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      <circle cx="30" cy="30" r="5" fill={mutedBg} />
      <rect
        x="42"
        y="27"
        width="38"
        height="6"
        rx="3"
        fill={textPrimary}
        fillOpacity="0.85"
      />
      <rect x="120" y="24" width="14" height="12" rx="3" fill={mutedBg} />
      <path
        d="M125 29 l2 2 l2 -2"
        fill="none"
        stroke={textMuted}
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Dropdown menu */}
      <rect
        x="72"
        y="46"
        width="66"
        height="40"
        rx="5"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      <rect
        x="78"
        y="53"
        width="44"
        height="5"
        rx="2.5"
        fill={textPrimary}
        fillOpacity="0.8"
      />
      <line x1="74" y1="63" x2="136" y2="63" stroke={cardBorder} strokeWidth="0.8" />
      <rect
        x="78"
        y="69"
        width="34"
        height="5"
        rx="2.5"
        fill={textMuted}
        fillOpacity="0.6"
      />
      <rect
        x="78"
        y="77"
        width="26"
        height="4"
        rx="2"
        fill={critical}
        fillOpacity="0.8"
      />
    </Frame>
  );
}

export function ToastThumbnail() {
  return (
    <Frame>
      <rect x="28" y="52" width="104" height="28" rx="14" fill="#202223" />
      <circle cx="43" cy="66" r="7" fill={success} />
      <path
        d="M40 66 l2 2 l4 -4"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="56"
        y="63"
        width="50"
        height="6"
        rx="3"
        fill="#ffffff"
        fillOpacity="0.95"
      />
      <path
        d="M118 63 l4 5 m0 -5 l-4 5"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.5"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </Frame>
  );
}

export function SaveBarThumbnail() {
  return (
    <Frame>
      <rect x="18" y="44" width="124" height="30" rx="7" fill="#202223" />
      {/* Unsaved indicator */}
      <circle cx="30" cy="59" r="3" fill="#f5bf4f" />
      <rect
        x="38"
        y="56"
        width="36"
        height="6"
        rx="3"
        fill="#ffffff"
        fillOpacity="0.85"
      />

      {/* Discard button */}
      <rect
        x="80"
        y="51"
        width="22"
        height="16"
        rx="4"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.3"
        strokeWidth="1"
      />
      <rect x="84" y="57" width="14" height="4" rx="2" fill="#ffffff" fillOpacity="0.6" />

      {/* Save button */}
      <rect x="106" y="51" width="30" height="16" rx="4" fill={success} />
      <rect x="113" y="57" width="16" height="4" rx="2" fill="#ffffff" />
    </Frame>
  );
}

/* =========================================================================
   FEEDBACK
   ========================================================================= */

export function BadgeThumbnail() {
  return (
    <Frame>
      {/* Success badge */}
      <rect
        x="20"
        y="42"
        width="38"
        height="16"
        rx="8"
        fill={successTint}
        stroke={successBorder}
        strokeWidth="1"
      />
      <circle cx="28" cy="50" r="2.5" fill={success} />
      <rect x="34" y="48" width="16" height="4" rx="2" fill={success} />

      {/* Info / Neutral badge */}
      <rect
        x="62"
        y="42"
        width="38"
        height="16"
        rx="8"
        fill={accentTint}
        stroke={accentBorder}
        strokeWidth="1"
      />
      <circle cx="70" cy="50" r="2.5" fill={accent} />
      <rect x="76" y="48" width="16" height="4" rx="2" fill={accent} />

      {/* Warning badge */}
      <rect
        x="104"
        y="42"
        width="36"
        height="16"
        rx="8"
        fill={warningTint}
        stroke={warningBorder}
        strokeWidth="1"
      />
      <circle cx="112" cy="50" r="2.5" fill={warning} />
      <rect x="118" y="48" width="14" height="4" rx="2" fill={warning} />
    </Frame>
  );
}

export function BannerThumbnail() {
  return (
    <Frame>
      <rect
        x="18"
        y="26"
        width="124"
        height="48"
        rx="8"
        fill={warningTint}
        stroke={warningBorder}
        strokeWidth="1.2"
      />
      {/* Warning icon */}
      <circle cx="34" cy="42" r="8" fill={warning} fillOpacity="0.25" />
      <path
        d="M34 38 v5 m0 2 v1"
        fill="none"
        stroke={warning}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Title, description, action */}
      <rect
        x="48"
        y="36"
        width="60"
        height="6"
        rx="3"
        fill={textPrimary}
        fillOpacity="0.85"
      />
      <rect
        x="48"
        y="47"
        width="76"
        height="5"
        rx="2.5"
        fill={textMuted}
        fillOpacity="0.6"
      />
      <rect x="48" y="57" width="30" height="5" rx="2.5" fill={warning} />

      {/* Dismiss button */}
      <path
        d="M130 33 l4 4 m0 -4 l-4 4"
        fill="none"
        stroke={textMuted}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </Frame>
  );
}

export function IconTileThumbnail() {
  return (
    <Frame>
      {/* Side background tiles */}
      <rect
        x="22"
        y="32"
        width="26"
        height="32"
        rx="6"
        fill={mutedBg}
        stroke={cardBorder}
        strokeWidth="1"
        strokeDasharray="3 3"
        opacity="0.5"
      />
      <rect
        x="112"
        y="32"
        width="26"
        height="32"
        rx="6"
        fill={mutedBg}
        stroke={cardBorder}
        strokeWidth="1"
        strokeDasharray="3 3"
        opacity="0.5"
      />

      {/* Main hero tile */}
      <rect
        x="56"
        y="24"
        width="48"
        height="48"
        rx="10"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      <rect x="62" y="30" width="36" height="36" rx="7" fill={accentTint} />
      <path
        d="M72 48 l5 5 l11 -11"
        fill="none"
        stroke={accent}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Frame>
  );
}

export function ProgressBarThumbnail() {
  return (
    <Frame>
      {/* Label and percentage pill */}
      <rect
        x="24"
        y="30"
        width="38"
        height="5"
        rx="2.5"
        fill={textMuted}
        fillOpacity="0.75"
      />
      <rect x="116" y="27" width="20" height="11" rx="5.5" fill={accentTint} />
      <rect x="120" y="31" width="12" height="4" rx="2" fill={accent} />

      {/* Primary progress track */}
      <rect
        x="24"
        y="45"
        width="112"
        height="8"
        rx="4"
        fill={mutedBg}
        stroke={cardBorder}
        strokeWidth="1"
      />
      <rect x="24" y="45" width="78" height="8" rx="4" fill={accent} />

      {/* Multi-step track below */}
      <rect x="24" y="61" width="34" height="4" rx="2" fill={success} />
      <rect x="63" y="61" width="34" height="4" rx="2" fill={success} />
      <rect x="102" y="61" width="34" height="4" rx="2" fill={mutedBg} />
    </Frame>
  );
}

export function SkeletonThumbnail() {
  return (
    <Frame>
      <rect
        x="22"
        y="20"
        width="116"
        height="60"
        rx="8"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      {/* Skeleton avatar circle */}
      <circle cx="42" cy="42" r="12" fill={mutedBg} />

      {/* Skeleton header lines */}
      <rect x="62" y="34" width="58" height="7" rx="3.5" fill={mutedBg} />
      <rect
        x="62"
        y="46"
        width="42"
        height="5"
        rx="2.5"
        fill={mutedBg}
        fillOpacity="0.7"
      />

      {/* Skeleton body lines */}
      <rect
        x="32"
        y="62"
        width="96"
        height="5"
        rx="2.5"
        fill={mutedBg}
        fillOpacity="0.7"
      />
      <rect
        x="32"
        y="71"
        width="64"
        height="5"
        rx="2.5"
        fill={mutedBg}
        fillOpacity="0.45"
      />
    </Frame>
  );
}

export function SpinnerThumbnail() {
  return (
    <Frame>
      <circle cx="80" cy="50" r="18" fill="none" stroke={mutedBg} strokeWidth="3.5" />
      <path
        d="M80 32 a18 18 0 0 1 18 18"
        fill="none"
        stroke={accent}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="80" cy="50" r="3" fill={accent} fillOpacity="0.25" />
    </Frame>
  );
}

export function TooltipThumbnail() {
  return (
    <Frame>
      {/* Tooltip bubble */}
      <rect x="38" y="20" width="84" height="24" rx="6" fill="#202223" />
      <rect x="48" y="29" width="64" height="6" rx="3" fill="#ffffff" fillOpacity="0.9" />
      <path d="M75 44 l5 6 l5 -6 Z" fill="#202223" />

      {/* Target button below */}
      <rect
        x="52"
        y="56"
        width="56"
        height="24"
        rx="6"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      <rect
        x="66"
        y="65"
        width="28"
        height="6"
        rx="3"
        fill={textPrimary}
        fillOpacity="0.6"
      />
    </Frame>
  );
}

/* =========================================================================
   FORMS
   ========================================================================= */

export function TextFieldThumbnail() {
  return (
    <Frame>
      <rect
        x="28"
        y="26"
        width="36"
        height="6"
        rx="3"
        fill={textPrimary}
        fillOpacity="0.8"
      />
      <rect
        x="28"
        y="38"
        width="104"
        height="28"
        rx="6"
        fill={cardBg}
        stroke={accent}
        strokeWidth="1.5"
      />
      <line x1="38" y1="46" x2="38" y2="58" stroke={accent} strokeWidth="1.5" />
      <rect
        x="44"
        y="49"
        width="48"
        height="6"
        rx="3"
        fill={textMuted}
        fillOpacity="0.4"
      />
    </Frame>
  );
}

export function MoneyFieldThumbnail() {
  return (
    <Frame>
      <rect
        x="28"
        y="26"
        width="32"
        height="6"
        rx="3"
        fill={textPrimary}
        fillOpacity="0.8"
      />
      <rect
        x="28"
        y="38"
        width="104"
        height="28"
        rx="6"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      {/* Prefix currency container */}
      <path
        d="M28 44 a6 6 0 0 1 6 -6 h18 v28 h-18 a6 6 0 0 1 -6 -6 Z"
        fill={mutedBg}
        stroke={cardBorder}
        strokeWidth="1"
      />
      <text
        x="37"
        y="56"
        fill={textPrimary}
        fontSize="12"
        fontFamily="system-ui, sans-serif"
        fontWeight="bold"
      >
        $
      </text>

      {/* Numeric value lines */}
      <rect
        x="58"
        y="49"
        width="38"
        height="6"
        rx="3"
        fill={textPrimary}
        fillOpacity="0.85"
      />
      <rect
        x="100"
        y="49"
        width="14"
        height="6"
        rx="3"
        fill={textMuted}
        fillOpacity="0.5"
      />
    </Frame>
  );
}

export function ColorFieldThumbnail() {
  return (
    <Frame>
      <rect
        x="28"
        y="26"
        width="42"
        height="6"
        rx="3"
        fill={textPrimary}
        fillOpacity="0.8"
      />
      <rect
        x="28"
        y="38"
        width="104"
        height="28"
        rx="6"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      {/* Swatch chip */}
      <circle cx="44" cy="52" r="7" fill={accent} stroke={cardBorder} strokeWidth="1" />
      {/* Hex value */}
      <rect
        x="58"
        y="49"
        width="46"
        height="6"
        rx="3"
        fill={textPrimary}
        fillOpacity="0.8"
      />
    </Frame>
  );
}

export function DropZoneThumbnail() {
  return (
    <Frame>
      <rect
        x="24"
        y="20"
        width="112"
        height="60"
        rx="8"
        fill={mutedBg}
        fillOpacity="0.4"
        stroke={cardBorder}
        strokeWidth="1.4"
        strokeDasharray="5 4"
      />
      <circle cx="80" cy="40" r="10" fill={accentTint} />
      <path
        d="M80 44 v-8 m-3 3 l3 -3 l3 3"
        fill="none"
        stroke={accent}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="52"
        y="56"
        width="56"
        height="6"
        rx="3"
        fill={textPrimary}
        fillOpacity="0.75"
      />
      <rect
        x="62"
        y="66"
        width="36"
        height="4"
        rx="2"
        fill={textMuted}
        fillOpacity="0.5"
      />
    </Frame>
  );
}

export function EmailFieldThumbnail() {
  return (
    <Frame>
      <rect
        x="28"
        y="26"
        width="38"
        height="6"
        rx="3"
        fill={textPrimary}
        fillOpacity="0.8"
      />
      <rect
        x="28"
        y="38"
        width="104"
        height="28"
        rx="6"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      <text
        x="36"
        y="56"
        fill={textMuted}
        fontSize="12"
        fontFamily="system-ui, sans-serif"
        fontWeight="bold"
      >
        @
      </text>
      <rect
        x="54"
        y="49"
        width="48"
        height="6"
        rx="3"
        fill={textPrimary}
        fillOpacity="0.75"
      />
      <rect
        x="106"
        y="49"
        width="18"
        height="6"
        rx="3"
        fill={textMuted}
        fillOpacity="0.4"
      />
    </Frame>
  );
}

export function NumberFieldThumbnail() {
  return (
    <Frame>
      <rect
        x="28"
        y="26"
        width="34"
        height="6"
        rx="3"
        fill={textPrimary}
        fillOpacity="0.8"
      />
      <rect
        x="28"
        y="38"
        width="104"
        height="28"
        rx="6"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      <rect
        x="38"
        y="49"
        width="24"
        height="6"
        rx="3"
        fill={textPrimary}
        fillOpacity="0.85"
      />

      {/* Stepper buttons */}
      <rect
        x="108"
        y="39"
        width="23"
        height="26"
        rx="4"
        fill={mutedBg}
        stroke={cardBorder}
        strokeWidth="1"
      />
      <line x1="108" y1="52" x2="131" y2="52" stroke={cardBorder} strokeWidth="1" />
      <path
        d="M117 46 l2.5 -2.5 l2.5 2.5"
        fill="none"
        stroke={textMuted}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M117 58 l2.5 2.5 l2.5 -2.5"
        fill="none"
        stroke={textMuted}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </Frame>
  );
}

export function PasswordFieldThumbnail() {
  return (
    <Frame>
      <rect
        x="28"
        y="26"
        width="40"
        height="6"
        rx="3"
        fill={textPrimary}
        fillOpacity="0.8"
      />
      <rect
        x="28"
        y="38"
        width="104"
        height="28"
        rx="6"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      {/* Bullet dots */}
      <circle cx="40" cy="52" r="2.5" fill={textPrimary} />
      <circle cx="48" cy="52" r="2.5" fill={textPrimary} />
      <circle cx="56" cy="52" r="2.5" fill={textPrimary} />
      <circle cx="64" cy="52" r="2.5" fill={textPrimary} />
      <circle cx="72" cy="52" r="2.5" fill={textPrimary} />
      <circle cx="80" cy="52" r="2.5" fill={textPrimary} />

      {/* Eye icon */}
      <path
        d="M111 52 c2 -3 5 -4 8 -4 c3 0 6 1 8 4 c-2 3 -5 4 -8 4 c-3 0 -6 -1 -8 -4 Z"
        fill="none"
        stroke={textMuted}
        strokeWidth="1.2"
      />
      <circle cx="119" cy="52" r="1.5" fill={textMuted} />
    </Frame>
  );
}

export function UrlFieldThumbnail() {
  return (
    <Frame>
      <rect
        x="28"
        y="26"
        width="44"
        height="6"
        rx="3"
        fill={textPrimary}
        fillOpacity="0.8"
      />
      <rect
        x="28"
        y="38"
        width="104"
        height="28"
        rx="6"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      {/* Protocol badge */}
      <path
        d="M28 44 a6 6 0 0 1 6 -6 h30 v28 h-30 a6 6 0 0 1 -6 -6 Z"
        fill={mutedBg}
        stroke={cardBorder}
        strokeWidth="1"
      />
      <rect
        x="34"
        y="49"
        width="20"
        height="5"
        rx="2"
        fill={textMuted}
        fillOpacity="0.75"
      />
      <rect
        x="68"
        y="49"
        width="54"
        height="6"
        rx="3"
        fill={textPrimary}
        fillOpacity="0.8"
      />
    </Frame>
  );
}

export function SelectThumbnail() {
  return (
    <Frame>
      <rect
        x="28"
        y="26"
        width="34"
        height="6"
        rx="3"
        fill={textPrimary}
        fillOpacity="0.8"
      />
      <rect
        x="28"
        y="38"
        width="104"
        height="28"
        rx="6"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      <rect
        x="38"
        y="49"
        width="48"
        height="6"
        rx="3"
        fill={textPrimary}
        fillOpacity="0.75"
      />
      <path
        d="M118 50 l3.5 3.5 l3.5 -3.5"
        fill="none"
        stroke={textMuted}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Frame>
  );
}

export function CheckboxThumbnail() {
  return (
    <Frame>
      {/* Checked */}
      <rect x="32" y="32" width="18" height="18" rx="4" fill={accent} />
      <path
        d="M37 41 l3 3 l6 -6"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="58"
        y="38"
        width="64"
        height="6"
        rx="3"
        fill={textPrimary}
        fillOpacity="0.85"
      />

      {/* Unchecked */}
      <rect
        x="32"
        y="56"
        width="18"
        height="18"
        rx="4"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      <rect
        x="58"
        y="62"
        width="50"
        height="6"
        rx="3"
        fill={textMuted}
        fillOpacity="0.5"
      />
    </Frame>
  );
}

export function ChoiceListThumbnail() {
  return (
    <Frame>
      {/* Selected radio */}
      <circle cx="40" cy="40" r="9" fill={cardBg} stroke={accent} strokeWidth="1.5" />
      <circle cx="40" cy="40" r="4.5" fill={accent} />
      <rect
        x="58"
        y="37"
        width="66"
        height="6"
        rx="3"
        fill={textPrimary}
        fillOpacity="0.85"
      />

      {/* Unselected radio */}
      <circle cx="40" cy="62" r="9" fill={cardBg} stroke={cardBorder} strokeWidth="1.2" />
      <rect
        x="58"
        y="59"
        width="48"
        height="6"
        rx="3"
        fill={textMuted}
        fillOpacity="0.5"
      />
    </Frame>
  );
}

export function DateFieldThumbnail() {
  return (
    <Frame>
      <rect
        x="28"
        y="26"
        width="36"
        height="6"
        rx="3"
        fill={textPrimary}
        fillOpacity="0.8"
      />
      <rect
        x="28"
        y="38"
        width="104"
        height="28"
        rx="6"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      <rect
        x="38"
        y="49"
        width="46"
        height="6"
        rx="3"
        fill={textPrimary}
        fillOpacity="0.85"
      />

      {/* Calendar icon */}
      <rect
        x="112"
        y="45"
        width="14"
        height="14"
        rx="3"
        fill="none"
        stroke={textMuted}
        strokeWidth="1.2"
      />
      <line x1="112" y1="49" x2="126" y2="49" stroke={textMuted} strokeWidth="1.2" />
      <circle cx="116" cy="54" r="1" fill={accent} />
      <circle cx="122" cy="54" r="1" fill={textMuted} />
    </Frame>
  );
}

export function DatePickerThumbnail() {
  return (
    <Frame>
      <rect
        x="34"
        y="16"
        width="92"
        height="68"
        rx="7"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      {/* Month nav header */}
      <path
        d="M42 27 l-2.5 2.5 l2.5 2.5"
        fill="none"
        stroke={textMuted}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <rect
        x="54"
        y="27"
        width="52"
        height="5"
        rx="2.5"
        fill={textPrimary}
        fillOpacity="0.8"
      />
      <path
        d="M118 27 l2.5 2.5 l-2.5 2.5"
        fill="none"
        stroke={textMuted}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line x1="38" y1="36" x2="122" y2="36" stroke={cardBorder} strokeWidth="0.8" />

      {/* Days row 1 */}
      <circle cx="44" cy="44" r="2" fill={textMuted} fillOpacity="0.4" />
      <circle cx="56" cy="44" r="2" fill={textMuted} fillOpacity="0.4" />
      <circle cx="68" cy="44" r="2" fill={textMuted} fillOpacity="0.4" />
      <circle cx="80" cy="44" r="2" fill={textMuted} fillOpacity="0.4" />
      <circle cx="92" cy="44" r="2" fill={textMuted} fillOpacity="0.4" />
      <circle cx="104" cy="44" r="2" fill={textMuted} fillOpacity="0.4" />
      <circle cx="116" cy="44" r="2" fill={textMuted} fillOpacity="0.4" />

      {/* Selected range highlight */}
      <rect x="63" y="49" width="34" height="10" rx="5" fill={accentTint} />
      <circle cx="68" cy="54" r="4.5" fill={accent} />
      <circle cx="80" cy="54" r="2" fill={accent} />
      <circle cx="92" cy="54" r="4.5" fill={accent} />

      <circle cx="44" cy="54" r="2" fill={textMuted} fillOpacity="0.4" />
      <circle cx="56" cy="54" r="2" fill={textMuted} fillOpacity="0.4" />
      <circle cx="104" cy="54" r="2" fill={textMuted} fillOpacity="0.4" />
      <circle cx="116" cy="54" r="2" fill={textMuted} fillOpacity="0.4" />

      {/* Days row 3 */}
      <circle cx="44" cy="65" r="2" fill={textMuted} fillOpacity="0.4" />
      <circle cx="56" cy="65" r="2" fill={textMuted} fillOpacity="0.4" />
      <circle cx="68" cy="65" r="2" fill={textMuted} fillOpacity="0.4" />
      <circle cx="80" cy="65" r="2" fill={textMuted} fillOpacity="0.4" />
      <circle cx="92" cy="65" r="2" fill={textMuted} fillOpacity="0.4" />
      <circle cx="104" cy="65" r="2" fill={textMuted} fillOpacity="0.4" />
      <circle cx="116" cy="65" r="2" fill={textMuted} fillOpacity="0.4" />

      {/* Days row 4 */}
      <circle cx="44" cy="74" r="2" fill={textMuted} fillOpacity="0.4" />
      <circle cx="56" cy="74" r="2" fill={textMuted} fillOpacity="0.4" />
      <circle cx="68" cy="74" r="2" fill={textMuted} fillOpacity="0.4" />
    </Frame>
  );
}

/* =========================================================================
   LAYOUT
   ========================================================================= */

export function BoxThumbnail() {
  return (
    <Frame>
      <rect
        x="28"
        y="18"
        width="104"
        height="64"
        rx="6"
        fill={mutedBg}
        fillOpacity="0.4"
        stroke={cardBorder}
        strokeWidth="1.2"
        strokeDasharray="4 3"
      />
      {/* Corner guides */}
      <path
        d="M28 26 h8 v-8 M132 26 h-8 v-8 M28 74 h8 v8 M132 74 h-8 v8"
        fill="none"
        stroke={accent}
        strokeWidth="1"
        opacity="0.6"
      />
      {/* Inner component */}
      <rect
        x="46"
        y="32"
        width="68"
        height="36"
        rx="5"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      <rect x="56" y="43" width="32" height="6" rx="3" fill={accent} fillOpacity="0.7" />
      <rect
        x="56"
        y="53"
        width="48"
        height="4"
        rx="2"
        fill={textMuted}
        fillOpacity="0.4"
      />
    </Frame>
  );
}

export function BlockStackThumbnail() {
  return (
    <Frame>
      <rect
        x="36"
        y="18"
        width="88"
        height="16"
        rx="4"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      <rect
        x="44"
        y="24"
        width="38"
        height="4"
        rx="2"
        fill={textPrimary}
        fillOpacity="0.65"
      />

      <rect
        x="36"
        y="42"
        width="88"
        height="16"
        rx="4"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      <rect
        x="44"
        y="48"
        width="48"
        height="4"
        rx="2"
        fill={textPrimary}
        fillOpacity="0.65"
      />

      <rect
        x="36"
        y="66"
        width="88"
        height="16"
        rx="4"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      <rect
        x="44"
        y="72"
        width="32"
        height="4"
        rx="2"
        fill={textPrimary}
        fillOpacity="0.65"
      />

      {/* Alignment markers */}
      <line
        x1="26"
        y1="34"
        x2="26"
        y2="42"
        stroke={accent}
        strokeWidth="1.2"
        strokeDasharray="2 1"
      />
      <line
        x1="26"
        y1="58"
        x2="26"
        y2="66"
        stroke={accent}
        strokeWidth="1.2"
        strokeDasharray="2 1"
      />
    </Frame>
  );
}

export function InlineStackThumbnail() {
  return (
    <Frame>
      <rect
        x="20"
        y="30"
        width="36"
        height="40"
        rx="6"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      <rect
        x="26"
        y="38"
        width="24"
        height="5"
        rx="2.5"
        fill={accent}
        fillOpacity="0.7"
      />
      <rect
        x="26"
        y="48"
        width="18"
        height="4"
        rx="2"
        fill={textMuted}
        fillOpacity="0.4"
      />

      <rect
        x="62"
        y="30"
        width="36"
        height="40"
        rx="6"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      <rect
        x="68"
        y="38"
        width="24"
        height="5"
        rx="2.5"
        fill={accent}
        fillOpacity="0.7"
      />
      <rect
        x="68"
        y="48"
        width="18"
        height="4"
        rx="2"
        fill={textMuted}
        fillOpacity="0.4"
      />

      <rect
        x="104"
        y="30"
        width="36"
        height="40"
        rx="6"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      <rect
        x="110"
        y="38"
        width="24"
        height="5"
        rx="2.5"
        fill={accent}
        fillOpacity="0.7"
      />
      <rect
        x="110"
        y="48"
        width="18"
        height="4"
        rx="2"
        fill={textMuted}
        fillOpacity="0.4"
      />
    </Frame>
  );
}

export function CardThumbnail() {
  return (
    <Frame>
      <rect
        x="24"
        y="18"
        width="112"
        height="64"
        rx="8"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      {/* Card Header */}
      <rect
        x="34"
        y="27"
        width="40"
        height="6"
        rx="3"
        fill={textPrimary}
        fillOpacity="0.85"
      />
      <rect
        x="104"
        y="25"
        width="22"
        height="10"
        rx="3"
        fill={mutedBg}
        stroke={cardBorder}
        strokeWidth="0.8"
      />
      <line x1="24" y1="41" x2="136" y2="41" stroke={cardBorder} strokeWidth="1" />

      {/* Card content rows */}
      <rect
        x="34"
        y="49"
        width="76"
        height="5"
        rx="2.5"
        fill={textMuted}
        fillOpacity="0.5"
      />
      <rect
        x="34"
        y="58"
        width="60"
        height="5"
        rx="2.5"
        fill={textMuted}
        fillOpacity="0.35"
      />
      <rect
        x="34"
        y="68"
        width="44"
        height="5"
        rx="2.5"
        fill={textMuted}
        fillOpacity="0.25"
      />
    </Frame>
  );
}

export function MetricCardThumbnail() {
  return (
    <Frame>
      <rect
        x="22"
        y="16"
        width="116"
        height="68"
        rx="8"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      {/* Title */}
      <rect
        x="32"
        y="25"
        width="42"
        height="5"
        rx="2.5"
        fill={textMuted}
        fillOpacity="0.75"
      />

      {/* Bold KPI value */}
      <rect
        x="32"
        y="35"
        width="46"
        height="10"
        rx="3"
        fill={textPrimary}
        fillOpacity="0.9"
      />

      {/* Positive trend badge */}
      <rect x="88" y="34" width="28" height="12" rx="6" fill={successTint} />
      <path
        d="M93 41 l2 -2 l2 2"
        fill="none"
        stroke={success}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="99" y="39" width="12" height="4" rx="2" fill={success} />

      {/* Sparkline curve */}
      <path
        d="M32 68 C 48 68, 58 55, 74 60 C 88 64, 102 48, 124 50"
        fill="none"
        stroke={accent}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="124" cy="50" r="3" fill={accent} />
    </Frame>
  );
}

export function PageThumbnail() {
  return (
    <Frame>
      <rect
        x="18"
        y="14"
        width="124"
        height="72"
        rx="6"
        fill={mutedBg}
        fillOpacity="0.3"
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      {/* Breadcrumb & Header */}
      <rect
        x="26"
        y="21"
        width="24"
        height="3"
        rx="1.5"
        fill={textMuted}
        fillOpacity="0.5"
      />
      <rect
        x="26"
        y="28"
        width="44"
        height="7"
        rx="3"
        fill={textPrimary}
        fillOpacity="0.85"
      />
      <rect x="110" y="26" width="22" height="11" rx="3" fill={accent} />

      {/* Card area */}
      <rect
        x="26"
        y="42"
        width="106"
        height="36"
        rx="5"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1"
      />
      <rect
        x="32"
        y="49"
        width="42"
        height="5"
        rx="2.5"
        fill={textPrimary}
        fillOpacity="0.75"
      />
      <rect
        x="32"
        y="59"
        width="70"
        height="4"
        rx="2"
        fill={textMuted}
        fillOpacity="0.4"
      />
      <rect
        x="32"
        y="67"
        width="54"
        height="4"
        rx="2"
        fill={textMuted}
        fillOpacity="0.3"
      />
    </Frame>
  );
}

export function DividerThumbnail() {
  return (
    <Frame>
      <rect
        x="28"
        y="22"
        width="48"
        height="6"
        rx="3"
        fill={textPrimary}
        fillOpacity="0.7"
      />
      <rect
        x="28"
        y="32"
        width="80"
        height="5"
        rx="2.5"
        fill={textMuted}
        fillOpacity="0.4"
      />

      <line x1="20" y1="48" x2="140" y2="48" stroke={cardBorder} strokeWidth="1.5" />

      <rect
        x="28"
        y="60"
        width="56"
        height="6"
        rx="3"
        fill={textPrimary}
        fillOpacity="0.7"
      />
      <rect
        x="28"
        y="70"
        width="72"
        height="5"
        rx="2.5"
        fill={textMuted}
        fillOpacity="0.4"
      />
    </Frame>
  );
}

export function TableThumbnail() {
  return (
    <Frame>
      <rect
        x="18"
        y="18"
        width="124"
        height="64"
        rx="7"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      {/* Header row */}
      <path d="M18 25 a7 7 0 0 1 7 -7 h110 a7 7 0 0 1 7 7 v10 h-124 Z" fill={mutedBg} />
      <line x1="18" y1="35" x2="142" y2="35" stroke={cardBorder} strokeWidth="1" />
      <rect
        x="26"
        y="24"
        width="24"
        height="5"
        rx="2.5"
        fill={textPrimary}
        fillOpacity="0.7"
      />
      <rect
        x="68"
        y="24"
        width="20"
        height="5"
        rx="2.5"
        fill={textPrimary}
        fillOpacity="0.7"
      />
      <rect
        x="110"
        y="24"
        width="18"
        height="5"
        rx="2.5"
        fill={textPrimary}
        fillOpacity="0.7"
      />

      {/* Data row 1 */}
      <rect
        x="26"
        y="41"
        width="30"
        height="5"
        rx="2.5"
        fill={textMuted}
        fillOpacity="0.7"
      />
      <rect x="68" y="39" width="24" height="9" rx="4.5" fill={successTint} />
      <rect
        x="110"
        y="41"
        width="16"
        height="5"
        rx="2.5"
        fill={textPrimary}
        fillOpacity="0.8"
      />
      <line x1="18" y1="51" x2="142" y2="51" stroke={cardBorder} strokeWidth="0.8" />

      {/* Data row 2 */}
      <rect
        x="26"
        y="57"
        width="26"
        height="5"
        rx="2.5"
        fill={textMuted}
        fillOpacity="0.7"
      />
      <rect x="68" y="55" width="24" height="9" rx="4.5" fill={accentTint} />
      <rect
        x="110"
        y="57"
        width="14"
        height="5"
        rx="2.5"
        fill={textPrimary}
        fillOpacity="0.8"
      />
      <line x1="18" y1="67" x2="142" y2="67" stroke={cardBorder} strokeWidth="0.8" />

      {/* Data row 3 */}
      <rect
        x="26"
        y="72"
        width="22"
        height="4"
        rx="2"
        fill={textMuted}
        fillOpacity="0.5"
      />
      <rect x="68" y="70" width="20" height="7" rx="3.5" fill={mutedBg} />
      <rect
        x="110"
        y="72"
        width="12"
        height="4"
        rx="2"
        fill={textPrimary}
        fillOpacity="0.6"
      />
    </Frame>
  );
}

export function CollapsibleThumbnail() {
  return (
    <Frame>
      <rect
        x="22"
        y="22"
        width="116"
        height="56"
        rx="8"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      {/* Header bar */}
      <rect
        x="32"
        y="31"
        width="46"
        height="6"
        rx="3"
        fill={textPrimary}
        fillOpacity="0.85"
      />
      <path
        d="M122 32 l3 3 l3 -3"
        fill="none"
        stroke={textMuted}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="22" y1="43" x2="138" y2="43" stroke={cardBorder} strokeWidth="1" />

      {/* Expanded content */}
      <rect
        x="32"
        y="51"
        width="88"
        height="5"
        rx="2.5"
        fill={textMuted}
        fillOpacity="0.5"
      />
      <rect
        x="32"
        y="61"
        width="64"
        height="5"
        rx="2.5"
        fill={textMuted}
        fillOpacity="0.35"
      />
    </Frame>
  );
}

/* =========================================================================
   MEDIA
   ========================================================================= */

export function IconThumbnail() {
  return (
    <Frame>
      {/* Side icons */}
      <rect
        x="22"
        y="30"
        width="30"
        height="32"
        rx="8"
        fill={mutedBg}
        stroke={cardBorder}
        strokeWidth="1"
        opacity="0.6"
      />
      <path
        d="M32 46 l3 3 l6 -6"
        fill="none"
        stroke={success}
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.8"
      />

      <rect
        x="108"
        y="30"
        width="30"
        height="32"
        rx="8"
        fill={mutedBg}
        stroke={cardBorder}
        strokeWidth="1"
        opacity="0.6"
      />
      <circle
        cx="123"
        cy="46"
        r="5"
        fill="none"
        stroke={textMuted}
        strokeWidth="1.8"
        opacity="0.8"
      />

      {/* Main center star icon */}
      <rect
        x="58"
        y="24"
        width="44"
        height="44"
        rx="10"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      <path
        d="M80 33 l2.6 5.3 l5.8 0.8 l-4.2 4.1 l1 5.8 l-5.2 -2.7 l-5.2 2.7 l1 -5.8 l-4.2 -4.1 l5.8 -0.8 Z"
        fill={accent}
        stroke={accent}
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </Frame>
  );
}

export function AvatarThumbnail() {
  return (
    <Frame>
      {/* Secondary avatars */}
      <circle
        cx="44"
        cy="50"
        r="14"
        fill={mutedBg}
        stroke={cardBorder}
        strokeWidth="1"
        opacity="0.7"
      />
      <circle
        cx="116"
        cy="50"
        r="14"
        fill={mutedBg}
        stroke={cardBorder}
        strokeWidth="1"
        opacity="0.7"
      />

      {/* Main user avatar */}
      <circle
        cx="80"
        cy="48"
        r="22"
        fill={accentTint}
        stroke={accentBorder}
        strokeWidth="1.5"
      />
      <circle cx="80" cy="40" r="7" fill={accent} />
      <path d="M66 61 a14 14 0 0 1 28 0" fill={accent} />

      {/* Active online indicator */}
      <circle cx="96" cy="62" r="5" fill={cardBg} />
      <circle cx="96" cy="62" r="3.5" fill={success} />
    </Frame>
  );
}

export function ThumbnailThumbnail() {
  return (
    <Frame>
      <rect
        x="46"
        y="20"
        width="68"
        height="52"
        rx="8"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      {/* Decorative landscape graphic */}
      <circle cx="62" cy="35" r="5" fill="#f5bf4f" />
      <path
        d="M50 64 l16 -16 l14 12 l12 -14 l18 18 Z"
        fill={mutedBg}
        stroke={cardBorder}
        strokeWidth="1"
      />

      {/* Format pill */}
      <rect x="88" y="58" width="20" height="9" rx="3" fill="#202223" fillOpacity="0.8" />
      <text
        x="92"
        y="65"
        fill="#ffffff"
        fontSize="6"
        fontFamily="system-ui, sans-serif"
        fontWeight="bold"
      >
        JPG
      </text>
    </Frame>
  );
}

/* =========================================================================
   NAVIGATION
   ========================================================================= */

export function TabsThumbnail() {
  return (
    <Frame>
      {/* Active tab */}
      <rect x="22" y="22" width="34" height="12" rx="4" fill={accentTint} />
      <rect x="28" y="26" width="22" height="4" rx="2" fill={accent} />
      <rect
        x="62"
        y="26"
        width="26"
        height="4"
        rx="2"
        fill={textMuted}
        fillOpacity="0.6"
      />
      <rect
        x="94"
        y="26"
        width="24"
        height="4"
        rx="2"
        fill={textMuted}
        fillOpacity="0.4"
      />

      {/* Bottom border & active line */}
      <line x1="20" y1="38" x2="140" y2="38" stroke={cardBorder} strokeWidth="1" />
      <rect x="24" y="37" width="30" height="2" rx="1" fill={accent} />

      {/* Tab content panel */}
      <rect
        x="22"
        y="44"
        width="116"
        height="38"
        rx="6"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1"
      />
      <rect
        x="30"
        y="52"
        width="54"
        height="5"
        rx="2.5"
        fill={textPrimary}
        fillOpacity="0.75"
      />
      <rect
        x="30"
        y="62"
        width="80"
        height="4"
        rx="2"
        fill={textMuted}
        fillOpacity="0.4"
      />
      <rect
        x="30"
        y="70"
        width="60"
        height="4"
        rx="2"
        fill={textMuted}
        fillOpacity="0.3"
      />
    </Frame>
  );
}

export function NavigationThumbnail() {
  return (
    <Frame>
      <rect
        x="32"
        y="16"
        width="96"
        height="68"
        rx="7"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      {/* Store header */}
      <circle cx="44" cy="27" r="4" fill={accent} />
      <rect
        x="52"
        y="25"
        width="40"
        height="5"
        rx="2.5"
        fill={textPrimary}
        fillOpacity="0.85"
      />
      <line x1="32" y1="36" x2="128" y2="36" stroke={cardBorder} strokeWidth="0.8" />

      {/* Active nav item */}
      <rect x="36" y="40" width="88" height="13" rx="4" fill={accentTint} />
      <circle cx="44" cy="46.5" r="2.5" fill={accent} />
      <rect x="52" y="44.5" width="42" height="4" rx="2" fill={accent} />

      {/* Secondary item with counter badge */}
      <circle cx="44" cy="58.5" r="2.5" fill={textMuted} fillOpacity="0.6" />
      <rect
        x="52"
        y="56.5"
        width="36"
        height="4"
        rx="2"
        fill={textPrimary}
        fillOpacity="0.7"
      />
      <rect x="108" y="54" width="12" height="9" rx="4.5" fill={mutedBg} />

      {/* Inactive item */}
      <circle cx="44" cy="70.5" r="2.5" fill={textMuted} fillOpacity="0.6" />
      <rect
        x="52"
        y="68.5"
        width="30"
        height="4"
        rx="2"
        fill={textMuted}
        fillOpacity="0.5"
      />
    </Frame>
  );
}

/* =========================================================================
   OVERLAYS
   ========================================================================= */

export function FloatingThumbnail() {
  return (
    <Frame>
      {/* Trigger button */}
      <rect
        x="56"
        y="62"
        width="48"
        height="22"
        rx="5"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      <rect
        x="66"
        y="70"
        width="28"
        height="5"
        rx="2.5"
        fill={textPrimary}
        fillOpacity="0.7"
      />

      {/* Floating panel */}
      <rect
        x="36"
        y="18"
        width="88"
        height="38"
        rx="6"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      <path d="M75 56 l5 6 l5 -6 Z" fill={cardBg} stroke={cardBorder} strokeWidth="1.2" />
      <rect
        x="44"
        y="26"
        width="46"
        height="5"
        rx="2.5"
        fill={textPrimary}
        fillOpacity="0.85"
      />
      <rect
        x="44"
        y="36"
        width="68"
        height="4"
        rx="2"
        fill={textMuted}
        fillOpacity="0.4"
      />
      <rect x="44" y="44" width="38" height="4" rx="2" fill={accent} />
    </Frame>
  );
}

export function ModalThumbnail() {
  return (
    <Frame>
      {/* Blurred Backdrop */}
      <rect
        x="16"
        y="12"
        width="128"
        height="76"
        rx="6"
        fill="#000000"
        fillOpacity="0.25"
      />

      {/* Centered Modal */}
      <rect
        x="32"
        y="22"
        width="96"
        height="56"
        rx="8"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      {/* Modal header */}
      <rect
        x="42"
        y="31"
        width="44"
        height="6"
        rx="3"
        fill={textPrimary}
        fillOpacity="0.85"
      />
      <path
        d="M116 30 l4 4 m0 -4 l-4 4"
        fill="none"
        stroke={textMuted}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line x1="32" y1="41" x2="128" y2="41" stroke={cardBorder} strokeWidth="0.8" />

      {/* Modal body */}
      <rect
        x="42"
        y="48"
        width="76"
        height="4"
        rx="2"
        fill={textMuted}
        fillOpacity="0.4"
      />
      <rect
        x="42"
        y="55"
        width="56"
        height="4"
        rx="2"
        fill={textMuted}
        fillOpacity="0.3"
      />

      {/* Action buttons */}
      <rect
        x="76"
        y="64"
        width="22"
        height="9"
        rx="3"
        fill={mutedBg}
        stroke={cardBorder}
        strokeWidth="0.8"
      />
      <rect x="102" y="64" width="20" height="9" rx="3" fill={accent} />
    </Frame>
  );
}

/* =========================================================================
   TYPOGRAPHY
   ========================================================================= */

export function TextThumbnail() {
  return (
    <Frame>
      <rect
        x="28"
        y="22"
        width="76"
        height="10"
        rx="3"
        fill={textPrimary}
        fillOpacity="0.95"
      />
      <rect
        x="28"
        y="38"
        width="54"
        height="7"
        rx="2.5"
        fill={textPrimary}
        fillOpacity="0.75"
      />
      <rect
        x="28"
        y="52"
        width="104"
        height="5"
        rx="2.5"
        fill={textMuted}
        fillOpacity="0.6"
      />
      <rect
        x="28"
        y="61"
        width="92"
        height="5"
        rx="2.5"
        fill={textMuted}
        fillOpacity="0.6"
      />
      <rect
        x="28"
        y="73"
        width="60"
        height="4"
        rx="2"
        fill={textMuted}
        fillOpacity="0.4"
      />
    </Frame>
  );
}

/* =========================================================================
   BLOCKS OVERVIEW MEDIA
   ========================================================================= */

export function MetricsDashboardThumbnail() {
  return (
    <Frame>
      {/* Top filter bar */}
      <rect
        x="18"
        y="14"
        width="124"
        height="14"
        rx="4"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1"
      />
      <circle cx="26" cy="21" r="2.5" fill={accent} />
      <rect
        x="32"
        y="19"
        width="34"
        height="4"
        rx="2"
        fill={textPrimary}
        fillOpacity="0.7"
      />
      <rect x="96" y="17" width="40" height="8" rx="3" fill={mutedBg} />

      {/* 3 Metric Cards */}
      {/* Card 1 */}
      <rect
        x="18"
        y="32"
        width="38"
        height="34"
        rx="5"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1"
      />
      <rect
        x="22"
        y="37"
        width="18"
        height="3"
        rx="1.5"
        fill={textMuted}
        fillOpacity="0.7"
      />
      <rect
        x="22"
        y="43"
        width="22"
        height="6"
        rx="2"
        fill={textPrimary}
        fillOpacity="0.9"
      />
      <path
        d="M22 58 C 28 58, 32 52, 40 50 C 46 48, 50 54, 54 48"
        fill="none"
        stroke={accent}
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Card 2 */}
      <rect
        x="61"
        y="32"
        width="38"
        height="34"
        rx="5"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1"
      />
      <rect
        x="65"
        y="37"
        width="16"
        height="3"
        rx="1.5"
        fill={textMuted}
        fillOpacity="0.7"
      />
      <rect
        x="65"
        y="43"
        width="20"
        height="6"
        rx="2"
        fill={textPrimary}
        fillOpacity="0.9"
      />
      <path
        d="M65 56 C 72 56, 78 50, 84 52 C 89 54, 93 47, 97 45"
        fill="none"
        stroke={success}
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Card 3 */}
      <rect
        x="104"
        y="32"
        width="38"
        height="34"
        rx="5"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1"
      />
      <rect
        x="108"
        y="37"
        width="18"
        height="3"
        rx="1.5"
        fill={textMuted}
        fillOpacity="0.7"
      />
      <rect
        x="108"
        y="43"
        width="18"
        height="6"
        rx="2"
        fill={textPrimary}
        fillOpacity="0.9"
      />
      <path
        d="M108 52 C 114 52, 120 56, 126 54 C 132 52, 136 57, 140 56"
        fill="none"
        stroke={warning}
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Lower comparison trend chart */}
      <rect
        x="18"
        y="70"
        width="124"
        height="18"
        rx="4"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1"
      />
      <path
        d="M24 82 C 45 76, 65 84, 85 75 C 105 68, 125 78, 136 74"
        fill="none"
        stroke={accent}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M24 85 C 45 82, 65 86, 85 80 C 105 76, 125 82, 136 79"
        fill="none"
        stroke={textMuted}
        strokeWidth="1"
        strokeDasharray="2 2"
        strokeOpacity="0.6"
        strokeLinecap="round"
      />
    </Frame>
  );
}

export function OnboardingThumbnail() {
  return (
    <Frame>
      {/* Header bar with progress stepper */}
      <rect
        x="20"
        y="16"
        width="120"
        height="18"
        rx="5"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1"
      />
      <circle cx="28" cy="25" r="3" fill={success} />
      <rect
        x="36"
        y="23"
        width="34"
        height="4"
        rx="2"
        fill={textPrimary}
        fillOpacity="0.8"
      />
      <rect x="86" y="23" width="46" height="4" rx="2" fill={mutedBg} />
      <rect x="86" y="23" width="28" height="4" rx="2" fill={accent} />

      {/* Main checklist card */}
      <rect
        x="20"
        y="38"
        width="120"
        height="48"
        rx="6"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />

      {/* Step 1: Completed */}
      <circle cx="32" cy="48" r="4.5" fill={successTint} />
      <path
        d="M30 48 l1.5 1.5 l3 -3"
        fill="none"
        stroke={success}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="42"
        y="46"
        width="46"
        height="4"
        rx="2"
        fill={textMuted}
        fillOpacity="0.6"
      />

      {/* Step 2: Active with action button */}
      <rect x="24" y="56" width="112" height="16" rx="4" fill={accentTint} />
      <circle cx="32" cy="64" r="4.5" fill={accent} />
      <rect
        x="42"
        y="62"
        width="42"
        height="4"
        rx="2"
        fill={textPrimary}
        fillOpacity="0.9"
      />
      <rect x="104" y="59" width="26" height="10" rx="3" fill={accent} />
      <rect x="109" y="63" width="16" height="3" rx="1.5" fill="#ffffff" />

      {/* Step 3: Pending */}
      <circle cx="32" cy="78" r="4" fill={cardBg} stroke={cardBorder} strokeWidth="1" />
      <rect
        x="42"
        y="76"
        width="50"
        height="4"
        rx="2"
        fill={textMuted}
        fillOpacity="0.4"
      />
    </Frame>
  );
}

export function SettingsLayoutThumbnail() {
  return (
    <Frame>
      {/* Left annotated column */}
      <rect
        x="18"
        y="20"
        width="36"
        height="6"
        rx="3"
        fill={textPrimary}
        fillOpacity="0.85"
      />
      <rect
        x="18"
        y="30"
        width="38"
        height="4"
        rx="2"
        fill={textMuted}
        fillOpacity="0.6"
      />
      <rect
        x="18"
        y="37"
        width="30"
        height="4"
        rx="2"
        fill={textMuted}
        fillOpacity="0.4"
      />

      {/* Right settings card */}
      <rect
        x="62"
        y="16"
        width="80"
        height="52"
        rx="6"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1.2"
      />
      {/* Form field */}
      <rect
        x="70"
        y="23"
        width="28"
        height="4"
        rx="2"
        fill={textPrimary}
        fillOpacity="0.7"
      />
      <rect
        x="70"
        y="30"
        width="64"
        height="12"
        rx="3"
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth="1"
      />
      <rect
        x="75"
        y="34"
        width="24"
        height="4"
        rx="2"
        fill={textMuted}
        fillOpacity="0.4"
      />

      {/* Toggle switch row */}
      <rect
        x="70"
        y="50"
        width="38"
        height="4"
        rx="2"
        fill={textPrimary}
        fillOpacity="0.7"
      />
      <rect x="118" y="47.5" width="16" height="9" rx="4.5" fill={accent} />
      <circle cx="129" cy="52" r="3" fill="#ffffff" />

      {/* Bottom Save Bar */}
      <rect x="18" y="74" width="124" height="14" rx="4" fill="#202223" />
      <circle cx="26" cy="81" r="2" fill="#f5bf4f" />
      <rect x="32" y="79" width="34" height="4" rx="2" fill="#ffffff" fillOpacity="0.8" />
      <rect x="114" y="77" width="22" height="8" rx="2.5" fill={success} />
      <rect x="119" y="80" width="12" height="2.5" rx="1.2" fill="#ffffff" />
    </Frame>
  );
}

/* =========================================================================
   EXPORT DICTIONARY
   ========================================================================= */

export const thumbnails: Record<string, React.ComponentType> = {
  // Actions
  button: ButtonThumbnail,
  "button-group": ButtonGroupThumbnail,
  clickable: ClickableThumbnail,
  link: LinkThumbnail,
  menu: MenuThumbnail,

  // App Bridge
  "app-window": AppWindowThumbnail,
  "app-nav": AppNavThumbnail,
  "app-bridge-menu": AppBridgeMenuThumbnail,
  toast: ToastThumbnail,
  "save-bar": SaveBarThumbnail,

  // Feedback
  badge: BadgeThumbnail,
  banner: BannerThumbnail,
  "icon-tile": IconTileThumbnail,
  "progress-bar": ProgressBarThumbnail,
  skeleton: SkeletonThumbnail,
  spinner: SpinnerThumbnail,
  tooltip: TooltipThumbnail,

  // Forms
  "text-field": TextFieldThumbnail,
  "money-field": MoneyFieldThumbnail,
  "color-field": ColorFieldThumbnail,
  "drop-zone": DropZoneThumbnail,
  "email-field": EmailFieldThumbnail,
  "number-field": NumberFieldThumbnail,
  "password-field": PasswordFieldThumbnail,
  "url-field": UrlFieldThumbnail,
  select: SelectThumbnail,
  checkbox: CheckboxThumbnail,
  "choice-list": ChoiceListThumbnail,
  "date-field": DateFieldThumbnail,
  "date-picker": DatePickerThumbnail,

  // Layout
  box: BoxThumbnail,
  "block-stack": BlockStackThumbnail,
  "inline-stack": InlineStackThumbnail,
  card: CardThumbnail,
  "metric-card": MetricCardThumbnail,
  page: PageThumbnail,
  divider: DividerThumbnail,
  table: TableThumbnail,
  collapsible: CollapsibleThumbnail,

  // Media
  icon: IconThumbnail,
  avatar: AvatarThumbnail,
  thumbnail: ThumbnailThumbnail,

  // Navigation
  tabs: TabsThumbnail,
  navigation: NavigationThumbnail,

  // Overlays
  floating: FloatingThumbnail,
  modal: ModalThumbnail,

  // Typography
  text: TextThumbnail,

  // Blocks
  "metrics-dashboard": MetricsDashboardThumbnail,
  onboarding: OnboardingThumbnail,
  "settings-layout": SettingsLayoutThumbnail,
};
