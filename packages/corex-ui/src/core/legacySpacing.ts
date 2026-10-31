import type { ColorKeywordType, SizeKeywordType } from "../types/common";
import { devWarning } from "../utils/devWarning";

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

const ACCEPTED_BACKGROUNDS = ["transparent", "base", "subdued", "strong"] as const;
const ACCEPTED_BORDER_COLORS = ["base", "subdued", "strong"] as const;

function warnUnmappedLegacy(kind: string, token: string, accepted: readonly string[]): void {
  devWarning(
    "legacySpacing",
    `Unmapped legacy ${kind} token "${token}". Accepted values: ${accepted.join(", ")}.`,
  );
}

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
    const mapped = legacySpacingMap[key];
    if (mapped) return mapped;
    warnUnmappedLegacy("spacing", key, Object.values(legacySpacingMap));
    return key;
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
    .map((token) => {
      const mapped = legacySpacingMap[token];
      if (mapped) return mapped;
      // Modern size keywords and "none" pass through quietly.
      if (
        token === "none" ||
        token === "base" ||
        token === "small" ||
        token === "large" ||
        /^(small|large)-\d+$/.test(token)
      ) {
        return token;
      }
      warnUnmappedLegacy("spacing", token, Object.values(legacySpacingMap));
      return token;
    })
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
  // No critical surface in s-box; strongest available tint for attention callouts.
  "bg-surface-critical": "strong",
  "bg-fill-critical": "strong",
  "bg-fill-transparent": "transparent",
};

export function mapLegacyBackground(bg: string | undefined): string | undefined {
  if (!bg) return bg;
  const mapped = legacyBackgroundMap[bg];
  if (mapped) return mapped;
  if ((ACCEPTED_BACKGROUNDS as readonly string[]).includes(bg)) return bg;
  warnUnmappedLegacy("background", bg, ACCEPTED_BACKGROUNDS);
  return bg;
}

/** Maps legacy Polaris border color tokens to Polaris web-component color keywords. */
const legacyBorderColorMap: Record<string, ColorKeywordType> = {
  border: "base",
  "border-subdued": "subdued",
  "border-hover": "strong",
  "border-critical": "strong",
};

export function mapLegacyBorderColor(color: string | undefined): string | undefined {
  if (!color) return color;
  const mapped = legacyBorderColorMap[color];
  if (mapped) return mapped;
  if ((ACCEPTED_BORDER_COLORS as readonly string[]).includes(color)) return color;
  warnUnmappedLegacy("border color", color, ACCEPTED_BORDER_COLORS);
  return color;
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

const ACCEPTED_BORDER_RADII = [
  "none",
  "small-200",
  "small-100",
  "small",
  "base",
  "large",
  "large-100",
  "large-200",
  "max",
] as const;

export function mapLegacyBorderRadius(radius: string | undefined): string | undefined {
  if (!radius) return radius;
  return radius
    .split(/\s+/)
    .map((token) => {
      const mapped = legacyBorderRadiusMap[token];
      if (mapped) return mapped;
      if ((ACCEPTED_BORDER_RADII as readonly string[]).includes(token)) return token;
      warnUnmappedLegacy("border radius", token, ACCEPTED_BORDER_RADII);
      return token;
    })
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

const ACCEPTED_BORDER_WIDTHS = [
  "none",
  "small-100",
  "small",
  "base",
  "large",
  "large-100",
] as const;

export function mapLegacyBorderWidth(width: string | undefined): string | undefined {
  if (!width) return width;
  return width
    .split(/\s+/)
    .map((token) => {
      const mapped = legacyBorderWidthMap[token];
      if (mapped) return mapped;
      if ((ACCEPTED_BORDER_WIDTHS as readonly string[]).includes(token)) return token;
      warnUnmappedLegacy("border width", token, ACCEPTED_BORDER_WIDTHS);
      return token;
    })
    .join(" ");
}
