import type { ColorKeywordType, SizeKeywordType } from "../types/common";

/** Translates legacy Polaris spacing tokens to Polaris web-component tokens. */
export const legacySpacingMap: Record<string, SizeKeywordType | "none"> = {
  "0": "none",
  "025": "small-500",
  "050": "small-400",
  "100": "small-300",
  "150": "small-200",
  "200": "small-200",
  "300": "small-100",
  "400": "base",
  "500": "large",
  "600": "large-100",
  "800": "large-200",
  "1000": "large-300",
  "1200": "large-400",
  "1600": "large-500",
  "2000": "large-500",
  "2400": "large-500",
  "3200": "large-500",
};

/**
 * Maps single or multi-value legacy spacing tokens (e.g. "200", "200 400", numbers)
 * to modern Polaris web-component tokens ("small-200", "small-200 base").
 */
export function mapLegacySpacing(spacing: unknown): string | undefined {
  if (spacing === undefined || spacing === null) {
    return undefined;
  }

  if (typeof spacing === "number") {
    const key = String(spacing);
    return legacySpacingMap[key] ?? key;
  }

  if (typeof spacing === "object") {
    // If a responsive object is passed (e.g. { xs: "200", md: "400" }), extract primary value
    const values = Object.values(spacing as Record<string, unknown>);
    if (values.length > 0) {
      return mapLegacySpacing(values[0]);
    }
    return undefined;
  }

  if (typeof spacing !== "string") {
    return undefined;
  }

  const trimmed = spacing.trim();
  if (!trimmed) {
    return trimmed;
  }

  // Preserve responsive query strings such as "@container ..."
  if (trimmed.startsWith("@")) {
    return trimmed;
  }

  return trimmed
    .split(/\s+/)
    .map((token) => legacySpacingMap[token] ?? token)
    .join(" ");
}

/** Backward-compatible alias for mapLegacySpacing */
export const mapLegacyGap = mapLegacySpacing;

/** Maps legacy Polaris background tokens to Polaris web-component background keywords. */
const legacyBackgroundMap: Record<string, ColorKeywordType | "transparent"> = {
  bg: "base",
  "bg-surface": "base",
  "bg-surface-secondary": "subdued",
  "bg-subdued": "subdued",
  "bg-surface-tertiary": "subdued",
  "bg-surface-brand": "strong",
  "bg-surface-strong": "strong",
  "bg-fill-transparent": "transparent",
};

export function mapLegacyBackground(bg: string | undefined): string | undefined {
  if (!bg) return bg;
  return legacyBackgroundMap[bg] ?? bg;
}

/** Maps legacy Polaris border color tokens to Polaris web-component color keywords. */
const legacyBorderColorMap: Record<string, ColorKeywordType> = {
  border: "base",
  "border-subdued": "subdued",
  "border-hover": "strong",
};

export function mapLegacyBorderColor(color: string | undefined): string | undefined {
  if (!color) return color;
  return legacyBorderColorMap[color] ?? color;
}

/** Maps legacy Polaris border radius tokens to modern keywords. */
const legacyBorderRadiusMap: Record<string, string> = {
  "050": "small-100",
  "100": "small",
  "200": "base",
  "300": "large",
  "400": "large-100",
  "500": "large-100",
  full: "max",
};

export function mapLegacyBorderRadius(radius: string | undefined): string | undefined {
  if (!radius) return radius;
  return radius
    .split(/\s+/)
    .map((token) => legacyBorderRadiusMap[token] ?? token)
    .join(" ");
}

/** Maps legacy Polaris border width tokens to modern keywords. */
const legacyBorderWidthMap: Record<string, string> = {
  "0165": "small-100",
  "025": "small-100",
  "050": "small",
  "100": "base",
  "200": "large",
  "400": "large-100",
};

export function mapLegacyBorderWidth(width: string | undefined): string | undefined {
  if (!width) return width;
  return width
    .split(/\s+/)
    .map((token) => legacyBorderWidthMap[token] ?? token)
    .join(" ");
}
