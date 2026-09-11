import type { CSSProperties } from "react";

/**
 * Maps Polaris spacing tokens (and legacy numeric tokens) to CSS variables
 * with pixel fallbacks for resilient cross-environment styling.
 */
export const spacingToCssMap: Record<string, string> = {
  none: "0px",
  "0": "0px",
  "025": "var(--p-space-025, 1px)",
  "small-500": "var(--p-space-025, 1px)",
  "050": "var(--p-space-050, 2px)",
  "small-400": "var(--p-space-050, 2px)",
  "100": "var(--p-space-100, 4px)",
  "small-300": "var(--p-space-100, 4px)",
  "150": "var(--p-space-150, 6px)",
  "200": "var(--p-space-200, 8px)",
  "small-200": "var(--p-space-200, 8px)",
  "300": "var(--p-space-300, 12px)",
  "small-100": "var(--p-space-300, 12px)",
  small: "var(--p-space-300, 12px)",
  "400": "var(--p-space-400, 16px)",
  base: "var(--p-space-400, 16px)",
  medium: "var(--p-space-400, 16px)",
  "500": "var(--p-space-500, 20px)",
  large: "var(--p-space-500, 20px)",
  "600": "var(--p-space-600, 24px)",
  "large-100": "var(--p-space-600, 24px)",
  "800": "var(--p-space-800, 32px)",
  "large-200": "var(--p-space-800, 32px)",
  "1000": "var(--p-space-1000, 40px)",
  "large-300": "var(--p-space-1000, 40px)",
  "1200": "var(--p-space-1200, 48px)",
  "large-400": "var(--p-space-1200, 48px)",
  "1600": "var(--p-space-1600, 64px)",
  "large-500": "var(--p-space-1600, 64px)",
  "2000": "var(--p-space-2000, 80px)",
  "2400": "var(--p-space-2400, 96px)",
  "2800": "var(--p-space-2800, 112px)",
  "3200": "var(--p-space-3200, 128px)",
};

/**
 * Resolves single, multi-token, number, or responsive spacing to valid CSS values.
 */
export function resolveSpacing(spacing: unknown): string | undefined {
  if (spacing === undefined || spacing === null) return undefined;

  if (typeof spacing === "number") {
    return `${spacing}px`;
  }

  if (typeof spacing === "object") {
    const values = Object.values(spacing as Record<string, unknown>);
    if (values.length > 0) {
      return resolveSpacing(values[0]);
    }
    return undefined;
  }

  if (typeof spacing !== "string") return undefined;

  const trimmed = spacing.trim();
  if (!trimmed) return undefined;

  return trimmed
    .split(/\s+/)
    .map((token) => spacingToCssMap[token] ?? token)
    .join(" ");
}

/**
 * Maps alignment keywords (e.g. "start", "end") to valid CSS flex values ("flex-start", "flex-end").
 */
export function mapAlignment(val?: string): string | undefined {
  if (!val) return undefined;
  if (val === "start") return "flex-start";
  if (val === "end") return "flex-end";
  return val;
}
